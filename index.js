const dotnev = require('dotenv');
dotnev.config(); // Load the .env file

const { generate, generateText, readTextFile, financialFunctions } = require('./functions');
const functionDeclaration = require('./functionDeclaration');

// Initialize the generative model
const { GoogleGenerativeAI, FunctionDeclarationSchemaType } = require("@google/generative-ai");
const generativeAI = new GoogleGenerativeAI( process.env.API_KEY );


const express = require('express');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const morgan = require('morgan');

var session = require('express-session');
const { get } = require('http');
const app = express();


let IP = "192.168.162.81"; // Send to the IP of the machine in the network below to run the se4rver and access the website from another device in the same network
let PORT = 8080;
app.listen(PORT, function(){
  console.log('Server is running on port ' + PORT);
//   console.log('server is running on host: ' + IP);
//   console.log('http://' + IP + ':'+ PORT);
    console.log('http://localhost:'+ PORT);
});


app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index', { company: "" });
});

app.post('/chooseCompany', (req, res) => {
    let company = req.body.company;
    console.log(company);
    res.render('index', { company: company });
});


// Model with functions
const model = generativeAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { maxOutputTokens: 2000, temperature: 0.9 },
    tools: {
        functionDeclarations: [functionDeclaration.currentDateAndQuarterFunctionDeclaration],
    },
});

console.log("Generative AI initialized")


generate(model, "You are my financial advisor.");

// console.log(financialResults.timeRemaining({ futuredate: "2025-12-24" }));
// (async () => {
//     const dd = await financialFunctions.quaterlyFinancialResults({ year: 2022, quarter: 1, companySymbol: "ABB" });
//     console.log(dd);
// })(); 
// // dd = await financialFunctions.quaterlyFinancialResults({ year: 2022, quarter: 1, companySymbol: "ABB" });
financialFunctions.quaterlyFinancialResults({ year: 2022, quarter: 1, companySymbol: 'TATAMOTORS' })
    .then(row => {
        console.log('Matched row:', row);
    })
    .catch(err => {
        console.error('Error:', err);
});