import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "preact/hooks"
import { SearchIcon, Sheet } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

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
import CryptoSelector from "@/components/crypto-select"
import QRCodeScanner from "@/components/scan-data"
  
const Create = (props) => {
    const [filter,setFilter] = useState("");
    const [portData,setPortData] = useState(null);

    const [portfolio,setPortfolio] = useState({name:"",description:"",coins:[]});
    const [selectedCryptos, setSelectedCryptos] = useState({});
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");

    const createPort = () =>{
        let copy_of_portfolios = portfolio_data.value ? [...portfolio_data.value] : [];
        const p_final = {
            name: name !== "" ? name : "Portfolio " + portfolio_data.value.length,
            description:description !== "" ? description : "",
            coins:Object.values(selectedCryptos)
        }
        copy_of_portfolios.push(p_final);
        portfolio_data.value = copy_of_portfolios;
        localStorage.setItem("portfolios",JSON.stringify(copy_of_portfolios))
    }

    const [dropdown,setDropDown] = useState(false);
    const cryptos_names = Object.keys(cryptos_map.value);
    const [searchTerm, setSearchTerm] = useState("");
    const [tableKey, setTableKey] = useState(0);
    const [filteredCryptos, setFilterCryptos] = useState(cryptos_names);

    const handleCryptoSelect = (c) => {
        if(selectedCryptos[c.name]) {
            toast.warning(`${c.name} ($${c.symbol.toUpperCase()}) is already added.`,{
                description: "Try adding a different asset.",
            })
            return
        }
        const cryptos = {...selectedCryptos};
        cryptos[c.name] = {crypto:c.name, amount:0}; 

        setSelectedCryptos(cryptos);
    }
    const handleAmountChange = (crypto, amount) => {
        if (amount === '') {
          amount = '0';
        } else {
          // Remove any non-numeric characters except decimal point
          amount = amount.replace(/[^0-9.]/g, '');
          
          // Remove any leading zeros
          amount = amount.replace(/^0+/, '');
          
          // If the amount starts with a decimal point, add a leading zero
          if (amount.charAt(0) === '.') {
            amount = '0' + amount;
          }
          
          // Limit to two decimal places
          const decimalIndex = amount.indexOf('.');
          if (decimalIndex !== -1) {
            amount = amount.slice(0, decimalIndex + 7);
          }
        }
      
        const updatedCryptos = { ...selectedCryptos };
        updatedCryptos[crypto.crypto] = { ...crypto, amount: amount };
        setSelectedCryptos(updatedCryptos);
    };
    const handlePortCopyEntry = () => {
        const data = JSON.parse(portData);

        console.log(data)
        portfolio_data.value = data;
    }
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
                <Input value={name} name="name" placeholder="Kraken" onChange={(e)=>{
                    setName(e.target.value)
                }}></Input>
                
                <Label name="description">Description</Label>
                <Input name="name" type="text" placeholder="Long term holds" onChange={(e)=>{
                    setDescription(e.target.value)
                }}></Input>

                <Label className="mt-2" name="cryptos">Cryptos</Label>
                
                <Table key={tableKey}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedCryptos.length == 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center">
                            None added.
                            </TableCell>
                        </TableRow>
                        ) : (
                        Object.keys(selectedCryptos).map((key, index) => {
                            return(
                                <TableRow key={index}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <img class="h-8" src={cryptos_map.value[selectedCryptos[key].crypto].image}/> ${cryptos_map.value[selectedCryptos[key].crypto].symbol.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="relative">
                                        <Input
                                            placeholder="amount"
                                            value={selectedCryptos[key].amount}
                                            onChange={(e) => handleAmountChange(selectedCryptos[key], e.target.value)}
                                            onKeyPress={(e) => {
                                            if (!/[0-9.]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                            }}
                                            className="pr-12"
                                        />
                                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 mr-2 text-muted-foreground">
                                            = {(parseFloat(selectedCryptos[key].amount) * cryptos_map.value[selectedCryptos[key].crypto].current_price).toLocaleString("en-US", {style:"currency", currency:"USD"})}
                                        </span>
                                    </TableCell>
                                </TableRow>
                        )})
                        )}
                    </TableBody>
                </Table>
                <div class='max-h-[200px]'>
                    <CryptoSelector cryptosList={cryptos_list.value} onSelect={handleCryptoSelect} />
                </div>
            </CardContent>

            <div class="flex flex-col items-center my-4 px-2">
                <Button className="w-full" onClick={createPort}>Submit</Button>
            </div>


           
        </Card>
    )
}

export default Create;