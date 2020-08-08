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
  const installmentsValue =
    parseFloat(purchaseQuery.totalAmount) /
    parseInt(purchaseQuery.installments);
  try {
    const data = JSON.parse(await readFile("./registros/compras.json"));
    const purchase = {
      id: data.nextId,
      descrição: purchaseQuery.description,
      parcelas: purchaseQuery.installments,
      valor_total: purchaseQuery.totalAmount,
      valor_parcelas: installmentsValue,
      data: moment().format("DD/MM/yyyy"),
      pessoa_id: purchaseQuery.buyer,
      cartao_id: purchaseQuery.card,
    };

    data.nextId++;
    data.compras.push(purchase);

    await distributeInstallments(
      purchase.id,
      installmentsValue,
      purchaseQuery.installments,
      purchaseQuery.card
    );
    await writeFile("./registros/compras.json", JSON.stringify(data));

    res.redirect("http://localhost:5500/views/compras/menu.html");
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

async function distributeInstallments(
  installmentId,
  installmentValue,
  installments,
  cardId
) {
  const invoices = JSON.parse(await readFile("./registros/faturas.json"));

  const parcelas = {
    id: installmentId,
    valor_parcela: installmentValue,
  };

  if (parseInt(cardId) === 1) {
    let card = await invoices.cartoes.find((thisCard) => {
      return parseInt(thisCard.id) === 1;
    });

    let index = card.faturas.findIndex((fatura) => {
      return fatura.mes === moment().format("MM/yyyy");
    });

    if (parseInt(moment().format("DD")) > 5) {
      for (let i = 1; i <= installments; i++) {
        if (!invoices.cartoes[0].faturas[index + i]) {
          await createFatura(invoices, 0, index + i, i);
        }

        invoices.cartoes[0].faturas[index + i].compras.push(parcelas);
      }
    } else {
      for (let i = 0; i <= installments; i++) {
        if (!invoices.cartoes[0].faturas[index + i]) {
          await createFatura(invoices, 0, index + i, i);
        }

        invoices.cartoes[0].faturas[index + i].compras.push(parcelas);
      }
    }
  }

  if (parseInt(cardId) === 2) {
    let card = await invoices.cartoes.find((thisCard) => {
      return parseInt(thisCard.id) === 2;
    });

    console.log(card);

    let index = card.faturas.findIndex((fatura) => {
      return fatura.mes === moment().format("MM/yyyy");
    });

    console.log(index);

    if (parseInt(moment().format("DD")) >= 15) {
      for (let i = 1; i <= installments; i++) {
        if (!invoices.cartoes[1].faturas[index + i]) {
          await createFatura(invoices, 1, index + i, i);
        }

        invoices.cartoes[1].faturas[index + i].compras.push(parcelas);
      }
    } else {
      for (let i = 0; i < installments; i++) {
        if (!invoices.cartoes[1].faturas[index + i]) {
          await createFatura(invoices, 1, index + i, i);
        }

        invoices.cartoes[1].faturas[index + i].compras.push(parcelas);
      }
    }
  }
  await writeFile("./registros/faturas.json", JSON.stringify(invoices));
}

async function createFatura(invoices, card, index, i) {
  const month = moment().add(i, "month");

  console.log(moment(month).format("MM/yyyy"));

  const fatura = {
    id: invoices.cartoes[card].nextId,
    compras: [],
    mes: moment(month).format("MM/yyyy").toString(),
  };
  invoices.cartoes[card].nextId++;

  invoices.cartoes[card].faturas.push(fatura);
  await writeFile("./registros/faturas.json", JSON.stringify(invoices));
}

export default router;
