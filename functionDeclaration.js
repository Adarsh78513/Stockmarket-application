const currentDateAndQuarterFunctionDeclaration = {
    name: "currentDateAndQuarter",
    parameters: {
        type: "OBJECT",
        description: "Get the current year, date and quarter.",
        properties: {},
        required: [],
    },
};

const companySymbolsFunctionDeclaration = {
    name: "companySymbols",
    parameters: {
        type: "OBJECT",
        description: "Get a dictionary of company symbols and their corresponding names, for use in financial analysis. The keys are the company names and the values are the company symbols. These symbols can be used to fetch financial data for the companies.",
        properties: {},
        required: [],
    },
};


const getQuarterEndDateFunctionDeclaration = {
    name: "getQuarterEndDate",
    parameters: {
        type: "OBJECT",
        description: "Get the end date of a given quarter in a specific year",
        properties: {
            year: {
                type: "NUMBER",
                description: "The year for which to get the quarter end date.",
            },
            quarter: {
                type: "NUMBER",
                description: "The quarter (1, 2, 3, or 4) for which to get the end date.",
            },
        },
        required: ["year", "quarter"],
    },
};

const quaterlyFinancialResultsFunctionDeclaration = {
    name: "quaterlyFinancialResults",
    parameters: {
        type: "OBJECT",
        description: "Get the financial results of a given company, for a certain quarter",
        properties: {
            year: {
                type: "NUMBER",
                description: "The year for which to get the financial results.",
            },
            quarter: {
                type: "NUMBER",
                description: "The quarter (1, 2, 3, or 4) for which to get the financial results.",
            },
            companySymbol: {
                type: "STRING",
                description: "The symbol of the company for which to get the financial results.",
            },
        },
        required: ["year", "quarter", "companySymbol"],
    },
};

module.exports = {
    currentDateAndQuarterFunctionDeclaration,
    companySymbolsFunctionDeclaration,
    getQuarterEndDateFunctionDeclaration,
    quaterlyFinancialResultsFunctionDeclaration,
};