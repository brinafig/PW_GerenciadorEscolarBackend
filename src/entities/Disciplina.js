const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Disciplina",
  tableName: "disciplinas",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nome: { type: "varchar", length: 120 },
    codigo: { type: "varchar", length: 20, unique: true },
    carga_horaria: { type: "int", default: 60 },
  },
  relations: {
    matriculas: {
      type: "one-to-many", //uma disciplina pode ter N matrículas
      target: "Matricula",
      inverseSide: "disciplina",
    },
  },
});
