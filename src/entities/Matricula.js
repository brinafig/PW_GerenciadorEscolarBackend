const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Matricula",
  tableName: "matriculas",
  columns: {
    id: { primary: true, type: "int", generated: true },
    aluno_id: { type: "int" },
    disciplina_id: { type: "int" },
    data_matricula: { type: "date", default: () => "CURRENT_DATE" },
    nota: { type: "decimal", precision: 4, scale: 2, nullable: true }, //opcional, 4 numeros, 2 depois da virgula
  },
  relations: {
    aluno: {
      type: "many-to-one", //muitas matriculas pra um aluno 
      target: "Aluno",
      joinColumn: { name: "aluno_id" }, //aponta pra chave estrangeira
      onDelete: "CASCADE", // pra manter integridade. apaga um aluno apaga todas as matriculas dele junto.
      eager: true, //recurso do TypeORM pra jazer um join e retornar tudo sobre o objeto quando fizer um find
    },
    disciplina: {
      type: "many-to-one",
      target: "Disciplina",
      joinColumn: { name: "disciplina_id" },
      onDelete: "CASCADE",
      eager: true,
    },
  },
  uniques: [{ columns: ["aluno_id", "disciplina_id"] }], //pra evitar que um aluno seja matriculado 2x na mesma disciplina
});
