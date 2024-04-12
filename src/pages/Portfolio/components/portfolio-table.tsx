import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { cryptos_map, portfolio_data } from "@/preact-service";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Edit } from "./portfolio-edit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
const PortfolioTable = ({portfolioName, handleDelete}) =>{
    const port = portfolio_data.value.find((c) => c.name === portfolioName);
    
    const options = {
        series: [{
          type: 'pie',
          name: 'Coin Percentage',
          data: port.coins.map(coin => {
            const price = cryptos_map.value[coin.crypto] ? cryptos_map.value[coin.crypto].current_price : null;
            return ({
                name: coin.crypto,
                y: coin.amount * price // Assumes getCoinPrice() returns the current price of the coin in USD
          })}),
          color: '#3B82F6',
          borderColor: "transparent",
          fillColor: 'rgba(59, 130, 246, 0.3)',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }],
        credits: {
          enabled: false
        },
        chart: {
          opacity: 0.5,
          backgroundColor: "transparent",
          type: 'pie',
          height: 200
        },
        title: {
          text: undefined
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        }
    };
    
    let activePortVal = 0;
                                
    for(let i = 0;i<port.coins.length;i++){
        activePortVal += port.coins[i].amount * cryptos_map.value[port.coins[i].crypto].current_price
    }

    if(!port) return <span>port null</span>
    return (
        <div class="w-full mx-auto pt-0 mt-0">
                            
        <div class="w-[100%] flex flex-col mt-0">
            <span class="mt-2 text-xl font-bold">{port.name}  <span class="underline font-thin text-lg">{activePortVal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></span>
            <span class="text-muted-foreground text-sm">{port.description}</span>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
            <Edit portfolio={port.name} handleDelete={handleDelete}/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Daily</TableHead>
                        <TableHead>Weekly</TableHead>
                        <TableHead>Monthly</TableHead>
                        <TableHead className="text-right">USD Holdings</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {port.coins.length < 1 ? (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center">
                                None added.
                            </TableCell>
                        </TableRow>
                    ) : (
                        port.coins.map((crypto, index) => {
                            const coinData = cryptos_map.value[crypto.crypto];
                            
                            if (!coinData) {
                                return null; 
                            }

                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium flex flex-row items-center">
                                    <Avatar className="h-8 w-8 flex flex-row">
                                        <AvatarImage src={coinData.image ? coinData.image : null} />
                                        <AvatarFallback>{coinData.symbol}</AvatarFallback>
                                    </Avatar>
                                    <div class="flex flex-col ml-1">
                                        <span>{crypto.crypto}</span> 
                                        <span class="text-muted-foreground">{coinData.symbol.toUpperCase()}</span> 
                                    </div>
                                    </TableCell>
                                    <TableCell>{crypto.amount}</TableCell>
                                    <TableCell>{coinData.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                    <TableCell className="font-medium text-left table-cell">
                                        {coinData.price_change_percentage_24h_in_currency ? (
                                            coinData.price_change_percentage_24h_in_currency > 0 ? (
                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-green-600">
                                                <ChevronUp size="16px" color="green" />
                                                {coinData.price_change_percentage_24h_in_currency.toFixed(2)}%
                                            </a>
                                            ) : (
                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-red-600">
                                                <ChevronDown size="16px" color="red" />
                                                {coinData.price_change_percentage_24h_in_currency.toFixed(2)}%
                                            </a>
                                            )
                                        ) : (
                                            <a href={"/" + coinData.symbol}>
                                                "N/A"
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-left table-cell">
                                        {coinData.price_change_percentage_24h_in_currency ? (
                                            coinData.price_change_percentage_24h_in_currency > 0 ? (
                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-green-600">
                                                <ChevronUp size="16px" color="green" />
                                                {coinData.price_change_percentage_24h_in_currency.toFixed(2)}%
                                            </a>
                                            ) : (
                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-red-600">
                                                <ChevronDown size="16px" color="red" />
                                                {coinData.price_change_percentage_24h_in_currency.toFixed(2)}%
                                            </a>
                                            )
                                        ) : (
                                            <a href={"/" + coinData.symbol}>
                                                "N/A"
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-left table-cell">
                                        {coinData.price_change_percentage_30d_in_currency ? (
                                            coinData.price_change_percentage_30d_in_currency > 0 ? (
                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-green-600">
                                                <ChevronUp size="16px" color="green" />
                                                {coinData.price_change_percentage_30d_in_currency.toFixed(2)}%
                                            </a>
                                            ) : (
                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-red-600">
                                                <ChevronDown size="16px" color="red" />
                                                {coinData.price_change_percentage_30d_in_currency.toFixed(2)}%
                                            </a>
                                            )
                                        ) : (
                                            <a href={"/" + coinData.symbol}>
                                                "N/A"
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">{(coinData.current_price * crypto.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
        </div>
    )
}

export default PortfolioTable;