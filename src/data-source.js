require("reflect-metadata"); //exigência técnica do TypeORM para ler as configurações das tabelas
require("dotenv").config(); //protege a senha do banco
const { DataSource } = require("typeorm");
const Aluno = require("./entities/Aluno");
const Disciplina = require("./entities/Disciplina");
const Matricula = require("./entities/Matricula");

const usaUrl = !!process.env.DATABASE_URL; //verifica se existe um link de banco de dados na nuvem. !! força a resposta a ser um booleano 

//conexão com o banco de dados. atua como a ponte entre o Node.js e o PostgreSQL. ler as senhas, estabelecer a rede e avisar o TypeORM sobre quais tabelas existem

const AppDataSource = new DataSource({
  type: "postgres",
  ...(usaUrl //operador spread do JavaScript. pega no resultado do if/else e bota as propriedades dentro do objeto principal do DataSource
    ? { //Se estiver no computador (usaUrl é falso), conecta no localhost. Se estiver na nuvem conecta ao banco online
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, //obrigatório para bancos em nuvem modernos
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASS || "postgres",
        database: process.env.DB_NAME || "escola",
      }),
  synchronize: true, // cria/atualiza as tabelas automaticamente, recomendado pra fins didaticos
  logging: false,
  entities: [Aluno, Disciplina, Matricula],
});

module.exports = AppDataSource;
