require("reflect-metadata");
require("dotenv").config();
const express = require("express"); //framework web
const cors = require("cors"); //liberador de acesso de rede
const AppDataSource = require("./data-source");
const crudRouter = require("./routes/crudRouter");

//ponto de entrada do backend. arquivo principal que o Node.js executa para ligar o servidor, 
// juntar banco de dados e rotas, e ficar escutando os pedidos do frontend

const app = express();
app.use(cors()); //pra nao bloquear o react de conversar com a API
app.use(express.json()); //pro express ler json

app.get("/", (req, res) => res.json({ status: "API do Gerenciador Escolar no ar" })); // se abrir o localhost a API ta ativa

app.use("/alunos", crudRouter("Aluno", ["nome", "email", "data_nascimento"])); //quando chega um pedido repassa nome da entidade e campos permitidos
app.use("/disciplinas", crudRouter("Disciplina", ["nome", "codigo", "carga_horaria"]));
app.use("/matriculas", crudRouter("Matricula", ["aluno_id", "disciplina_id", "data_matricula", "nota"]));

const PORT = process.env.PORT || 3001; //define o servidor. na nuvem a plataforma escolhe a porta e no pc é 3001 padrao

AppDataSource.initialize() //tenta conectar no PostgreSQL. se der certo, ele manda o Express ligar o servidor web. Se falhar ele desliga o processo para não deixar uma API quebrada rodando
  .then(() => {
    console.log("Conectado ao PostgreSQL");
    app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Erro ao conectar no banco:", err);
    process.exit(1);
  });
