![](/frontend/src/assets/logo.svg)

***

Projeto para controle de despesas, suportando inserir grande dados com arquivos csv.

***

![](/frontend/src/assets/Design/Início.svg)
***

![](/frontend/src/assets/Design/Importar.svg)

Foi desenvolvido utilizando NodeJs e Typescript, PostgreSQL, Docker.

# Para iniciar o backend


      git clone https://github.com/gacl97/goFinances.git
      cd goFinaces
      cd backend


Primeiro será necessário baixar as dependências do projeto:

      yarn

É necessário ter instalado o docker e criar um container para o postgres

      docker run --name gofinances-postgres -e POSTGRES_USER=docker -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=gofinances -p 5432:5432 -d postgres

Após ter criado o banco no docker, precisamos rodar as migrations do projeto

      yarn typeorm migration:run

E por fim executar o servidor e utilizar a aplicação

      yarn dev:server


## Para iniciar o frontend

    cd frontend

Para baixar as dependências

      yarn

Para executar 

      yarn start