import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { cryptos_map, portfolio_data } from "@/preact-service";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Edit } from "./portfolio-edit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { effect } from "@preact/signals";
import PortfolioDropdown from "./portfolio-select";

const PortfolioTable = ({portName,cryptos}) =>{
    const port = portfolio_data.value.filter((p)=> p.name === portName)[0];
    console.log(port)
    const options = {
        series: [{
          type: 'pie',
          name: 'Coin Percentage',
          data: port.coins.map(coin => {
            const price = cryptos[coin.crypto] ? cryptos[coin.crypto].p : null;
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
          pointFormat: '<b>{point.percentage:.1f}%</b>'
        }
    };
    
    let activePortVal = 0;
                                
    for(let i = 0;i<port.coins.length;i++){
        activePortVal += port.coins[i].amount * cryptos[port.coins[i].crypto].p
    }

    if(!port) return <span>port null</span>
    console.log(port)
    return (
        <div class="w-full mx-auto pt-0 mt-0">
                            
        <div class="w-[100%] flex flex-col mt-0">
            <div class='flex'>
                <div class="flex flex-col justify-center items-center w-[50%]">
                    <span class="mt-2 text-xl font-bold">{port.name}  <span class="underline font-thin text-lg">{activePortVal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></span>
                    <span class="text-muted-foreground text-sm">{port.description}</span>
                </div>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </div>
           
            <Edit portfolio={portName} />
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
                            const coinData = cryptos[crypto.crypto];
                            console.log(coinData)
                            if (!coinData) {
                                return null; 
                            }

                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium flex flex-row items-center">
                                    <Avatar className="h-8 w-8 flex flex-row">
                                        <AvatarImage src={coinData.img ? coinData.img : null} />
                                        <AvatarFallback>{coinData.s}</AvatarFallback>
                                    </Avatar>
                                    <div class="flex flex-col ml-1">
                                        <span>{crypto.crypto}</span> 
                                        <span class="text-muted-foreground">{coinData.s.toUpperCase()}</span> 
                                    </div>
                                    </TableCell>
                                    <TableCell>{crypto.amount}</TableCell>
                                    <TableCell>{coinData.p.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                    <TableCell className="font-medium text-left table-cell">
                                        {coinData.d ? (
                                            coinData.d > 0 ? (
                                            <a href={"/" + coinData.s} class="flex items-start justify-start gap-0.5 text-green-600">
                                                <ChevronUp size="16px" color="green" />
                                                {coinData.d.toFixed(2)}%
                                            </a>
                                            ) : (
                                            <a href={"/" + coinData.s} class="flex items-start justify-start gap-0.5 text-red-600">
                                                <ChevronDown size="16px" color="red" />
                                                {coinData.d.toFixed(2)}%
                                            </a>
                                            )
                                        ) : (
                                            <a href={"/" + coinData.s}>
                                                "N/A"
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-left table-cell">
                                        {coinData.d ? (
                                            coinData.d > 0 ? (
                                            <a href={"/" + coinData.s} class="flex items-start justify-start gap-0.5 text-green-600">
                                                <ChevronUp size="16px" color="green" />
                                                {coinData.d.toFixed(2)}%
                                            </a>
                                            ) : (
                                            <a href={"/" + coinData.s} class="flex items-start justify-start gap-0.5 text-red-600">
                                                <ChevronDown size="16px" color="red" />
                                                {coinData.d.toFixed(2)}%
                                            </a>
                                            )
                                        ) : (
                                            <a href={"/" + coinData.s}>
                                                "N/A"
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-left table-cell">
                                        {coinData.m ? (
                                            coinData.m > 0 ? (
                                            <a href={"/" + coinData.s} class="flex items-start justify-start gap-0.5 text-green-600">
                                                <ChevronUp size="16px" color="green" />
                                                {coinData.m.toFixed(2)}%
                                            </a>
                                            ) : (
                                            <a href={"/" + coinData.s} class="flex items-start justify-start gap-0.5 text-red-600">
                                                <ChevronDown size="16px" color="red" />
                                                {coinData.m.toFixed(2)}%
                                            </a>
                                            )
                                        ) : (
                                            <a href={"/" + coinData.s}>
                                                "N/A"
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">{(coinData.p * crypto.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
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