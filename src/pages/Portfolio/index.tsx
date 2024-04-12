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
import { signal } from "@preact/signals";
import { Edit } from "./components/portfolio-edit";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import PortfolioDropdown from "./components/portfolio-select";
import PortfolioTable from "./components/portfolio-table";
import PortQRCode from "@/components/portfolio-qr-code";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

const activeFilter = signal("market_cap");

const filter_ports = signal([])

const Portfolio = () => {
    
    const [total_port_value,setTotalPortValue] = useState(0);
    const [activePortVal,setActivePortVal] = useState(0);
    const [activePortName,setActivePortName] = useState(0);
    const [port,setActivePort] = useState(null);
    const [portOptions,setPortOptions] = useState(null);
    const [showCreate,setShowCreate] = useState(false);
    const [showQRCode,setShowQRCode] = useState(false);

    useEffect(() => {
        if (portfolio_data.value && cryptos_map.value) {
          if(!port) setActivePort(portfolio_data.value[0])
          let totalValue = 0;
          portfolio_data.value.forEach((port) => {
            let portValue = 0;
            port.coins.forEach((coin) => {
              if (cryptos_map.value[coin.crypto]) {
                portValue += coin.amount * cryptos_map.value[coin.crypto].current_price;
              }
            });
            totalValue += portValue;
          });
          setTotalPortValue(totalValue);
        }
    }, [portfolio_data.value, cryptos_map.value]);

    const handleSetActivePort = (a) => {
        setActivePort(a);
    }
    

    useEffect(()=>{
        console.log(port);
        console.log(!port)
        if(!port) {
            setShowCreate(true);
        } else {
            setShowCreate(false);
        }
    },[port])
    
    useEffect(()=>{
        if(!port) return
        
        setActivePortName(port.name);

    },[port])
    console.log(port)
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
                        <PortfolioDropdown
                            cryptosMap={cryptos_map.value}
                            activePortName={activePortName}
                            setActivePortName={setActivePortName}
                            setActivePort={handleSetActivePort}
                            setShowCreate={setShowCreate}
                        />
                    
                        </div>
                    </div>

                    {showCreate && <Create />}

                    {(port && !showCreate) &&
                    <div class="w-full">

                        <PortfolioTable portfolioName={port.name} setActivePort={handleSetActivePort}/>
                        
                        {/* <div>
                            <Button onClick={()=>setShowQRCode(!showQRCode)}>Show Data</Button>
                        </div>
                        
                        {showQRCode &&
                            <div>
                                <PortQRCode />
                            </div>
                        } */}

                    </div>
                    }
                </div>
        )
    }
}

export default Portfolio

