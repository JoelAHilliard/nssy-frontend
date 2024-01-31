import { useLocation } from 'preact-iso';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';
import { useEffect, useState } from 'preact/hooks';
import { getGlobal } from '@/preact-service';
import { Card } from './ui/card';
import { intToString } from '..';
import { Skeleton } from './ui/skeleton';
import SearchComponent from './search-component';
export function Header() {
	const { url } = useLocation();
	const [globalData,setGlobalData] = useState(null);  
	useEffect(()=>{
		getGlobal().then(data=>{
			setGlobalData(data[0].data.data)
		});
	},[])

	const nav = <header class="bg-background flex max-w-screen-xl max-w-container mx-auto w-full flex items-center justify-start gap-2">
		<nav class="flex items-start gap-2 justify-start">
				<a href="/">
					<Button variant="outline" className={url == '/' ? 'bg-primary hover:bg-primary' : "bg-background hover:bg-background"}>
						Market
					</Button>
				</a>
				<a href="/portfolio">
					<Button variant="outline" className={url == '/portfolio' ? 'bg-primary hover:bg-primary' : "bg-background "}>
						Portfolio
					</Button>
				</a>
				<ModeToggle />
		</nav>
	</header>

	if(!globalData){
		return(
			<div class="flex items-start py-2 max-w-screen-xl max-w-container mx-auto w-full flex flex-col justify-start gap-2 px-2" >
				<Skeleton className="w-full px-2 h-[30px]" />
			</div>
		);
	}
	return (
		globalData && 
				
		<div class="flex py-2 max-w-screen-xl mx-auto w-full flex-col items-center justify-start gap-2 px-2">
			<div class="flex gap-2 md:gap-4 text-xs whitespace-nowrap overflow-x-auto max-w-full">
				<span>Cryptos: {globalData['active_cryptocurrencies']}</span>
				<span class="flex gap-1">
					Crypto Market Cap: ${intToString(globalData['total_market_cap']['usd'], false)}
					<span class={`${globalData['market_cap_change_percentage_24h_usd'] < 0 ? "text-red-600" : "text-green-600"}`}>
						{globalData['market_cap_change_percentage_24h_usd'].toFixed(2)}%
					</span>
				</span>
				<span>Active ICOs: {globalData['ongoing_icos']}</span>
				<span>BTC.D: {globalData['market_cap_percentage']['btc'].toFixed(2)}%</span>
				<span>ETH.D: {globalData['market_cap_percentage']['eth'].toFixed(2)}%</span>
			</div>
			<div class="flex justify-start w-full">
				{nav}
				<SearchComponent />
			</div>
		</div>

		

			
		
	);
}
