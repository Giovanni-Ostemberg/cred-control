import express from "express";
import { promises as fs } from "fs";
import cors from "cors";

const { readFile, writeFile } = fs;

const app = express();

app.use(express.json());
app.use(cors());

const router = express.Router();

router.get("/", async (req, res) => {
  const purchases = JSON.parse(await readFile("./registros/compras.json"));
  console.log(purchases);
  res.send(purchases);
});

router.get("/create", async (req, res) => {
  let purchase = req.query;
  console.log(purchase);
  try {
    const data = JSON.parse(await readFile("./registros/compras.json"));
    purchase = {
      id: data.nextId++,
      name: purchase.name,

      Id: data.nextId,
      Descrição: purchase.description,
      parcelas: purchase.installments,
      valor_total: purchase.totalAmount,
      valor_parcela: purchase.totalAmount / purchase.installments,
      data: new Date(),
      pessoa_id: purchase.personId,
    };

    data.pessoas.push(purchase);

    await writeFile("./registros/compras.json", JSON.stringify(data));
    res.redirect("http://localhost:5500/views/compras/ok.html");
  } catch (err) {
    console.log(err);
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    let data = JSON.parse(await readFile("./registros/compras.json"));
    data.compras = data.compras.filter((purchase) => {
      return parseInt(purchase.id) !== parseInt(req.params.id);
    });

    await writeFile("./registros/compras.json", JSON.stringify(data));
    res.redirect("http://localhost:5500/views/compras/menu.html");
  } catch (err) {
    console.log(err);
  }
});

export default router;
