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

// the app is listening on
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

// previous code :'(
// app.get('/', async (req, res) => {
//     try {
//         let result;
//         // so only the first time it will fetch the content from the server the rest will be fetched from the client side
//         if (blacklistFlags.length > 0) {
//             const response = await axios.get(`${URL}/${category}${blacklistFlags}`);
//             result = response.data;
//             // console.log(result)
//         } else {
//             const response = await axios.get(`${URL}/${category}`);
//             result = response.data;
//         }

//         if (result.type == 'twopart') {
//             res.render('index.ejs', { setup: result.setup, delivery: result.delivery })
//         }
//         else {
//             res.render('index.ejs', { setup: result.joke, delivery: null })
//         }

//         // res.render('index.ejs', { setup: JSON.stringify(result.setup), delivery: JSON.stringify(result.delivery) })
//     } catch (error) {
//         console.error('error code: ', error.response);
//     }
// });

app.get('/', async (req, res) => {
    try {
        const url = blacklistFlags.length > 0 
            ? `${URL}/${category}${blacklistFlags}` 
            : `${URL}/${category}`;
        
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
        const response = await axios.get(URL + '/' + category);
        const result = response.data;
        if (!result) {
            console.log('result is not send!');
        }
        console.log(result)
        res.json(result);
    } catch (error) {
        console.error('error message: ', error.response);
        res.status(500);
    }
});

app.patch('/blacklistFlags', (req, res) => {
    blacklistFlags = req.body.blackLists;
    console.log('app.patch() is running in the server');
    console.log(blacklistFlags);
});

