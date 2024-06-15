const dotnev = require('dotenv');
dotnev.config(); // Load the .env file

const { chat, generateText, readTextFile, financialFunctions } = require('./functions');
const functionDeclaration = require('./functionDeclaration');

// Initialize the generative model
const { GoogleGenerativeAI, FunctionDeclarationSchemaType } = require("@google/generative-ai");
const generativeAI = new GoogleGenerativeAI( process.env.API_KEY );


const express = require('express');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const morgan = require('morgan');

console.log("Hello World");

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
    res.render('index');
});


// // model with functions
// const financialResultsFunctionDeclaration = {
//     name: "timeRemaining",
//     parameters: {
//         type: "OBJECT",
//         description: "Calculate the number of days remaining until a future date.",
//         properties: {
//             futuredate: {
//                 type: "STRING",
//                 description: "The future date to calculate the remaining days for, in a format recognized by the Date constructor.",
//             },
//         },
//         required: ["futuredate"],
//     },
// };


// const financialResults = {
//     timeRemaining: async ({ futuredate }) => {
//         const now = new Date();
//         const future = new Date(futuredate);
//         const diff = future - now;
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         return days;
//     }
// }

// Model with functions
const model = generativeAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: {
        functionDeclarations: [functionDeclaration.currentDateAndQuarterFunctionDeclaration, functionDeclaration.companySymbolsFunctionDeclaration, functionDeclaration.getQuarterEndDateFunctionDeclaration, functionDeclaration.quaterlyFinancialResultsFunctionDeclaration],
    },
});

console.log("Generative AI initialized");

async function loadPromptAndSendToModel(filePath, generativeAI) {
    try {
        const prompt = await readTextFile(filePath);
        // console.log("Prompt: ", prompt);
        chat(generativeAI, prompt);
        // generateText(generativeAI, prompt);
    } catch (error) {
        console.error("Error reading file:", error);
    }
}

// loadPromptAndSendToModel("./Prompts/prompt.txt", generativeAI);



// const modelWithFunctions = generativeAI.getGenerativeModel({
//     model: "gemini-pro",
//     tools: {
//         functionDeclarations : [financialResultsFunctionDeclaration],
//     },
// });

async function chatt(model) {
    const chat = model.startChat();
    const prompt = "What is the symbol for Reliance industries?";
    const prompt2 = "Write a short poem on dogs.";
    const result = await chat.sendMessage(prompt);
    const call = result.response.functionCalls()[0];
    console.log(call);
    
    if (call) {
        const apiResponse  = await financialFunctions[call.name](call.args);
        // console.log(apiResponse);

        const result = await chat.sendMessage([{ functionResponse: {
            name: call.name,
            response: apiResponse,
        }}]);
        console.log(result.response.text());
    }
}

// console.log(financialResults.timeRemaining({ futuredate: "2025-12-24" }));
chatt(model);
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