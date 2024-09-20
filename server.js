import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

const URL = 'https://v2.jokeapi.dev/joke/';
let category = "Any";

// the app is listening on
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(URL+category);
        const result = response.data;
        console.log(result)
        if (result.type == 'twopart') {
            res.render('index.ejs', { setup: result.setup, delivery: result.delivery })
        }
        else {
            res.render('index.ejs', { setup: result.joke, delivery: null })
        }
        // res.render('index.ejs', { setup: JSON.stringify(result.setup), delivery: JSON.stringify(result.delivery) })
    } catch (error) {
        console.error('error code: ', error.response);
    }
});


// changing the category value
app.post('/', (req, res) => {
    category = req.body.selectedValue;
    console.log('category is : ', category);
});

app.get('/json', async (req, res) => {
    try {
        const response = await axios.get(URL+category);
        const result = response.data;
        if(!result) {
            console.log('result is not send!');
        }
        console.log(result)    
        res.json(result);
    } catch (error) {
        console.error('error message: ', error.response);
        res.status(500);
    }
});

