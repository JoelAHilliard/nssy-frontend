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


  //sorted entries
  const sortedAggregate = Object.fromEntries(
    Object.entries(aggregatedCoins).sort((a,b)=>{
      return (a[1] * cryptos_map.value[a[0]].p) - (b[1] * cryptos_map.value[b[0]].p)
    })
  )
  
  const options = {
    series: [{
      type: 'pie',
      name: 'Coin Percentage',
      data: Object.entries(sortedAggregate).map(([crypto, amount]) => {
        const price = cryptos_map.value[crypto] ? cryptos_map.value[crypto].p.toFixed(2) : null;
        return { name: crypto, y: parseFloat((parseFloat(amount) * price).toFixed(2)) };
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
    tooltip: { pointFormat: '<b>${point.y} {point.percentage:.1f}%</b>' }
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