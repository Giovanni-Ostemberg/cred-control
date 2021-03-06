window.addEventListener("load", start);
window.addEventListener("reload", start);

/*import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const app = express();
app.use(express.json());*/

const buttonCreate = document.querySelector("#new-person");

async function start() {
  const dados = await listAll();
  await imprimir(dados);
  await handleMenu();
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
      "</td><td><button class='button-delete' value='" +
      person.id +
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

async function createPerson() {
  const form = document.querySelector("#people-actions");
  form.innerHTML =
    "<form action='http://localhost:3000/pessoas/create' method='GET'><input name='name' type='text'/><button type='submit'>Submit</button></form>";
  await listAll();
}

async function deletePerson() {
  const res = await fetch(
    "http://localhost:3000/pessoas/delete/" + parseInt(event.target.value)
  );
  console.log(res);
}
