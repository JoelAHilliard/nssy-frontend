import { portfolio_data,cryptos_list,cryptos_map } from "@/preact-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, EditIcon, PlusCircle, PlusCircleIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import Highcharts, { chart } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import DropDownMenu from "@/components/dropdown-menu";
import Create from "./components/portfolio-create"
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
import { effect, signal } from "@preact/signals";
import { Edit } from "./components/portfolio-edit";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import PortfolioDropdown from "./components/portfolio-select";
import PortfolioTable from "./components/portfolio-table";
import PortQRCode from "@/components/portfolio-qr-code";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import CombinedPie from "./components/portfolio-combined-pie";

const Portfolio = () => {
    const [total_port_value,setTotalPortValue] = useState(0);
    const [activePortVal,setActivePortVal] = useState(0);
    const [activePortName,setActivePortName] = useState(0);
    const [port,setActivePort] = useState(null);
    const [portOptions,setPortOptions] = useState(null);
    const [showCreate,setShowCreate] = useState(false);
    const [showQRCode,setShowQRCode] = useState(false);
    const [denom,setDenom] = useState("USD");

    const handleSetActivePort = (a) => {
        setActivePort(a);
    }

    useEffect(()=>{
        if(portfolio_data.value[0]) {
            setActivePort(portfolio_data.value[0])
            
        } else {
            setShowCreate(true);
        }
    },[portfolio_data.value])

    useEffect(()=>{

        if(denom === "USD"){
            let portValue = 0;

            portfolio_data.value.forEach((port) => {
                port.coins.forEach((coin) => {
                    if (cryptos_map.value[coin.crypto]) {
                        portValue += coin.amount * cryptos_map.value[coin.crypto].p;
                    }
                })

                setTotalPortValue(portValue)
            });
        } else if(denom === "BTC"){
            let portValue = 0;

            portfolio_data.value.forEach((port) => {
                port.coins.forEach((coin) => {
                    if (cryptos_map.value[coin.crypto]) {
                        portValue += coin.amount * cryptos_map.value[coin.crypto].p;
                    }
                })

                const btcPrice = cryptos_map.value['Bitcoin'].p

                setTotalPortValue(portValue / btcPrice)
            });

        } else {
            //ETH
            let portValue = 0;

            portfolio_data.value.forEach((port) => {
                port.coins.forEach((coin) => {
                    if (cryptos_map.value[coin.crypto]) {
                        portValue += coin.amount * cryptos_map.value[coin.crypto].p
                    }
                })
                const ethPrice = cryptos_map.value['Ethereum'].p
                setTotalPortValue(portValue / ethPrice)
            });
        }
        
    
    },[denom])

    useEffect(() => {
        if (portfolio_data.value && cryptos_map.value) {
          if(!port) setActivePort(portfolio_data.value[0])
          let totalValue = 0;
          portfolio_data.value.forEach((port) => {
            let portValue = 0;
            port.coins.forEach((coin) => {
              if (cryptos_map.value[coin.crypto]) {
                portValue += coin.amount * cryptos_map.value[coin.crypto].p;
              }
            });
            totalValue += portValue;
          });
          setTotalPortValue(totalValue);
        }
    }, [portfolio_data.value, cryptos_map.value]);

    useEffect(()=>{ 
        if(portfolio_data.value.length>0){
            setActivePort(portfolio_data.value[0])
            setShowCreate(false);
        }
    },[portfolio_data.value])
    
    return Object.keys(cryptos_map.value).length > 0 ? 
            !port ? <Create/> :
            <div class="flex py-2 max-w-screen-xl mx-auto w-full flex-col items-center justify-start gap-2 px-2">
                <div class="flex flex-row justify-between w-full">
                <div className="inline-flex flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md items-center justify-center w-full">
                    <div class="flex w-full justify-between p-2">
                        <span className="relative inline-block px-6 py-3 whitespace-nowrap font-bold transition duration-300 ease-in-out transform hover:scale-102 hover:shadow-md group">
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 rounded-lg"></span>
                            <span className="relative z-10 text-gray-800 dark:text-gray-100 transition duration-300 ease-in-out group-hover:text-white text-center mx-auto flex justify-center">
                                Total Val: {denom === "USD" ? total_port_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : denom === "BTC" ? total_port_value.toFixed(3) + " BTC" : total_port_value.toFixed(2) + " ETH"}
                            </span>
                        </span>
                    
                    </div>
                    <div class="w-full">
                        
                        <CombinedPie />

                    </div>
                    <div class="flex w-full justify-around gap-2 px-1 py-1">
                        <Button className="w-full" variant="outline" onClick={()=>{setDenom("USD")}}>USD</Button>
                        <Button className="w-full"  variant="outline" onClick={()=>{setDenom("BTC")}}>BTC</Button>
                        <Button className="w-full"  variant="outline" onClick={()=>{setDenom("ETH")}}>ETH</Button>
                    </div>
                   
                </div>
                   

                </div>
                {showCreate && <Create />}

                {(port && !showCreate) &&
                    <div class="w-full">
                        <div class="flex w-full justify-end">
                            <PortfolioDropdown
                                cryptosMap={cryptos_map.value}
                                activePortName={port.name}
                                setActivePortName={setActivePortName}
                                setActivePort={handleSetActivePort}
                                setShowCreate={setShowCreate}
                            />
                        </div>
                        
                        <PortfolioTable portName={port.name} cryptos={cryptos_map.value}/>

                    </div>
                }
            </div>
        : 
        <div class='w-full'>
            <Skeleton className="w-full" />
        </div>
}

export default Portfolio

