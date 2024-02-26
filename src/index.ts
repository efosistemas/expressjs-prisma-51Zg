import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.get("/users", async (req, res) => {
  const users = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(users);
});

app.post("/user", async (req, res) => {
  const {name,email,password} = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password
    },
  });

  return res.json(user);
});


app.get("/", async (req, res) => {
  res.send(
    `
  <h1>User REST API</h1>
  `.trim(),
  );
});

app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
