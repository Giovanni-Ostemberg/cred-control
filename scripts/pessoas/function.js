window.addEventListener("load", start);

/*import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const app = express();
app.use(express.json());*/

const buttonCreate = document.querySelector("#new-person");

async function start() {
  const dados = await listAll();
  await imprimir(dados);
  handleMenu();
}

async function listAll() {
  const res = await fetch("http://localhost:3000/pessoas/");
  const json = res.json();
  return json;
}

async function imprimir(data) {
  const lista = document.querySelector("#people-list");

  data.pessoas.forEach((person) => {
    lista.innerHTML +=
      "<tr><td>" +
      person.id.toString() +
      "</td><td>" +
      person.name.toString() +
      "<td></tr>";
  });
}

function handleMenu() {
  buttonCreate.addEventListener("click", createPerson);
}

function createPerson() {
  const form = document.querySelector("#people-actions");
  form.innerHTML =
    "<form action='http://localhost:3000/pessoas/create' method='GET'><input name='name' type='text'/><button type='submit'>Submit</button></form>";
  // '<form action="http://localhost:3000/pessoas/create" method="POST">
  // <input name="nome" type="text" />
  // <button type="submit">Submit</button>
  // </form>';
}
