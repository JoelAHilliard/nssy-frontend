import { effect, signal } from "@preact/signals";
import { time } from "console";
import { useEffect } from "preact/hooks";
const API_URL = "https://api.nssy.xyz/prices";
const GRAPH_API_URL = "https://api.nssy.xyz/";
// const API_URL = "http://localhost:5001/prices";

export const market_data = signal(null);

export const portfolio_data = signal([]);
export const cryptos_list = signal([]);
export const cryptos_map = signal([]);

export const tableData = signal(null);

const graphData = {};


export const loadPortfolios = () =>{
    let portfolios = localStorage.getItem("portfolios");
    portfolio_data.value = JSON.parse(portfolios);
}
export const getMarketData = () => {
    loadPortfolios();
    fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      market_data.value = data;
      console.log(data)
      cryptos_list.value = data.map((crypto) => ({
          "name": crypto.name,
          "symbol": crypto.symbol,
          "img": crypto.img,
          "daily": crypto.dailyChange,
      }));
      cryptos_map.value =  data.reduce((map, crypto) => {
              map[crypto.name] = crypto;
              return map;
          }, {});
      if(!portfolio_data.value){
        portfolio_data.value = [];
      }
      if (portfolio_data.value.length > 0) {
        const startTime = performance.now(); // Start timing
  
        portfolio_data.value.forEach(portfolio => {
          portfolio.coins.forEach(portfolioCoin => {
            let marketCoin = market_data.value.find(mCoin => mCoin.symbol === portfolioCoin.crypto.symbol);
              if (marketCoin) {
                portfolioCoin.crypto = marketCoin;
              }
          });
        });
  
        const endTime = performance.now(); // End timing
  
        console.log(`Update Time: ${endTime - startTime} milliseconds`);
      }
  
      // Sort and update table data if needed
      tableData.value = data.sort((a, b) => b.market_cap - a.market_cap);
    });
  

}

export const getGraphData = (params) => {
  let ticker = params.ticker || "BTC";
  let timeframe = params.timeframe || "24hr";
  const cacheKey = ticker + "_" + timeframe;

  // Check if data is cached and return it wrapped in a Promise
  if (graphData[cacheKey]) {
    return Promise.resolve(graphData[cacheKey]);
  }

  // If not cached, fetch new data and cache it
  return fetch(GRAPH_API_URL + "getGraphData?symbol=" + ticker.toLowerCase() + "&timeframe=" + timeframe)
    .then((res) => res.json())
    .then((data) => {
      graphData[cacheKey] = data;
      return data;
    });
};
export const getGlobal = () => {
  // Check if data is cached and return it wrapped in a Promise
  if(graphData["global"]){
    return Promise.resolve(graphData["global"])
  }
  return fetch(GRAPH_API_URL+"global")
    .then((res) => res.json())
    .then((data) => {
      graphData["global"] = data;
      return data;
    });
};