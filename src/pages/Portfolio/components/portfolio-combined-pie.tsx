import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { portfolio_data, cryptos_map } from "@/preact-service";



  
function CombinedPie(){
    const aggregatedCoins = {};
  
    portfolio_data.value.forEach(portfolio => {
      portfolio.coins.forEach(coin => {
        const { crypto, amount } = coin;
        if (aggregatedCoins[crypto]) {
          aggregatedCoins[crypto] += parseFloat(amount);
        } else {
          aggregatedCoins[crypto] = parseFloat(amount);
        }
      });
    });
  
  const options = {
    series: [{
      type: 'pie',
      name: 'Coin Percentage',
      data: Object.entries(aggregatedCoins).map(([crypto, amount]) => {
        const price = cryptos_map.value[crypto] ? cryptos_map.value[crypto].p : null;
        return { name: crypto, y: (amount * price) };
      }),
      color: '#3B82F6',
      borderColor: "transparent",
      fillColor: 'rgba(59, 130, 246, 0.3)',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
      }
    }],
    credits: { enabled: false },
    chart: {
      opacity: 0.5,
      backgroundColor: "transparent",
      type: 'pie',
      height: 200
    },
    title: { text: undefined },
    legend: { enabled: false },
    tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b>' }
  };
    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}

export default CombinedPie