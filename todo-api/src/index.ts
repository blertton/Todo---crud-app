import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json())
app.use(cors())

app.get("/api/todo", async (req, res) => {

    const todo = await prisma.todo.findMany();

    res.json(todo)
})

app.post("/api/todo", async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).send("title field is required")
    }

    try {
        const todo = await prisma.todo.create({
            data: { title }
        })
        res.json(todo)
    } catch (error) {
        res
            .status(500)
            .send("something went wrong")
    }
})

app.put("/api/todo/:id", async (req, res) => {
    const { title } = req.body;
    const id = parseInt(req.params.id);

    if (!title) {
        return res.status(400).send("title field is required")
    }

    if (!id || isNaN(id)) {
        return res.status(400).send("Id must be valid");
    }

    try {
        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: { title }
        })
        res.json(updatedTodo)
    } catch (error) {
        res
            .status(500)
            .send("something went wrong")
    }
})

app.delete("/api/todo/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res.status(400).send("Id must be valid");
    }

    try {
        await prisma.todo.delete({
            where: { id }
        })
        res.status(204).send();
    } catch (error) {
        res
            .status(500)
            .send("something went wrong");
    }
})

app.listen(5000, () => {
    console.log("server is running on port 5000");

})
