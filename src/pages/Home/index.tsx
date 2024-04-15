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
import DropDownMenu from "@/components/dropdown-menu";
import { effect, signal } from "@preact/signals";
import './style.css'
import { getGlobal, tableData } from "@/preact-service";
import { useEffect, useState } from "preact/hooks";
import { Input } from "@/components/ui/input";
import { route } from "preact-router";
import { cryptos_list, cryptos_map } from "@/preact-service";
const activeFilter = signal("market_cap_rank");

const tableHTML = signal(null);
function formatSmallNumber(number) {
	// Parse the number using Number.parseFloat()
	const parsedNumber = Number.parseFloat(number);
  
	// Convert the parsed number to a string in scientific notation
	let numberString = parsedNumber.toExponential();
  
	// Split the string into parts before and after the 'e'
	let parts = numberString.split('e');
  
	// Extract the base and exponent
	let base = parts[0];
	let exponent = parseInt(parts[1], 10);
  
	// Split the base into parts before and after the decimal point
	let baseParts = base.split('.');
  
	// Extract the significant figures after the decimal point
	let significantFigures = baseParts[1];
  
	// Calculate the number of leading zeros based on the exponent
	let leadingZeros = Math.abs(exponent) - 1;
  
	const formattedNumber = (
	  <span>
		0.0<sub>{leadingZeros}</sub>
		{significantFigures}
	  </span>
	);
  
	return formattedNumber;
  }
export function Home() {
	const [startIndex,setStartIndex] = useState(0);
	const [endIndex,setEndIndex] = useState(100);
	const [globalData,setGlobalData] = useState(null);
	const [filter,setFilter] = useState("");
	
	const handleClick = (filter,dir) => {
        activeFilter.value = filter;
        const copy = tableData.peek(); // get clone of data
        let team_data = sortTeamsBy(copy, filter,dir);
        tableData.value = team_data;
    };

	function sortTeamsBy(alltimeStats, filter, dir) {

		console.log(alltimeStats)

		console.log(filter)
        //create copy
        let team_arr = [...alltimeStats]

        //sport by filter
        if(dir == 'a'){
			team_arr.sort((a,b) => a[String(filter)] - b[String(filter)])
        } else {
			team_arr.sort((a,b) => b[String(filter)] - a[String(filter)])
        }
        console.log(team_arr)
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
						<div class="wrapper table-container">
							<Table className="table">
								<TableHeader>
									<TableRow>
										<TableHead className="flex justify-start my-2">
											<DropDownMenu activeFilter={activeFilter} callback={handleClick} filter={"market_cap_rank"} name="#"/>
										</TableHead>
										<TableHead className="table-cell sticky-col first-col px-0 sticky"><p class="w-full bg-card min-w-[60px] py-1 font-medium">Coin</p>
										</TableHead>
										<TableHead >
											<DropDownMenu  activeFilter={activeFilter}  callback={handleClick} filter={"current_price"} name="Price"/>
										</TableHead>
										<TableHead>
											<DropDownMenu activeFilter={activeFilter}  callback={handleClick} filter={"price_change_percentage_24h_in_currency"} name="Daily" />
										</TableHead>
										<TableHead>
											<DropDownMenu activeFilter={activeFilter}  callback={handleClick} filter={"price_change_percentage_7d_in_currency"} name="Weekly" />
										</TableHead>
										<TableHead>
											<DropDownMenu activeFilter={activeFilter}  callback={handleClick} filter={"price_change_percentage_30d_in_currency"} name="Monthly" />
										</TableHead>
										<TableHead>
											<DropDownMenu activeFilter={activeFilter}  callback={handleClick} filter={"circulating_supply"} name="Circ. Supply"/>
										</TableHead>
										<TableHead >
											<DropDownMenu activeFilter={activeFilter}  callback={handleClick} filter={"market_cap"} name="Market Cap"/>
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
																	
																	<span class="text-muted-foreground text-left">
																		{crypto.market_cap_rank}
																	</span>
																</a>
																
															</TableCell>

															<TableCell className="font-medium text-xs table-cell sticky-col first-col transition-colors px-0 sticky">
																	<a class="flex items-center bg-background" href={"/" + crypto.symbol}>
																		<img class="w-[24px] h-[24px] rounded-full bg-background" src={crypto.img}></img>
																		<div>

																			<p class="bg-card min-w-[60px] px-2 whitespace-break-spaces">{crypto.name}</p>
																			<p class="bg-card min-w-[60px] px-2 whitespace-break-spaces text-muted-foreground"><span>${intToString(crypto.market_cap,false)} </span></p>
																		</div>
																	
																	</a>

															</TableCell>
															<TableCell className="font-medium text-center table-cell">
																<a href={"/" + crypto.symbol}>
																${crypto.current_price[0].toFixed(2) < 0.0001 ? formatSmallNumber(crypto.current_price[0]) : crypto.current_price[0] }
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
																		N/A
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
																		N/A
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
			{tableHTML.value}
		</div>
	)
	
}