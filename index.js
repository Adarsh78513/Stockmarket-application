const dotnev = require('dotenv');
dotnev.config(); // Load the .env file

const { chat, generateText, readTextFile, financialFunctions } = require('./functions');

// Initialize the generative model
const { GoogleGenerativeAI, FunctionDeclarationSchemaType } = require("@google/generative-ai");
const generativeAI = new GoogleGenerativeAI( process.env.API_KEY );


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


// model with functions
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

// const modelWithFunctions = generativeAI.getGenerativeModel({
//     model: "gemini-pro",
//     tools: {
//         functionDeclarations : [financialResultsFunctionDeclaration],
//     },
// });

// async function chatt() {
//     const chat = modelWithFunctions.startChat();
//     const prompt = "Calculate the number of days remaining until 23 december 2025.";
//     const result = await chat.sendMessage(prompt);
//     const call = result.response.functionCalls();
//     console.log(call);
// }

// console.log(financialResults.timeRemaining({ futuredate: "2025-12-24" }));
// chatt();
// (async () => {
//     const dd = await financialFunctions.quaterlyFinancialResults({ year: 2022, quarter: 1, companySymbol: "ABB" });
//     console.log(dd);
// })(); 
// // dd = await financialFunctions.quaterlyFinancialResults({ year: 2022, quarter: 1, companySymbol: "ABB" });
financialFunctions.quaterlyFinancialResults({ year: 2022, quarter: 1, companySymbol: 'ABB' })
    .then(row => {
        console.log('Matched row:', row);
    })
    .catch(err => {
        console.error('Error:', err);
});