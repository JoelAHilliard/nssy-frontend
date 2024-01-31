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
                let foundCrypto = params.crypto || market_data.value?.find(c => c.symbol === ticker);
                
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
                let foundCrypto = params.crypto || market_data.value?.find(c => c.symbol === ticker);
                if (!foundCrypto) {
                    setNotFound(true);
                } else {
                    setCrypto(foundCrypto);
                    const data = await getGraphData({ ticker: ticker, timeframe: timeframe });
                    setGraphData(data);
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
    
        const minValue =  graphData['tenMinIntervalPrices'] ? Math.min(...graphData['tenMinIntervalPrices'].map(entry => entry[0])) : Math.min(...graphData['hourIntervalPrices'].map(entry => entry[0]));
        

        let xVals = graphData['tenMinIntervalPrices'] ? graphData['tenMinIntervalPrices'].map((entry)=> entry[0]) : graphData['hourIntervalPrices'].map((entry)=> entry[0])
        let yVals = graphData['tenMinIntervalPrices'] ? graphData['tenMinIntervalPrices'].map((entry)=> new Date(entry[1])) : graphData['hourIntervalPrices'].map((entry)=> new Date(entry[1]))
        let mid = graphData['tenMinIntervalPrices'] ? Math.floor(graphData['tenMinIntervalPrices'].length / 2) : Math.floor(graphData['hourIntervalPrices'].length / 2);
        
        
        const options = {
            series: [{
                data: xVals,
                color: '#3B82F6',
                borderColor:"transparent",
                fillColor: 'rgba(59, 130, 246, 0.3)',
                marker:{
                    enabled:false
                }
            }],
            credits: {
                enabled: false
            },
            chart: {
                opacity:0.5,
                backgroundColor: "transparent",
                type: 'area',
                height:200
            },
            xAxis:{
                type:"",
                categories: yVals,
                labels:{
                    formatter: function() {
                        if (this.isLast || this.isFirst || this.pos == mid) {
                            const date = new Date(this.value);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
                            const hours = date.getHours().toString().padStart(2, '0');
                            const minutes = date.getMinutes().toString().padStart(2, '0');
                            return `${day}/${month} ${hours}:${minutes}`;
                      }
                    },
                    style:{
                        color:"gray"
                    },
                    rotation:-15
                }
            },
            yAxis: {
                // labels: {
                //     enabled:false
                // },
                min:minValue,
                title:"",
                gridLineColor: 'transparent',
                labels:{
                    style:{
                        color:"gray"
                    }
                }
            },
            title:{
                text:undefined
            },
            legend:{
                enabled:false
            }
        
            // Title is omitted to ensure there's no title displayed
        };


        return(
            <div class="py-2 max-w-screen-xl max-w-container mx-auto w-full px-2 gap-2" >
                <div class="mb-3">
                    <Button variant="ghost"><a href="/"><ArrowBigLeft/></a></Button>
                </div>
                <Card className="lg:max-w-[40%] mx-auto">
                    <CardHeader>
                        <div class="grid grid-cols-2">
                            <div class="flex items-center">
                                <img class="w-[24px] h-[24px] rounded-full" src={crypto.img}></img>
                                <p class="text-xl font-semibold text-foreground flex items-center gap-1">{crypto.name} <span class="text-base text-gray-500">{crypto.symbol}</span></p>
                            </div>
                            
                            <p class="text-xl text-foreground">$<span class="font-bold">{crypto.current_price[0]}</span>   
                            
                            <span>
                                {crypto.dailyChange && <span class={crypto.dailyChange > 0 ? `text-left text-green-600`: `text-left text-red-600`}> {crypto.dailyChange.toFixed(2)}%</span>}
                            </span>
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div class="grid grid-cols-2 text-sm mt-2">
                            <p class="text-foreground  whitespace-nowrap text-left">Circ. Supply: <span class="font-semibold">{intToString(crypto.circulating_supply,false)}</span></p>
                            <p class="text-foreground whitespace-nowrap text-left">Market Cap: <span class="font-semibold">{intToString(crypto.market_cap,false)}</span></p>
                        </div>
                        <div class="grid grid-cols-2 text-sm mt-2">
                            {crypto.weeklyChange && <p class="text-left">Weekly: <span class={crypto.weeklyChange > 0 ? ` "font-semibold text-green-600` : `"font-semibold text-red-600`}>{crypto.weeklyChange.toFixed(2)} %</span></p>}
                            {crypto.monthlyChange && <p class="text-left">Monthly : <span class={crypto.monthlyChange > 0 ? ` "font-semibold text-green-600` : `"font-bold text-red-600`}>{crypto.monthlyChange.toFixed(2)} %</span></p>}
                        </div>
                    </CardContent>
                 
                </Card>

                
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
                <div class="flex gap-1 justify-end">
                    {timeframes.map((tf)=>{
                        return (
                            <Button size="sm" onClick={() => setTimeframe(tf[0])}>{tf[1]}</Button>
                        )
                    })}
                </div>
            </div>
        )
}



export default CryptoBreakdown;