const dotnev = require('dotenv');
dotnev.config(); // Load the .env file

const { chat } = require('./functions');
const { generateText, readTextFile } = require('./functions');

// Initialize the generative model
const { GoogleGenerativeAI } = require("@google/generative-ai");
const generativeAI = new GoogleGenerativeAI( process.env.API_KEY );


console.log("Generative AI initialized");



// Load the prompt from a file and sending it to the generative model
(async () => {
    try {
        const prompt = await readTextFile("./Prompts/prompt.txt");
        // console.log("Prompt: ", prompt);
        chat(generativeAI, prompt);
        // generateText(generativeAI, prompt);
    } catch (error) {
        console.error("Error reading file:", error);
    }
})();