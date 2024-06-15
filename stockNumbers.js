const yahooFinance = require('yahoo-finance2').default;


async function getStockChart(ticker, tickerOptions) {
    try {
        const result = await yahooFinance.chart(ticker, tickerOptions);
        console.log(result);
    } catch (error) {
        console.error('Error getting stock chart:', error);
    }
}
// getStockChart('RELIANCE' + ".NS", { period1: '2020-01-01', period2: '2021-01-01', interval: '1d', return: 'object'});

async function numbers(ticker,  returnOptions = {return : 'map'}) {
    // Return as map or object, those are easier to deal with when seeing results for multiple tickers
    try {
        const result = await yahooFinance.quote(ticker, returnOptions);
        // // access the stock numbers by ticker
        // console.log(result.get("AAPL"));
        console.log(result);
    } catch (error) {
        console.error('Error getting stock numbers:', error);
    }
}
// numbers(["AAPL", "TSLA"]);


async function getDayGainers(queryOptions){
    // TODO: Errors here
    try {
        const result = await yahooFinance.dailyGainers(queryOptions);
        console.log(result);
    } catch (error) {
        console.error('Error getting day gainers:', error);
        console.error('We are here ++++++++++++++++++++++++++++++++++++');
    }
}
// const queryOptionss = { count: 5, region: 'US', lang: 'en-US' };
// getDayGainers(queryOptionss);
// getDayGainers({ count: 5, region: 'US', lang: 'en-US' });




async function fundamentalNumbers(ticker, queryOptions) {
    try {
        const result = await yahooFinance.fundamentalsTimeSeries(ticker, queryOptions);
        console.log(result);
    } catch (error) {
        console.error('Error fetching screener results:', error);
    }
}

// fundamentalNumbers('KAYNES.NS' , { period1: '2020-01-01',  module: 'all' });

async function insights(ticker, queryOptions) {
    // No use as of now, there maybe no indian data available
    try {
        const result = await yahooFinance.insights(ticker, queryOptions);
        console.log(result);
    } catch (error) {
        console.error('Error fetching insights:', error);
    }
}

// insights('AAPL', { lang: 'en-US', reportsCount: 5, region: 'NS' });

// (async () => {
//     const result = await yahooFinance.quote('AAPL', { return: 'object' });
//     console.log(result);
// })();

async function quote(ticker, queryOptions){
    try {
        const result = await yahooFinance.quote(ticker, queryOptions);
        console.log(result);
    } catch (error) {
        console.error('Error fetching insights:', error);
    }
}


module.exports = {
    getStockChart,
    numbers,
    getDayGainers,
    fundamentalNumbers
};