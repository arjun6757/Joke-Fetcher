import express from "express";
import API from "./router/api.js"
const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// the app is listening on
app.use('/api', API)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

app.get('/', async (req, res) => {
    try {
        res.render('index.ejs')
    }
    catch (error) {
        res.status(error.status | 500).json({ message: error.message || "Error while loading ejs" })
    }
})

app.get('/', (req, res) => {
    res.send("hello")
})