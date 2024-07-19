const xlsx = require('xlsx');
const fs = require('fs');
const readline = require('readline');
const csv = require('csv-parser');
const path = require('path');
const https = require('https');
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
async function chat(model, info) {
    console.log("Type 'exit' to quit the chat");
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

    async function ask() {
        rl.question("You: ", async (msg) => {
            if (msg.toLowerCase() === "exit") {
                rl.close();
            } else {
                // Token count
                console.log("Sending message...");
                const history = await chat.getHistory();
                const msgContent = { role: "user", parts: [{ text: msg }] };
                const contents = [...history, msgContent];
                const { totalTokens } = await model.countTokens({ contents });
                console.log("Total tokens: ", totalTokens);

                // Using streaming for less wait time
                const result = await chat.sendMessageStream(msg);
                const call = result.response.functionCalls()[0];
                if (call) {
                    console.log("There is a function call");
                }
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
async function downloadXMLFile(url, downloadLocation) {
    return new Promise((resolve, reject) => {
        const filename = path.basename(url);
        const filePath = path.join(downloadLocation, filename);
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const file = fs.createWriteStream(filePath);
        https.get(url, response => {
            response.pipe(file);
    
            file.on('finish', () => {
            file.close();
            console.log(`File downloaded successfully: ${filePath}`);
            resolve();
            });
        }).on('error', err => {
            fs.unlink(filePath); // Delete the file in case of error
            console.error(`Error downloading file: ${err}`);
            reject(err);
        });
    });
}



const financialFunctions = {
    // 1. Quaterly financial results
    // 2. Current date and quarter
    // 3. Time remaining for the quater to end
    // 4. Company symbol
    currentDateAndQuarter: async () => {
        const now = new Date();
        const month = now.getMonth();
        const quarter = Math.floor((month + 3) / 3);
        const year = now.getFullYear();
        return { year: year, quarter: quarter , date: now.toDateString().split(" ").slice(1).join(" ")};
    },
    companySymbols: async () => {
        // Get the company symbol from the company name
        // Using the file form the NSE website that lsits all the companies according to their market cap
        const sheets = xlsx.readFile('src/MCAP28032024.xlsx');
        const sheet = sheets.Sheets[sheets.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        const symbolDictionary = {};
        // First line is the header
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const key = row[2];  // Column C
            const value = row[1]; // Column B
            // console.log(key, value);
            if (key && value) {
                symbolDictionary[key] = value;
            }
        }
        const dictionaryString = JSON.stringify(symbolDictionary, null, 2);
    
        return symbolDictionary;
    },
    getQuarterEndDate(year, quarter) {
        let month;
        switch (quarter) {
            case 1:
                month = 3;
                break;
            case 2:
                month = 6;
                break;
            case 3:
                month = 9;
                break;
            case 4:
                month = 12;
                break;
            default:
                throw new Error('Invalid quarter. Quarter should be between 1 and 4.');
        }
        const endDate = new Date(year, month, 0);
        return endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    },
    
    quaterlyFinancialResults: async ({ year, quarter, companySymbol }) => {
        return new Promise((resolve, reject) => {
            const folderPath = 'src/Financial_result/Quaterly';
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    console.error("Error reading the directory: ", err);
                    reject(err);
                    return;
                }
        
                const file = files.find(file => file.includes(companySymbol));
                const filePath = `${folderPath}/${file}`;
        
                const quaterEndDate = financialFunctions.getQuarterEndDate(year, quarter);
                console.log(quaterEndDate);
        
                const readStream = fs.createReadStream(filePath).pipe(csv());
        
                let matchedRow = null;
                readStream.on('data', (row) => {
                    if (row['PERIOD ENDED'] === quaterEndDate) {
                        matchedRow = row;
                        // Download the xml file
                        const url = row['** XBRL'];
                        const downloadLocation = 'src/XML';

                        downloadXMLFile(url, downloadLocation)
                            .then(() => {
                                console.log("XML file downloaded successfully");
                            })
                            .catch((err) => {
                                console.error("Error downloading XML file: ", err);
                            });
                    }
                });
        
                readStream.on('end', () => {
                    if (matchedRow) {
                        resolve(matchedRow);
                    } else {
                        reject(new Error('No matching row found'));
                    }
                });
        
                readStream.on('error', (err) => {
                    reject(err);
                });
            });
        });
    },
}
module.exports = {
    chat,
    generateText,
    readTextFile,
    financialFunctions,
};