const express = require("express");
const AppDataSource = require("../data-source");

//evitar escrever o CRUD repetido pra todas as entidades
function crudRouter(entityName, camposPermitidos) { //recebe qual entidade vai ser manipulada e um vetor com os nomes das colunas que o usuário pode para preencher
  const router = express.Router();
  const repo = () => AppDataSource.getRepository(entityName);

  const filtrar = (body) => { //mecanismo de segurança. pega os dados que chegam do frontend e varre o vrtor de camposPermitidos. devolve um objeto limpo apenas com os dados autorizados
    const dados = {};
    camposPermitidos.forEach((c) => {if (body[c] !== undefined) dados[c] = body[c];});
    return dados;
  };

  const tratarErro = (res, err) => { //códigos de erro padrão do PostgreSQL. O TypeORM repassa esse erro quando uma restrição do banco falha.
    // 23505 = violacao de unique e 23503 = violacao de chave estrangeira
    if (err.code === "23505")
      return res.status(409).json({ erro: "Registro duplicado." });
    if (err.code === "23503")
      return res.status(400).json({ erro: "Referencia invalida." });
    if (err.code === "22P02" || err.code === "23502")
      return res.status(400).json({ erro: "Dados invalidos ou faltando." });
    console.error(err);
    return res.status(500).json({ erro: "Erro interno do servidor." });
  };

  router.get("/", async (req, res) => { //bscam todos os registros ordenados por ID
    try {
      res.json(await repo().find({ order: { id: "ASC" } }));
    } catch (err) {
      tratarErro(res, err);
    }
  });

  router.get("/:id", async (req, res) => { //bscam um registro específico.
    try {
      const item = await repo().findOneBy({ id: Number(req.params.id) });
      if (!item) return res.status(404).json({ erro: "Nao encontrado." });
      res.json(item);
    } catch (err) {
      tratarErro(res, err);
    }
  });

  router.post("/", async (req, res) => { //cria um novo registro. 
    try {
      const novo = await repo().save(repo().create(filtrar(req.body))); //repo().create() prepara o objeto e repo().save() executa o INSERT no banco
      const completo = await repo().findOneBy({ id: novo.id }); //faz uma nova busca para devolver o objeto inteiro (eager das relacoes) criado agora
      res.status(201).json(completo);
    } catch (err) {
      tratarErro(res, err);
    }
  });

  router.put("/:id", async (req, res) => { //atualiza 
    try {
      const id = Number(req.params.id);
      const item = await repo().findOneBy({ id });
      if (!item) return res.status(404).json({ erro: "Nao encontrado." });
      await repo().update(id, filtrar(req.body));
      res.json(await repo().findOneBy({ id }));
    } catch (err) {
      tratarErro(res, err);
    }
  });

  router.delete("/:id", async (req, res) => { //deleta
    try {
      const resultado = await repo().delete(Number(req.params.id));
      if (resultado.affected === 0)
        return res.status(404).json({ erro: "Nao encontrado." });
      res.status(204).send();
    } catch (err) {
      tratarErro(res, err);
    }
  });

  return router;
}

module.exports = crudRouter;
