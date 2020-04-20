// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transactionExists = await transactionsRepository.find({
      where: { id },
    });

    if (!transactionExists) {
      throw new Error('Transaction do not exists.');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
