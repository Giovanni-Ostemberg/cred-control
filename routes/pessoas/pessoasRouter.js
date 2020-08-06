import express from "express";
import { promises as fs } from "fs";
import cors from "cors";

const { readFile, writeFile } = fs;

const app = express();

app.use(express.json());
app.use(cors());

const router = express.Router();

router.get("/", async (req, res) => {
  const people = JSON.parse(await readFile("./registros/pessoas.json"));
  console.log(people);
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
    res.redirect("http://localhost:5500/views/pessoas/ok.html");
  } catch (err) {
    console.log(err);
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    let data = JSON.parse(await readFile("./registros/pessoas.json"));
    data.pessoas = data.pessoas.filter((person) => {
      return parseInt(person.id) !== parseInt(req.params.id);
    });

    await writeFile("./registros/pessoas.json", JSON.stringify(data));
    res.redirect("http://localhost:5500/views/pessoas/menu.html");
  } catch (err) {
    console.log(err);
  }
});

export default router;
