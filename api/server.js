const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://aditya:aditya@cluster0.ntkoj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology:true
})
    .then(() => console.log("Connect to DB"))
    .catch(console.error);

const Todo = require('./models/Todo');

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();

    res.json(todos);
});

app.post('/todo/new', async (req, res) => {
    const todo = await new Todo({
        text: req.body.text
    });

    todo.save();

    res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);

    res.json(result);
});


app.get('/todo/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        todo.complete = !todo.complete;
        await todo.save();

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));