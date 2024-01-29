import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ChevronDown,ChevronUp, Search, SearchIcon} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { effect, signal } from "@preact/signals";
import './style.css'
import { getGlobal, tableData } from "@/preact-service";
import { useEffect, useState } from "preact/hooks";
import { Input } from "@/components/ui/input";
import { route } from "preact-router";
const activeFilter = signal("market_cap");

const tableHTML = signal(null);

export function Home() {
	const [startIndex,setStartIndex] = useState(0);
	const [endIndex,setEndIndex] = useState(100);
	const [globalData,setGlobalData] = useState(null);
	const [filter,setFilter] = useState("");
	useEffect(()=>{
		getGlobal().then(data=>{
			setGlobalData(data[0].data.data)
		});
	},[])
	const handleClick = (filter,dir) => {
        activeFilter.value = filter;
        const copy = tableData.peek(); // get clone of data
        let team_data = sortTeamsBy(copy, filter,dir);
        tableData.value = team_data;
    };

	function sortTeamsBy(alltimeStats, filter, dir) {
        //create copy
        let team_arr = [...alltimeStats]

        //sport by filter
        if(dir == 'a'){
			if(filter=="current_price"){
            	team_arr.sort((a,b) => a[String(filter)][0] - b[String(filter)][0])
			} else {
            	team_arr.sort((a,b) => a[String(filter)] - b[String(filter)])
			}
        } else {
			if(filter=="current_price"){
				team_arr.sort((a,b) => b[String(filter)][0] - a[String(filter)][0])
			} else {
				team_arr.sort((a,b) => b[String(filter)] - a[String(filter)])
			}
        }
        
        return team_arr
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

	const handleRowClick = (route_) =>{
		route(route_,true);
	}

	effect(()=>{
		if(!tableData.value){
			tableHTML.value = <div class="py-2 max-w-screen-xl max-w-container mx-auto w-full px-2 gap-2" >
									<Skeleton className="w-[300px] h-[45px] rounded mb-2" />
									<Skeleton className="h-[225px] rounded" />
							  </div>
		} else {
			tableHTML.value = 
				<div class="view w-full"> 
						<div class="max-w-[300px] mb-2 flex flex-row items-center">
								<SearchIcon className="absolute pl-2" />
								<Input type="text" className="px-8" placeholder="Search..." onChange={(e) => setFilter(e.target.value)}>Test</Input>
						</div>
						<div class="wrapper table-container">
							<Table className="table">
								<TableHeader>
									<TableRow>
										<TableHead className="flex justofy-start">
											<DropDownMenu callback={handleClick} filter={"market_cap_rank"} name="#"/>
										</TableHead>
										<TableHead className="table-cell sticky-col first-col px-0 sticky"><p class="w-full bg-card min-w-[60px] py-1 pl-2 font-medium">Crypto</p>
										</TableHead>
										<TableHead >
											<DropDownMenu callback={handleClick} filter={"current_price"} name="Price"/>
										</TableHead>
										<TableHead>
											<DropDownMenu callback={handleClick} filter={"dailyChange"} name="Daily" />
										</TableHead>
										<TableHead>
											<DropDownMenu callback={handleClick} filter={"weeklyChange"} name="Weekly" />
										</TableHead>
										<TableHead>
											<DropDownMenu callback={handleClick} filter={"monthlyChange"} name="Monthly" />
										</TableHead>
										<TableHead>
											<DropDownMenu callback={handleClick} filter={"circulating_supply"} name="Circ. Supply"/>
										</TableHead>
										<TableHead >
											<DropDownMenu callback={handleClick} filter={"market_cap"} name="Market Cap"/>
										</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{tableData.value.filter(
										crypto =>
										crypto.name.toLowerCase().includes(filter.toLowerCase()) || 
										crypto.symbol.toLowerCase().includes(filter.toLowerCase())
									).slice(startIndex,endIndex).map((crypto,index)=> {
											return (
													<TableRow className="hover:cursor-pointer font-quick" onClick={()=> handleRowClick("/"+crypto.symbol)}>
															<TableCell className="font-thin text-xs text-center table-cell">
																<a class="flex flex-col justify-start" href={"/" + crypto.symbol}>
																	<span class="text-left">
																		${intToString(crypto.market_cap,false)}
																	</span>
																	<span class="text-muted-foreground text-left">
																		{crypto.market_cap_rank}
																	</span>
																</a>
																
															</TableCell>

															<TableCell className="font-medium text-xs table-cell sticky-col first-col transition-colors px-0 sticky">
																	<a class="flex items-center" href={"/" + crypto.symbol}>
																		<img class="w-[24px] h-[24px] rounded-full" src={crypto.img}></img>
																		<div>

																			<p class="bg-card min-w-[60px] px-2 whitespace-break-spaces">{crypto.name}</p>
																			<p class="bg-card min-w-[60px] px-2 whitespace-break-spaces text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
																		</div>
																	
																	</a>

															</TableCell>
															<TableCell className="font-medium text-center table-cell">
																<a href={"/" + crypto.symbol}>
																${crypto.current_price[0]}
																</a>
															</TableCell>
															
															<TableCell className="font-medium text-center table-cell">
																{crypto.dailyChange ? (
																	crypto.dailyChange > 0 ? (
																	<a href={"/" + crypto.symbol} class="flex items-center justify-center gap-0.5 text-green-600">
																		<ChevronUp size="16px" color="green" />
																		{crypto.dailyChange.toFixed(2)}%
																	</a>
																	) : (
																	<a href={"/" + crypto.symbol} class="flex items-center justify-center gap-0.5 text-red-600">
																		<ChevronDown size="16px" color="red" />
																		{crypto.dailyChange.toFixed(2)}%
																	</a>
																	)
																) : (
																	<a href={"/" + crypto.symbol}>
																		"N/A"
																	</a>
																)}
															</TableCell>
															<TableCell className="font-medium text-center table-cell">
																{crypto.weeklyChange ? (
																	crypto.weeklyChange > 0 ? (
																	<a href={"/" + crypto.symbol} class="flex items-center justify-center gap-0.5 text-green-600">
																		<ChevronUp size="16px" color="green" />
																		{crypto.weeklyChange.toFixed(2)}%
																	</a>
																	) : (
																	<a href={"/" + crypto.symbol} class="flex items-center justify-center gap-0.5 text-red-600">
																		<ChevronDown size="16px" color="red" />
																		{crypto.weeklyChange.toFixed(2)}%
																	</a>
																	)
																) : (
																	<a href={"/" + crypto.symbol}>
																		"N/A"
																	</a>
																)}
															</TableCell>
															<TableCell className="font-medium text-center table-cell">
																{crypto.monthlyChange ? (
																	crypto.monthlyChange > 0 ? (
																	<a href={"/" + crypto.symbol} class="flex items-center justify-center gap-0.5 text-green-600">
																		<ChevronUp size="16px" color="green" />
																		{crypto.monthlyChange.toFixed(2)}%
																	</a>
																	) : (
																	<a href={"/" + crypto.symbol} class="flex items-center justify-center gap-0.5 text-red-600">
																		<ChevronDown size="16px" color="red" />
																		{crypto.monthlyChange.toFixed(2)}%
																	</a>
																	)
																) : (
																	<a href={"/" + crypto.symbol}>
																		"N/A"
																	</a>
																)}
															</TableCell>
															<TableCell className="font-medium text-center table-cell">
																<a href={"/" + crypto.symbol}>
																	{intToString(crypto.circulating_supply,false)}
																</a>
															</TableCell>
															<TableCell className="font-medium text-center table-cell">
																<a href={"/" + crypto.symbol}>
																	{intToString(crypto.market_cap,false)}
																</a>
															</TableCell>
													</TableRow>

											)
									})}
								</TableBody>
							</Table>
						</div>
						<div class="flex flex-col">
						<span class="text-muted-foreground font-thin mt-1">Powered by CoinGecko API</span>
						</div>
						
				</div>
		}

	})

	return (
		<div class="flex items-start py-2 max-w-screen-xl max-w-container mx-auto w-full flex flex-col justify-start gap-2 px-2" >
				{globalData && 
				
				<div>
				<Card className="flex flex-col gap-2 px-2 md:flex-row md:gap-4">
					<span>Cryptos: {globalData['active_cryptocurrencies']}</span>
					<span className="block">
						Crypto Market Cap: ${intToString(globalData['total_market_cap']['usd'])} 
						<span className={`${globalData['market_cap_change_percentage_24h_usd'] < 0 ? "text-red-600" : "text-green-600"}`}>
							{globalData['market_cap_change_percentage_24h_usd'].toFixed(2)}%
						</span>
					</span>
					<span>Active ICOs: {globalData['ongoing_icos']}</span>
					<span>BTC.D: {globalData['market_cap_percentage']['btc'].toFixed(2)}%</span>
					<span>ETH.D: {globalData['market_cap_percentage']['eth'].toFixed(2)}%</span>
				</Card>
			</div>
			

				}
			{tableHTML.value}
		</div>
	)
	
}


const DropDownMenu = ({callback, filter, name}) => {

    return(
        <div >
            <DropdownMenu className={`hover:cursor-pointer flex justify-center`}>
            <DropdownMenuTrigger className="flex items-center justify-center mx-auto">
				<Button className={`${filter === activeFilter.value ? "text-primary" : ""} whitespace-nowrap w-fit px-1 focus-visible:none`} variant="ghost">{name}</Button>
			</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Sort {name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => callback(filter,"a")}>Ascending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => callback(filter,"d")}>Descending</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
        
    )
                    
}