window.addEventListener("load", start);
window.addEventListener("reload", start);

/*import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const app = express();
app.use(express.json());*/

const buttonCreate = document.querySelector("#new-purchase");

async function start() {
  const dados = await listAll();
  await imprimir(dados);
  await handleMenu();
}

async function listAll() {
  const res = await fetch("http://localhost:3000/compras/");
  const json = res.json();
  return json;
}

async function imprimir(data) {
  const lista = document.querySelector("#purchase-list");

  data.pessoas.forEach((person) => {
    lista.innerHTML +=
      "<tr><td>" +
      purchase.id.toString() +
      "</td><td>" +
      purchase.name.toString() +
      "</td><td><button class='button-delete' value='" +
      purchase.id +
      "'>-</button></td></tr>";
  });
}

async function handleMenu() {
  const buttonDelete = document.querySelectorAll(".button-delete");
  buttonCreate.addEventListener("click", createPerson);
  buttonDelete.forEach((button) => {
    button.addEventListener("click", deletePerson);
  });
}

async function createPurchase() {
  const form = document.querySelector("#purchase-actions");
  form.innerHTML =
    "<form action='http://localhost:3000/compras/create' method='GET'><input name='name' type='text'/><button type='submit'>Submit</button></form>";
  await listAll();
}

async function deletePurchase() {
  const res = await fetch(
    "http://localhost:3000/compras/delete/" + parseInt(event.target.value)
  );
  console.log(res);
}
