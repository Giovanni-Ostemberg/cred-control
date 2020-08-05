import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const app = express();

app.use(express.json());

const router = express.Router();

router.get("/", async (req, res) => {
  const people = JSON.parse(await readFile("./registros/pessoas.json"));
  console.log(people);
  //   res.setHeader("POST", people);
  //   res.redirect("http://127.0.0.1:5500/views/pessoas/menu.html");
  res.send(people);
});

router.get("/create", async (req, res) => {
  let person = req.query;
  console.log(person.name);
  try {
    const data = JSON.parse(await readFile("./registros/pessoas.json"));
    person = {
      id: data.nextId++,
      name: person.name,
    };

    data.pessoas.push(person);

    await writeFile("./registros/pessoas.json", JSON.stringify(data));
    res.redirect("http://localhost:5500/views/pessoas/menu.html");
  } catch (err) {
    console.log(err);
  }
});

export default router;
