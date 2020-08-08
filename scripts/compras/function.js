window.addEventListener("load", start);
window.addEventListener("reload", start);

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

  data.compras.forEach((purchase) => {
    lista.innerHTML +=
      "<tr><td>" +
      purchase.id.toString() +
      "</td><td>" +
      purchase.descrição.toString() +
      "</td><td>" +
      purchase.valor_total +
      "</td><td><button class='button-delete' value='" +
      purchase.id +
      "'>-</button></td></tr>";
  });
}

async function handleMenu() {
  const buttonDelete = document.querySelectorAll(".button-delete");
  buttonCreate.addEventListener("click", createPurchase);
  buttonDelete.forEach((button) => {
    button.addEventListener("click", deletePurchase);
  });
}

async function createPurchase() {
  const form = document.querySelector("#purchase-actions");
  form.innerHTML =
    "<form action='http://localhost:3000/compras/create' method='GET'><input name='description' type='text' placeholder='Descrição'/><input name='installments' type='number' placeholder='Parcelas'><input name='totalAmount' type='text' placeholder='Valor Total'><input name='buyer' type='number' placeholder='Comprador'><input name='card' type='number' placeholder='Cartão'><button type='submit'>Submit</button></form>";
  await listAll();
}

async function deletePurchase() {
  const res = await fetch(
    "http://localhost:3000/compras/delete/" + parseInt(event.target.value)
  );
  console.log(res);
}
