import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "preact/hooks"
import { SearchIcon, Sheet } from "lucide-react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
   
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { portfolio_data,cryptos_map,cryptos_list } from "@/preact-service"
import { FixedSizeList } from 'react-window';
import { Separator } from "@/components/ui/separator"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"

  
const Create = (props) => {
    const [filter,setFilter] = useState("");

    const [portfolio,setPortfolio] = useState({name:"",description:"",coins:[]});
    const [coins,setCoins] = useState([])
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [amount, setAmount] = useState(-1);
    const [description, setDescription] = useState("");

    const filterCryptos = (cryptos) => {
        return cryptos.filter((crypto) =>
          crypto.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const createPort = () =>{
        let copy_of_portfolios = portfolio_data.value ? [...portfolio_data.value] : [];
        copy_of_portfolios.push(portfolio);
        portfolio_data.value = copy_of_portfolios;
        localStorage.setItem("portfolios",JSON.stringify(copy_of_portfolios))
    }

    const renderCryptoItem = ({ index, style }) => {
        const crypto = filteredCryptos[index];

        return (
            <SelectItem
                onSelect={() => handleCryptoClick(cryptos_map.value[crypto])}
                key={index}
                value={crypto}
                style={style}
            >
                {crypto}
            </SelectItem>
        );
    };
    
    const handleCryptoClick = (crypto) => {
        console.log(crypto)
        setPortfolio(prevPortfolio => ({
          ...prevPortfolio,
          coins: [...prevPortfolio.coins, 
                {
                    crypto:crypto.name,
                    amount:amount
                }
            ]
        }));
        setSelectedCrypto("");
        setAmount(-1);
        setTableKey(prevKey => prevKey + 1);
    };

   

    const [name,setName] = useState("");
    const [dropdown,setDropDown] = useState(false);
    const cryptos_names = Object.keys(cryptos_map.value);
    const [searchTerm, setSearchTerm] = useState("");
    const [tableKey, setTableKey] = useState(0);
    const [filteredCryptos, setFilterCryptos] = useState(cryptos_names);

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        const filtered = filterCryptos(cryptos_names);
        setFilterCryptos(filtered);
    };

   

    return (
        <Card className="w-full">
            <CardHeader>
                <div>
                    <CardTitle>Add</CardTitle>
                    <CardDescription>Name your portfolio and add some cryptos.</CardDescription>

                    
                </div>
                </CardHeader>
            <CardContent class="">
                <Label name="name">Name</Label>
                <Input name="name" placeholder="Kraken" onChange={(e)=>{
                    setPortfolio(prevPortfolio => ({
                        ...prevPortfolio,
                        name:e.target.value
                      }));
                }}></Input>
                
                <Label name="description">Description</Label>
                <Input name="name" type="text" placeholder="Long term holds" onChange={(e)=>{
                    setPortfolio(prevPortfolio => ({
                        ...prevPortfolio,
                        description:e.target.value
                      }));
                }}></Input>

                <Label className="mt-2" name="cryptos">Cryptos</Label>
                
                <Table key={tableKey}>
                    <TableCaption>You can add more later.</TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {portfolio.coins.length == 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center">
                            None added.
                            </TableCell>
                        </TableRow>
                        ) : (
                        portfolio.coins.map((crypto, index) => {
                            console.log(crypto)
                            return(
                            <TableRow key={index}>
                                <TableCell className="font-medium">{crypto.crypto}</TableCell>
                                <TableCell>{crypto.amount}</TableCell>
                            </TableRow>
                        )})
                        )}
                    </TableBody>
                </Table>
                
                <Drawer>
                    <DrawerTrigger className="w-full">
                        <Button variant="outline">Add Coin</Button>
                    </DrawerTrigger>
                    
                    <DrawerContent className="h-[80%]">

                        <div class="px-4">
                            <DrawerHeader className="flex items-center justify-between">
                                <div class="p-2">
                                    <DrawerTitle>Add to portfolio</DrawerTitle>
                                    <DrawerDescription>You can add more at anytime.</DrawerDescription>
                                    <span class="h-8"></span>
                                
                                </div>
                                {selectedCrypto ? <Card className="flex items-center gap-2 bg-foreground-muted p-2">
                                    <img class='h-8' src={cryptos_map.value[selectedCrypto?.name].img}></img>
                                    <div class="flex flex-col">
                                        <span class="font-bold">{selectedCrypto?.name}</span>
                                        <span>{cryptos_map.value[selectedCrypto?.name].symbol}</span>
                                    </div>
                                </Card> : null }
                            </DrawerHeader>
                        </div>

                        <div class="px-4 relative w-full">
                            <div class="px-4">
                                <Label>Select crypto</Label>
                                <div class="flex items-center">
                                    <SearchIcon className="absolute pl-2" />
                                    <Input 
                                        type="text" 
                                        className="px-8" 
                                        placeholder="Search..." 
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    />
                                </div>
                                
                            </div>

                            <div class="relative flex flex-col w-full gap-1 overflow-y-scroll max-h-[300px]">
                                <div class="overflow-y-scroll max-h-[300px]  mt-3">
                                    {cryptos_list.value.filter(
                                        crypto =>
                                        crypto.name.toLowerCase().includes(filter.toLowerCase()) || 
                                        crypto.symbol.toLowerCase().includes(filter.toLowerCase())
                                    ).slice(0,70).map((crypto=>{
                                        return(
                                            <div class="w-full text-left" onClick={()=>{setSelectedCrypto(crypto)}}>
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
                                            </div>
                                        )
                                    }
                                    ))}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>

                            </div>

                            <div class="px-4">
                                <Label>How much</Label>
                                <Input
                                    name="total"
                                    type="number"
                                    placeholder="0.3"
                                    onChange={(e) => setAmount(e.target.value)}
                                ></Input>
                            </div>
                            
                        </div>

                        <DrawerFooter>
                            <DrawerClose>
                                <Button onClick={() => handleCryptoClick(selectedCrypto)}>Submit</Button>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </CardContent>

            <div class="flex flex-col items-center my-4">
                <Button className="w-[85%]" onClick={createPort}>Submit</Button>
            </div>
        </Card>
    )
}

export default Create;