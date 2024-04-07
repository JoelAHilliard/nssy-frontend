import { portfolio_data,cryptos_list,cryptos_map } from "@/preact-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, EditIcon, PlusCircle, PlusCircleIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import Highcharts, { chart } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import DropDownMenu from "@/components/dropdown-menu";
import Create from "./components/create"
import {ChevronUp, Plus} from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

import { useEffect, useState } from "preact/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signal } from "@preact/signals";
import { Edit } from "./components/edit";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";

const activeFilter = signal("market_cap");

const filter_ports = signal([])

const Portfolio = () => {
    
    const [total_port_value,setTotalPortValue] = useState(0);
    const [activePortVal,setActivePortVal] = useState(0);
    const [activePortName,setActivePortName] = useState(0);
    const [port,setActivePort] = useState(null);
    const [portOptions,setPortOptions] = useState(null);
    const [showCreate,setShowCreate] = useState(false);

    useEffect(() => {
        if (portfolio_data.value && cryptos_map.value) {
          let totalValue = 0;
          portfolio_data.value.forEach((port) => {
            let portValue = 0;
            port.coins.forEach((coin) => {
              if (cryptos_map.value[coin.crypto]) {
                portValue += coin.amount * cryptos_map.value[coin.crypto].current_price[0];
              }
            });
            totalValue += portValue;
          });
          setTotalPortValue(totalValue);
        }
    }, [portfolio_data.value, cryptos_map.value]);

    useEffect(()=>{
        if(!port) return
        
        setActivePortName(port.name);

        const options = {
            series: [{
              type: 'pie',
              name: 'Coin Percentage',
              data: port.coins.map(coin => {
                const price = cryptos_map.value[coin.crypto] ? cryptos_map.value[coin.crypto].current_price[0] : null;
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
        
        let port_val = 0;
                                
        for(let i = 0;i<port.coins.length;i++){
            port_val += port.coins[i].amount * cryptos_map.value[port.coins[i].crypto].current_price[0]
        }
        setActivePortVal(port_val);
        setPortOptions(options);
    },[port])

    
    if (cryptos_list.value.length == 0 || cryptos_map.value.length == 0 || !portfolio_data.value) {
        return <div class="flex py-2 max-w-screen-xl max-w-container mx-auto w-full flex flex-col items-center justify-start gap-2 px-2"><Skeleton className="h-[500px] w-full" /></div>;
    }
    
    if (portfolio_data.value.length < 1) {
        return (
            <div class="flex py-2 max-w-screen-xl max-w-container mx-auto w-full flex flex-col items-center justify-start gap-2 px-2">
                <Create />
            </div>
        );
    } else {
        if(port == null) setActivePort(portfolio_data.value[0])
        return (
                <div class="flex py-2 max-w-screen-xl max-w-container mx-auto w-full flex flex-col items-center justify-start gap-2 px-2">
                    <div class="flex items-start flex-col w-full gap-2">
                        <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                        <span className="relative inline-block px-6 py-3 text-lg font-bold transition duration-300 ease-in-out transform hover:scale-102 hover:shadow-md group mr-2">
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 rounded-l-lg"></span>
                            <span className="relative z-10 text-gray-800 dark:text-gray-100 transition duration-300 ease-in-out group-hover:text-white">
                                Combined Value: {total_port_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </span>
                        </span>
                            <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost" className="rounded-l-none">
                                <span class="underline">Select Portfolio ({portfolio_data.value.length})</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuRadioGroup value={activePortName} onValueChange={setActivePortName}>
                                {portfolio_data.value.length > 0 &&
                                    portfolio_data.value.map((port) => {
                                        // let port_val = 0;
                                        // for(let i = 0;i<port.coins.length;i++){
                                        //     port_val += cryptos_map.value[port.coins[i].crypto].current_price[0] * port.coins[i].amount
                                        // }

                                        let port_val = port.coins.reduce((acc, coin) => acc + cryptos_map.value[coin.crypto].current_price[0] * coin.amount, 0);
                                        return (
                                        <DropdownMenuRadioItem key={port.name} onClick={()=>{setActivePort(port); setShowCreate(false);}} value={port.name}>
                                                <span class="ml-auto"><span class="font-bold">{port.name}</span> {port_val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                        </DropdownMenuRadioItem>
                                    )})
                                }
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={()=>setShowCreate(true)}>
                                    <div class="flex flex-row w-full justify-between">
                                        <PlusCircle /> Create
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {showCreate && <Create />}

                    {(port && !showCreate) &&
                    <div class="w-full mx-auto pt-0 mt-0">
                        
                        <div class="w-[100%] flex flex-col mt-0">
                            <span class="mt-2 text-xl font-bold">{port.name}  <span class="underline font-thin text-lg">{activePortVal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></span>
                            <span class="text-muted-foreground text-sm">{port.description}</span>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={portOptions}
                            />
                            <Edit portfolio={port.name}/>
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
                                                        <AvatarImage src={coinData.img ? coinData.img : null} />
                                                        <AvatarFallback>{coinData.symbol}</AvatarFallback>
                                                    </Avatar>
                                                    <div class="flex flex-col ml-1">
                                                        <span>{crypto.crypto}</span> 
                                                        <span class="text-muted-foreground">{coinData.symbol.toUpperCase()}</span> 
                                                    </div>
                                                    </TableCell>
                                                    <TableCell>{crypto.amount}</TableCell>
                                                    <TableCell>{coinData.current_price[0]}</TableCell>
                                                    <TableCell className="font-medium text-left table-cell">
                                                        {coinData.dailyChange ? (
                                                            coinData.dailyChange > 0 ? (
                                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-green-600">
                                                                <ChevronUp size="16px" color="green" />
                                                                {coinData.dailyChange.toFixed(2)}%
                                                            </a>
                                                            ) : (
                                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-red-600">
                                                                <ChevronDown size="16px" color="red" />
                                                                {coinData.dailyChange.toFixed(2)}%
                                                            </a>
                                                            )
                                                        ) : (
                                                            <a href={"/" + coinData.symbol}>
                                                                "N/A"
                                                            </a>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-left table-cell">
                                                        {coinData.dailyChange ? (
                                                            coinData.dailyChange > 0 ? (
                                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-green-600">
                                                                <ChevronUp size="16px" color="green" />
                                                                {coinData.dailyChange.toFixed(2)}%
                                                            </a>
                                                            ) : (
                                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-red-600">
                                                                <ChevronDown size="16px" color="red" />
                                                                {coinData.dailyChange.toFixed(2)}%
                                                            </a>
                                                            )
                                                        ) : (
                                                            <a href={"/" + coinData.symbol}>
                                                                "N/A"
                                                            </a>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-left table-cell">
                                                        {coinData.monthlyChange ? (
                                                            coinData.monthlyChange > 0 ? (
                                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-green-600">
                                                                <ChevronUp size="16px" color="green" />
                                                                {coinData.monthlyChange.toFixed(2)}%
                                                            </a>
                                                            ) : (
                                                            <a href={"/" + coinData.symbol} class="flex items-start justify-start gap-0.5 text-red-600">
                                                                <ChevronDown size="16px" color="red" />
                                                                {coinData.monthlyChange.toFixed(2)}%
                                                            </a>
                                                            )
                                                        ) : (
                                                            <a href={"/" + coinData.symbol}>
                                                                "N/A"
                                                            </a>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">{(coinData.current_price[0] * crypto.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div> }
                </div>
        )
    }

}

export default Portfolio

