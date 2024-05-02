import { useLocation } from "preact-iso";
import { getGraphData, market_data } from "@/preact-service";
import { Skeleton } from "./ui/skeleton";
import Highcharts, { chart } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useState } from "preact/hooks";
import { Button } from "./ui/button";
import { intToString } from "../index";
import ErrorNotFound from "./error-not-found";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowBigLeft } from "lucide-react";
import TradingViewWidget from "./TradingViewWidget";
import { Separator } from "./ui/separator";
const CryptoBreakdown = (params) => {
    const location = useLocation();
    const [crypto, setCrypto] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    
    const timeframes = [
        ["15m", "15m"], ["4hr", "4hr"], ["12hr", "12hr"], ["24hr", "24hr"], ["1week", "1W"], ["1month", "1M"], ["max", "max"]
    ];

    const [timeframe, setTimeframe] = useState(timeframes[2][0]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const ticker = location.path.substring(1, location.path.length);
                let foundCrypto = params.crypto || market_data.value?.find(c => c.s === ticker);
                
                // inital page load will not have marketdata yet
                if(!foundCrypto && !market_data.value){
                    return
                }
                if (!foundCrypto) {
                    setNotFound(true);
                } else {
                    setCrypto(foundCrypto);
                    const data = await getGraphData({ ticker: ticker, timeframe: timeframe });
                    setGraphData(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setNotFound(true);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [timeframe]);
    useEffect(() => {
        if(!market_data.value){
            return;
        }
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const ticker = location.path.substring(1, location.path.length);
                let foundCrypto = params.crypto || market_data.value?.find(c => c.s === ticker);
                if (!foundCrypto) {
                    setNotFound(true);
                } else {
                    setCrypto(foundCrypto);
                    setNotFound(false)
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setNotFound(true);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [market_data.value]);

    if (isLoading) {
        return (
            <div class="py-2 max-w-screen-xl max-w-container mx-auto w-full px-2 gap-2">
                <p>Loading...</p>
                <Skeleton className="h-[300px] w-[400px]"></Skeleton>
            </div>
        );
    }

    if (notFound || !crypto) {
        return (
            <div class="py-2 max-w-screen-xl max-w-container mx-auto w-full px-2 gap-2">
                <ErrorNotFound />
            </div>
        );
    }
    

        return(
            <div class="py-2 max-w-screen-xl max-w-container mx-auto w-full px-2 gap-2" >
                <div class="mb-3">
                    <Button variant="ghost"><a href="/"><ArrowBigLeft/></a></Button>
                </div>
                <Card className="lg:max-w-[100%] mx-auto">
                    <CardHeader>
                        <div class="grid grid-cols-2">
                            <div class="flex items-center">
                                <img class="w-[24px] h-[24px] rounded-full" src={crypto.img}></img>
                                <p class="text-xl font-semibold text-foreground flex items-center gap-1">{crypto.n} <span class="text-base text-gray-500">{crypto.s}</span></p>
                            </div>
                            
                            <p class="text-xl text-foreground">$<span class="font-bold">{crypto.p}</span>   
                            
                            <span>
                                {crypto.d && <span class={crypto.d > 0 ? `text-left text-green-600`: `text-left text-red-600`}> {crypto.d.toFixed(2)}%</span>}
                            </span>
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="grid grid-cols-2 text-sm mt-2">
                            <p class="text-foreground  whitespace-nowrap text-left">24hr Volume: $<span class="font-semibold">{intToString(crypto.d_vol,false)}</span></p>
                            <p class="text-foreground whitespace-nowrap text-left">Market Cap: $<span class="font-semibold">{intToString(crypto.mcp,false)}</span></p>
                        </div>
                        <div class="grid grid-cols-2 text-sm mt-2">
                            {crypto.w && <p class="text-left">Weekly: <span class={crypto.m > 0 ? ` "font-semibold text-green-600` : `"font-semibold text-red-600`}>{crypto.m.toFixed(2)} %</span></p>}
                            {crypto.m && <p class="text-left">Daily : <span class={crypto.w > 0 ? ` "font-semibold text-green-600` : `"font-bold text-red-600`}>{crypto.w.toFixed(2)} %</span></p>}
                        </div>
                        <Separator class="py-4"/>
                        <div class="lg:h-[600px] h-[400px] py-4">
                            <TradingViewWidget crypto={crypto}/>
                        </div>
                   

                    </CardContent>
                 
                </Card>

                
                {/* <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
                <div class="flex gap-1 justify-end">
                    {timeframes.map((tf)=>{
                        return (
                            <Button size="sm" onClick={() => setTimeframe(tf[0])}>{tf[1]}</Button>
                        )
                    })}
                </div> */}
            </div>
        )
}



export default CryptoBreakdown;