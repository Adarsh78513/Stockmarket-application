const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to read the prompt from a file
async function readTextFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// chat with the generative model
async function chat(generativeAI, info) {
    console.log("Type 'exit' to quit the chat");
    const model = generativeAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: info }],
            },
            {
                role: "model",
                parts: [{ text: "Great! What would you like to know?" }],
            },
        ],
        generationConfig: {
            maxOutputTokens:500,
        },
    });

    async function ask(question) {
        rl.question("You: ", async (msg) => {
            if (msg.toLowerCase() === "exit") {
                rl.close();
            } else {
                // Token count
                const history = await chat.getHistory();
                const msgContent = { role: "user", parts: [{ text: msg }] };
                const contents = [...history, msgContent];
                const { totalTokens } = await model.countTokens({ contents });
                console.log("Total tokens: ", totalTokens);

                // Using streaming for less wait time
                const result = await chat.sendMessageStream(msg);
                let text = "";
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    console.log(chunkText);
                    text += chunkText;
                }
                ask();
            }
        });
    }
    ask();
}


// fundtion to send the prompt to the generative model and generate the text
async function generateText(generativeAI, prompt) {
    console.log("Generating text...");
    const model = generativeAI.getGenerativeModel({ model: "gemini-pro" });
    // For text-only input
    const { totalTokens } = await model.countTokens(prompt);
    console.log("Total tokens: ", totalTokens);
        
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    console.log("Text generated successfully");
}

module.exports = {
    chat,
    generateText,
    readTextFile
};