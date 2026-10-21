const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({ //tira necessidade de ir no pgAdmin e criar as tabelas com código SQL 
  name: "Aluno",
  tableName: "alunos",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nome: { type: "varchar", length: 120 },
    email: { type: "varchar", length: 120, unique: true },
    data_nascimento: { type: "date", nullable: true },
  },
  relations: { //forma como o TypeORM cria as conexoes entre as tabelas
    matriculas: {
      type: "one-to-many", // 1 Aluno pode ter N Matrículas.
      target: "Matricula",
      inverseSide: "aluno", //dentro de matricula esta referenciado como aluno. Permite que ao buscar um Aluno eu consiga trazer automaticamente todas as matrículas dele e viceversa.
    },
  },
});
