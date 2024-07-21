// Very important, these functions will crash if the properties is not passed in the description
const currentDateAndQuarterFunctionDeclaration = {
    name: "currentDateAndQuarter",
    parameters: {
        type: "OBJECT",
        description: "Get the current year, date and quarter.",
        properties: {
            time: {
                type: "STRING",
                description: "The current time.",
            },
        },
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
    getQuarterEndDateFunctionDeclaration,
    quaterlyFinancialResultsFunctionDeclaration,
};