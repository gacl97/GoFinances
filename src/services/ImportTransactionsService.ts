import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository, getCustomRepository } from 'typeorm';
import CreateTransactionService from './CreateTransactionService';
import TransactionRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface RequestDTO {
  filepath: string;
}

interface TransactionData {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute({ filepath }: RequestDTO): Promise<Transaction[]> {
    const readCSVStream = fs.createReadStream(filepath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: TransactionData[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line;
      lines.push({ title, type, value, category });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactionsRepository = getCustomRepository(TransactionRepository);

    await fs.promises.unlink(filepath);

    const categoriesRepository = getRepository(Category);

    const categories = await categoriesRepository.find();

    const categoriesTitleAlreadyInDB: string[] = categories.map(
      category => category.title,
    );

    const categoriesTitleInCSV: string[] = lines.map(
      category => category.category,
    );

    const differentCategories = categoriesTitleInCSV.filter(category => {
      return !categoriesTitleAlreadyInDB.includes(category);
    });

    if (differentCategories.length > 0) {
      const newCategories = differentCategories.map(category =>
        categoriesRepository.create({ title: category }),
      );

      await categoriesRepository.save(newCategories);
    }

    const transactions = lines.map(transaction => {
      const categoryIndex = categories.findIndex(
        category => category.title === transaction.category,
      );
      const category_id = categories[categoryIndex].id;
      return transactionsRepository.create({
        title: transaction.title,
        value: Number(transaction.value),
        type: transaction.type,
        category_id,
      });
    });

    await transactionsRepository.save(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
