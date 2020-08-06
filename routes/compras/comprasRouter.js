import express from "express";
import { promises as fs } from "fs";
import moment from "moment";

const { readFile, writeFile } = fs;

const app = express();
const momento = moment();

app.use(express.json());

const router = express.Router();

router.get("/", async (req, res) => {
  const purchases = JSON.parse(await readFile("./registros/compras.json"));
  console.log(purchases);
  res.send(purchases);
});

router.get("/create", async (req, res) => {
  let purchaseQuery = req.query;
  console.log(purchase.description);
  try {
    const data = JSON.parse(await readFile("./registros/compras.json"));
    purchase = {
      id: data.nextId,
      descrição: purchaseQuery.description,
      parcelas: purchaseQuery.installments,
      valor_total: purchaseQuery.totalAmount,
      valor_parcelas: purchaseQuery.installmentsValue,
      data: moment().format("DD/MM/yyyy"),
      pessoa_id: purchaseQuery.buyer,
      cartao_id: purchaseQuery.card,
    };

    data.nextId++;
    data.compras.push(purchase);

    await writeFile(JSON.stringify(data));
    await distributeInstallments(
      purchase.id,
      purchaseQuery.installmentsValue,
      purchaseQuery.installment,
      purchaseQuery.card
    );
    res.end();
  } catch (err) {
    console.log(err);
  }
});

async function distributeInstallments(
  installmentId,
  installmentValue,
  installments,
  cardId
) {
  const invoices = JSON.parse(await readFile("./registros/faturas.json"));
  const date = moment(new Date(), "yyyy-MM-DD");
  console.log(moment().format("DD/MM/yyyy"));

  const parcelas = {
    id: installmentId,
    valor_parcela: installmentValue,
  };

  if (cardId === 1) {
    let card = await invoices.cartoes.find((thisCard) => {
      return parseInt(thisCard.id) === 1;
    });

    let index = card.faturas.findIndex((fatura) => {
      return fatura.mes === moment().format("MM/yyyy");
    });

    if (parseInt(moment().format("DD")) > 5) {
      for (let i = 1; i <= installments; i++) {
        if (!invoices.cartoes[0].faturas[index + 1]) {
          await createFatura(invoices, 0, index + 1, i);
        }
        console.log(invoices.cartoes[0].faturas[++index]);

        invoices.cartoes[0].faturas[index].compras.push(parcelas);
      }
    } else {
      for (let i = 0; i < installments; i++) {
        invoices.cartoes[0].faturas[++index].push(parcelas);
      }
    }
  }

  if (cardId === 2) {
  }
}

async function createFatura(invoices, card, index, i) {
  const month = moment().add(i, "month");

  console.log(moment(month).format("MM/yyyy"));

  const fatura = {
    id: invoices.cartoes[card].nextId,
    compras: [],
    data: moment(month).format("MM/yyyy").toString(),
  };
  invoices.cartoes[card].nextId++;

  invoices.cartoes[card].faturas.push(fatura);
  await writeFile("./registros/faturas.json", JSON.stringify(invoices));
}

export default router;
