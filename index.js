import express from "express";
import pessoasRouter from "./routes/pessoas/pessoasRouter.js";
import cors from "cors";

const app = express();

app.use(cors());

app.listen(3000, () => {
  console.log("Sistema Iniciado");
});

app.use("/pessoas", pessoasRouter);
