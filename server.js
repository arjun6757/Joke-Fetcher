import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

const URL = 'https://v2.jokeapi.dev/joke';
let category = "Any";
let blacklistFlags = '';
let safeActive = false;

// the app is listening on
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

app.get('/', async (req, res) => {
    try {
        let url = blacklistFlags.length > 0 
            ? `${URL}/${category}${blacklistFlags}` 
            : `${URL}/${category}`;
        
            if(safeActive) {
                url += '?safe-mode';
            }

        const { data: result } = await axios.get(url);

        const setup = result.type === 'twopart' ? result.setup : result.joke;
        const delivery = result.type === 'twopart' ? result.delivery : null;

        res.render('index.ejs', { setup, delivery });
    } catch (error) {
        console.error('Error code:', error.response ? error.response.data : error.message);
    }
});


app.get('/json', async (req, res) => {
    try {
        let url = `${URL}/${category}`;

        if(safeActive) 
            url += '?safe-mode';
        
        const response = await axios.get(url);
        const result = response.data;
        if (!result) {
            console.log('result is not send!');
        }
        console.log(result)
        if(result.error) {
            res.json({setup: result.message, delivery: null});
        } else {
            res.json(result);
        }
    } catch (error) {
        console.log(error.message);
    }
});

app.patch('/blacklistFlags', (req, res) => {
    blacklistFlags = req.body.blackLists;
    console.log('app.patch() is running in the server');
    console.log(blacklistFlags);
});

app.get('/safe', async (req, res) => {
    try {
        safeActive = true;
        const url = `${URL}/${category}?safe-mode`
        const response = await axios.get(url);
        const result = response.data;

        const setup = result.type === 'twopart' ? result.setup : result.joke;
        const delivery = result.type === 'twopart' ? result.delivery : null;

        res.render('index.ejs', { setup, delivery });
    } catch (err) {
        console.error(err);
    }
})