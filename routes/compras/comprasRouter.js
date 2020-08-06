import express from "express";
import { promises as fs } from "fs";
import moment from "moment";

const { readFile, writeFile } = fs;

const app = express();
const moment = moment();

app.use(express.json());

const router = express.Router();

router.get("/", async (req, res) => {
  const purchases = JSON.parse(await readFile("./registros/compras.json"));
  console.log(purchases);
  res.send(purchases);
});

router.get("/create", async (req, res) => {
    await distributeInstallments(_,_,_,1);

  let purchase = req.query;
  console.log(purchase.description);
  try {
    const data = JSON.parse(await readFile("./registros/pessoas.json"));
    purchase = {

    id: data.nextId++,
    descrição: purchase.description,
    parcelas: purchase.installments,
    valor_total: purchase.totalAmount,
    valor_parcelas: purchase.installmentsValue,
    data: new Data(),
    pessoa_id: purchase.buyer

    };

    // data.pessoas.push(purchase);

    // await writeFile("./registros/pessoas.json", JSON.stringify(data));
    // res.redirect("http://localhost:5500/views/pessoas/menu.html");
    await distributeInstallments(_,_,_,1);
    res.end();
  } catch (err) {
    console.log(err);
  }
});

async function distributeInstallments(installmentId, installmentValue, installments, cardId){
    const invoices = JSON.parse(await readFile("./registros/faturas.json"));
    const date = new Date();

    const parcelas = {
        "id": installmentId,
        "valor_parcela": installmentValue  
    }
    
    if(cardId === 1){
            let card = await invoices.cartoes.find(thisCard =>{
                return parseInt(thisCard.id) === 1; 
               });
               let index = card.faturas.findIndex(fatura =>{
                return fatura.mes === moment(date, 'MM/yyyy');
           });
            if(parseInt(moment.format(date, 'dddd'))>5){
                for(let i = 0; i<installments;i++){
               invoices.cartoes[0].faturas[++index].push(parcelas);              
            }

            }else{
                for(let i = 0; i<installments;i++){
           
                    invoices.cartoes[0].faturas[++index].push(parcelas);  
                }
            }
        }
        

        if(cardId === 2){

        }

    
}

export default router;
