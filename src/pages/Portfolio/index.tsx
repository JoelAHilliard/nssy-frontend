import { portfolio_data,market_data } from "@/preact-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreatePortfolio } from "./components/create-portfolio"
import { ChevronDown, EditIcon, PlusCircleIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,DialogClose
    
  } from "@/components/ui/dialog";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {ChevronUp} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

import { useEffect, useState } from "preact/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signal } from "@preact/signals";
import EditPortfolio from "./components/edit-portfolio";
const activeFilter = signal("market_cap");

const filter_ports = signal([])

const Portfolio = () => {
    const [crypto,setCrypto]=useState(null);

    const [price,setPrice]=useState(null);
    
    const [amount,setAmount]=useState(null);
    const [error,setError]=useState(false);
    
    const [currPortfolio,setCurrPortfolio] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(()=>{
        if(amount < 0 ) {
            setError(true)
        } else {
            setError(false)
        }
    },[amount])
    
    const addCrypto = (portfolio_name) =>{
        if(amount < 0){
            setError(true)
            return
        }
        setError(false)
        let portfolio_copy = [...portfolio_data.value];
        for(let i = 0;i < portfolio_copy.length;i++){
            if(portfolio_copy[i].name == portfolio_name){
                portfolio_copy[i].coins.push({"amount":amount,"crypto":crypto})
            }
        }
        portfolio_data.value = portfolio_copy;
        setCrypto(null);
        setSearch("");
        setAmount(null);
    };
    const cryptos_list = market_data.value ? market_data.value.map((crypto) => ({
            "name": crypto.name,
            "symbol": crypto.symbol,
        })) : [];
    const cryptos_map = market_data.value 
        ? market_data.value.reduce((map, crypto) => {
            map[crypto.name] = crypto;
            return map;
        }, {})
        : {};
	const handleClick = (filter,dir,port) => {
        activeFilter.value = filter;
        const copy = portfolio_data.peek(); // get clone of data
        let team_data = sortBy(copy, filter,dir, port);
        portfolio_data.value = team_data;
    };

	function sortBy(ports, filter, dir, port) {
        //create copy

        let ports_copy = [...ports];

        let obj = {};
        obj[port.name] = filter
        filter_ports.value.push(obj);
        for(let i = 0;i<ports_copy.length;i++){
            if(ports_copy[i].name === port.name){
                
                if(dir === 'd'){
                    if(filter === 'current_price'){
                        ports_copy[i].coins.sort((a,b)=> {
                            return b.crypto[filter][0] - a.crypto[filter][0]
                        })
                    } else if(filter === 'amount'){
                        ports_copy[i].coins.sort((a,b)=> {
                            return Number(b[filter]) - Number(a[filter])
                        })
                    }
                    else {
                        ports_copy[i].coins.sort((a,b)=> {
                            return b.crypto[filter] - a.crypto[filter]
                        })
                    }
                }
                else{
                    if(filter === 'current_price'){
                        ports_copy[i].coins.sort((a,b)=> {
                            return a.crypto[filter][0] - b.crypto[filter][0]
                        })
                    }  else if(filter === 'amount'){
                        ports_copy[i].coins.sort((a,b)=> {
                            return Number(a[filter]) - Number(b[filter])
                        })
                    }else {
                        ports_copy[i].coins.sort((a,b)=> {
                            return a.crypto[filter] - b.crypto[filter]
                        })
                    }
                }

                return ports_copy
            }
        }
        return ports_copy;
   
      
    }
	function intToString(num, fixed) {
		if (num === null) { return null; } 
		if (num === 0) { return '0'; } 
		fixed = (!fixed || fixed < 0) ? 0 : fixed; 
		var b = (num).toPrecision(2).split("e"),
			k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), 
			c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), 
			d = c < 0 ? c : Math.abs(c), 
			e = d + ['', 'K', 'M', 'B', 'T'][k]; 
		return e;
	}
    if(!portfolio_data.value){
        return (
            <CreatePortfolio />
        )
    }
    if(portfolio_data.value && market_data.value){
        return(
            <div class="flex py-2 max-w-screen-xl max-w-container mx-auto w-full flex flex-col items-center justify-start gap-2 px-2">
                 <CreatePortfolio />
                 <span>
                    Total:
                        {" " + intToString(portfolio_data.value.reduce((accumulator,port)=> {
                                return accumulator + port.coins.reduce((accumulator, coin) => {
                                    return accumulator + (Number(coin.amount) * coin.crypto.current_price[0]);
                                },0)
                        },0),true)}


                 </span>
                {portfolio_data.value.map((port)=>{
                    return(
                        <Card className="w-full">
                            <CardHeader className="flex flex-row  justify-between gap-4">
                                <div class="flex flex-row items-center gap-4">
                                    <CardTitle className="mt-[6px]">{port.name}</CardTitle>
                                    <EditPortfolio portfolio={port} portName={port.name}/>
                                
                                    <Dialog>
                                    <DialogTrigger><Button variant="outline"><PlusIcon/></Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add to portfolio</DialogTitle>
                                            <div className="relative inline-block text-left bg-background">
                                                <div class="bg-background">
                                                    <Button variant="outline" onClick={()=>setIsDropdownOpen(!isDropdownOpen)} className="w-full" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                                    {crypto ? crypto.name : "Select Crypto"}
                                                    <svg className="-mr-1 ml-2 h-5 w-5 bg-transparent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    </Button>
                                                </div>
                                                {error && <p class="text-red-600">Must be a positive number!</p>}

                                                {isDropdownOpen && <div className="origin-top-right bg-background absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-scroll max-h-[450px]" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                                    <div className="py-1 bg-background" role="none">
                                                    <input placeholder="Search..." onChange={(e)=>setSearch(e.target.value)} className="text-gray-700 block px-4 py-2 text-sm bg-background" />
                                                    <div className="border-t border-gray-100"></div>
                                                    <div class="flex flex-col">

                                                    {cryptos_list.filter(
                                                        crypto => 
                                                        crypto.name.toLowerCase().includes(search.toLowerCase()) || crypto.symbol.toLowerCase().includes(search.toLowerCase())
                                                    ).map((crypto) => {
                                                        return (
                                                        <Button href="#" variant="ghost" role="menuitem" id="menu-item-0" className="text-left whitespace-break-spaces" onClick={()=>{
                                                            if(error){
                                                                return
                                                            }
                                                            setIsDropdownOpen(!isDropdownOpen);
                                                            setCrypto(cryptos_map[crypto.name])
                                                        }}>
                                                            {crypto.name}
                                                        </Button>
                                                        );
                                                    })}
                                                    </div>
                                                    </div>
                                                </div>}
                                                </div>

                                        </DialogHeader>
                                        <div>
                                            <Label htmlFor="amount">Amount</Label>
                                            <Input type="number" id="amount" placeholder="1.5" onChange={(e) => setAmount(e.target.value)} />

                                        </div>
                                        
                                        <DialogClose disabled={!crypto || !amount}>
                                            <Button className={(crypto && amount) ? "active" : "disabled"} 
                                                onClick={() => {
                                                    if (crypto && amount) {
                                                        addCrypto(port.name);
                                                    }
                                                }}>

                                            Add
                                            </Button>
                                        </DialogClose>


                                    </DialogContent>
                                </Dialog>
                                </div>

                                <p>
                                    ${ intToString( port.coins.reduce((accumulator, coin) => {
                                        return accumulator + (Number(coin.amount) * coin.crypto.current_price[0]);
                                    }, 0),true)
                                   
                                    }
                                </p>
                            </CardHeader>
                            <CardContent>

                                

                                <div>
                                    <div class="flex items-start py-2 max-w-screen-xl max-w-container mx-auto w-full flex flex-col justify-start gap-2" >
                                        <div class="view w-full"> 
                                                    <div class="wrapper table-container">
                                                    <Table className="table font-quick">
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="table-cell sticky-col first-col px-0 sticky"><p class="w-full bg-card min-w-[60px] py-1 pl-2 font-medium">Crypto</p>
                                                                </TableHead>
                                                                <TableHead >
                                                                    <DropDownMenu callback={handleClick} filter={"current_price"} name="Price" port={port}/>
                                                                </TableHead>
                                                                
                                                                <TableHead>
                                                                    <DropDownMenu callback={handleClick} filter={"dailyChange"} name="Daily" port={port}/>
                                                                </TableHead>
                                                                <TableHead>
                                                                    <DropDownMenu callback={handleClick} filter={"weeklyChange"} name="Weekly" port={port}/>
                                                                </TableHead>
                                                                <TableHead>
                                                                    <DropDownMenu callback={handleClick} filter={"monthlyChange"} name="Monthly" port={port}/>
                                                                </TableHead>
                                                                <TableHead>
                                                                    <DropDownMenu callback={handleClick} filter={"circulating_supply"} name="Circ. Supply" port={port}/>
                                                                </TableHead>
                                                                <TableHead >
                                                                    <DropDownMenu callback={handleClick} filter={"amount"} name="Amount"port={port}/>
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>

                                                        <TableBody>
                                                            { port.coins.map((c)=>{
                                                                    return (
                                                                        <TableRow className="">
                                                                            <TableCell className="font-medium text-xs table-cell sticky-col first-col transition-colors px-0 sticky">
                                                                            <a class="flex items-center" href={"/" + c.crypto.symbol}>
                                                                                    <img class="w-[24px] h-[24px] rounded-full" src={c.crypto.img}></img>
                                                                                    <div>

                                                                                        <p class="bg-card min-w-[60px] px-2 whitespace-break-spaces">{c.crypto.name}</p>
                                                                                        <p class="bg-card min-w-[60px] px-2 whitespace-break-spaces text-muted-foreground">{c.crypto.symbol.toUpperCase()}</p>
                                                                                    </div>
                                                                                
                                                                                </a>
                                                                            </TableCell>
                                                                            <TableCell className="font-medium text-center table-cell">${c.crypto.current_price[0]}</TableCell>
                                                                            
                                                                            <TableCell className="font-medium text-center table-cell">
                                                                                {c.crypto.dailyChange ? (
                                                                                    c.crypto.dailyChange > 0 ? (
                                                                                    <span class="flex items-center justify-center gap-0.5 text-green-600">
                                                                                        <ChevronUp size="16px" color="green" />
                                                                                        {c.crypto.dailyChange.toFixed(2)}%
                                                                                    </span>
                                                                                    ) : (
                                                                                    <span class="flex items-center justify-center gap-0.5 text-red-600">
                                                                                        <ChevronDown size="16px" color="red" />
                                                                                        {c.crypto.dailyChange.toFixed(2)}%
                                                                                    </span>
                                                                                    )
                                                                                ) : (
                                                                                    "N/A"
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell className="font-medium text-center table-cell">
                                                                                {c.crypto.weeklyChange ? (
                                                                                    c.crypto.weeklyChange > 0 ? (
                                                                                    <span class="flex items-center justify-center gap-0.5 text-green-600">
                                                                                        <ChevronUp size="16px" color="green" />
                                                                                        {c.crypto.weeklyChange.toFixed(2)}%
                                                                                    </span>
                                                                                    ) : (
                                                                                    <span class="flex items-center justify-center gap-0.5 text-red-600">
                                                                                        <ChevronDown size="16px" color="red" />
                                                                                        {c.crypto.weeklyChange.toFixed(2)}%
                                                                                    </span>
                                                                                    )
                                                                                ) : (
                                                                                    "N/A"
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell className="font-medium text-center table-cell">
                                                                                {c.crypto.monthlyChange ? (
                                                                                    c.crypto.monthlyChange > 0 ? (
                                                                                    <span class="flex items-center justify-center gap-0.5 text-green-600">
                                                                                        <ChevronUp size="16px" color="green" />
                                                                                        {c.crypto.monthlyChange.toFixed(2)}%
                                                                                    </span>
                                                                                    ) : (
                                                                                    <span class="flex items-center justify-center gap-0.5 text-red-600">
                                                                                        <ChevronDown size="16px" color="red" />
                                                                                        {c.crypto.monthlyChange.toFixed(2)}%
                                                                                    </span>
                                                                                    )
                                                                                ) : (
                                                                                    "N/A"
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell className="font-medium text-center table-cell">{intToString(c.crypto.circulating_supply,false)}</TableCell>
                                                                            <TableCell className="font-medium text-center table-cell">{c.amount}</TableCell>
                                                                        </TableRow>
                                                                    )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                    </div>

                                        </div>
                                    </div>
                                </div>
                                
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        )
    }
}

export default Portfolio

const DropDownMenu = ({callback, filter, name, port}) => {
    let textColorTrue = false;

    filter_ports.value.forEach(obj => {
        if (obj.hasOwnProperty(port.name) && obj[port.name] === filter) {
            textColorTrue = true;
        }
    });


    return(
        <div >
            <DropdownMenu className={`hover:cursor-pointer flex justify-center`}>
            <DropdownMenuTrigger className="flex items-center justify-center mx-auto">
				<Button className={`${filter === activeFilter.value && textColorTrue ? "text-primary" : ""} whitespace-nowrap w-fit px-1 focus-visible:none`} variant="ghost">{name}</Button>
			</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Sort {name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => callback(filter,"a",port)}>Ascending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => callback(filter,"d",port)}>Descending</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
        
    )
                    
}