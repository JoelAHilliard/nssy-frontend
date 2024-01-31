import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState } from "preact/hooks";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import { Card, CardContent } from "./ui/card";
import { cryptos_list } from "@/preact-service";
import { Button } from "./ui/button";
const SearchComponent = () => {
    const [filter,setFilter] = useState("");
    return (
        <div className="max-w-[300px] mb-2 flex flex-row items-center">
            
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        <div class="flex items-center gap-2">
                            <SearchIcon /> 
                            Search
                        </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div class="flex p-3 min-w-[300px] items-center">
                            <SearchIcon className="absolute pl-2" />
                            <Input 
                                type="text" 
                                className="px-8" 
                                placeholder="Search..." 
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                        <div class="flex flex-col w-full gap-1">
                        {cryptos_list.value.filter(
                            crypto =>
                            crypto.name.toLowerCase().includes(filter.toLowerCase()) || 
                            crypto.symbol.toLowerCase().includes(filter.toLowerCase())
                        ).slice(0,10).map((crypto=>{
                                return(
                                    <a class="w-full text-left" href={`/`+crypto.symbol}>
                                        <Button className="w-full text-left flex gap-2 items-center justify-between" variant="ghost">
                                            <div class="flex items-center gap-2 py-1">
                                                <img class="w-[24px] h-[24px] rounded-full" src={crypto.img}></img>
                                                <div class="flex flex-col">
                                                    <span class="text-left w-full">{crypto.name}</span>
                                                    <div class="flex flex-row gap-2">
                                                        <span class="text-left text-muted-foreground">{crypto.symbol.toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                         
                                            {crypto.daily && <span class={crypto.daily > 0 ? `text-left text-green-600`: `text-left text-red-600`}>{crypto.daily.toFixed(2)}%</span>}

                                        </Button>
                                    </a>
                                )
                            }
                        ))}
                        </div>
                      
                    </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

        </div>
    );
};

export default SearchComponent;
