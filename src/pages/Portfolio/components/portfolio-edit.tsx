// @ts-ignore
import { cryptos_list, cryptos_map, portfolio_data } from "@/preact-service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "preact/hooks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Edit2, TrashIcon } from "lucide-react";
import CryptoSelector from "@/components/crypto-select";
import { Separator } from "@/components/ui/separator";
export function Edit({ portfolio }) {
  const portfolio_name = portfolio;
  const port = portfolio_data.value.find((c) => c.name === portfolio);

  const [editedName, setEditedName] = useState(portfolio_name);
  const [showAdd, setShowAdd] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCoins, setEditedCoins] = useState(port.coins);


  const [selectedCrypto,setSelectedCrypto] = useState(null);
  const [addAmount,setAddAmount] = useState(null);

  const [addedCryptos, setAddedCryptos] = useState([]);
  const [open, setOpen] = useState(false);


  const handleCoinChange = (index, amount) => {
    const updatedCoins = [...editedCoins];
    updatedCoins[index] = { ...updatedCoins[index], amount };
    setEditedCoins(updatedCoins);
  };

  const handleSubmit = () => {
    const updatedPortfolio = {
      ...port,
      name: editedName,
      description: editedDescription,
      coins: editedCoins.concat(addedCryptos),
    };

    const updatedPortfolioData = portfolio_data.value.map((p) =>
      p.name === portfolio_name ? updatedPortfolio : p
    );

    portfolio_data.value = updatedPortfolioData;
    setAddedCryptos([]);
    setOpen(false);

  };

  const handleDeleteEdit = (c) => {

    const updatedPortfolio = {...port, coins:[]};
    for(let i =0; i < port.coins.length;i++){
      if(port.coins[i].crypto != c.crypto){
        updatedPortfolio.coins.push(port.coins[i])
      }
    }
    const updatedPortfolioData = portfolio_data.value.map((p) =>
      p.name === portfolio_name ? updatedPortfolio : p
    );
    const temp = editedCoins.filter((unit)=> unit.crypto !== c.crypto);
    setEditedCoins(temp);
    portfolio_data.value = updatedPortfolioData;
    setOpen(false);

  }

  const handleShowAdd = () => {
    setShowAdd(!showAdd)
  }

  const handleDeletePortfolio = () => {
    const updatedPortfolioData = portfolio_data.value.filter((p) =>
      p.name !== portfolio_name
    );
    portfolio_data.value = updatedPortfolioData;
    setOpen(false);
  }
  const handleAddCrypto = () =>{
    if(!addAmount || !selectedCrypto) return

    const added_copy = [...addedCryptos];

    added_copy.push({crypto:selectedCrypto.n, amount:addAmount});

    setAddedCryptos(added_copy);

    setAddAmount(null)
    setSelectedCrypto(null)
  }

  const removeFromAdded = (crypto) => {
    const arr = addedCryptos.filter((c)=> c.crypto.n !== crypto.crypto.n)
    setAddedCryptos(arr);
  }
  useEffect(() => {
    if (port) {
      setEditedName(port.name);
      setEditedDescription(port.description);
      setEditedCoins(port.coins);
    }
  }, [port]);
  return (
    <div >
      <Dialog open={open} onOpenChange={setOpen} className="fixed inset-0 flex items-center justify-center z-50">
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">Edit Portfolio</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto top-[50%]">
          <DialogHeader>
            <DialogTitle>Edit {portfolio}</DialogTitle>
            <DialogDescription>
              Make changes to your portfolio here. Click save when you're done.
            </DialogDescription>
            
          </DialogHeader>
          <div className="grid gap-4">
            <Separator />
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Portfolio Name
              </Label>
              <Input
                id="name"
                value={editedName}
                onInput={(e) => setEditedName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-left">
                Description
              </Label>
              <Input
                id="description"
                value={editedDescription}
                onInput={(e) => setEditedDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <Label className="text-base">Edit Coins</Label>
            <Separator />
            {editedCoins.map((c, index) => (
              <div key={index} className="flex items-center gap-4">
                <div class="flex items-center gap-4 w-full">
                  <TrashIcon onClick={()=>handleDeleteEdit(c)} className="h-8 text-red-600"/>
                  <Label htmlFor={`coin-${index}`} className="text-right flex flex-row items-center gap-1">
                    <img class="h-4 w-4" src={cryptos_map.value[c.crypto].image} />
                    <span class="text-left text-base">{c.crypto}</span>
                  </Label>
                </div>
                
                <Input
                  id={`coin-${index}`}
                  value={c.amount}
                  onInput={(e) => handleCoinChange(index, e.target.value)}
                  className="col-span-3 max-w-[300px]"
                />
              </div>
            ))}

            <div class="w-full">
            {addedCryptos.length > 0 && <Label>Coins to add</Label>}
              {addedCryptos.map((crypto)=>{
                return (
                  <div onClick={()=>{removeFromAdded(crypto)}}>
                    <div class="flex w-full justify-between h-8">
                      <div class="flex flex-row items-center gap-2">
                        <img class="h-4 w-4" src={cryptos_map.value[crypto.crypto].image} />
                        <span>{crypto.crypto}</span>
                      </div>
                      <span>{crypto.amount}</span>
                    </div>
                    <Separator />
                  </div>
                )
              })}

              <div class="flex items-end justify-end">
                <Popover modal className="absolute" side="top">
                  <PopoverTrigger className="underline">Add Coins</PopoverTrigger>
                  <PopoverContent className="mt-2" static side="top">
                    <div className="flex flex-col gap-2">
                      <CryptoSelector onSelect={setSelectedCrypto} cryptosList={cryptos_list.value} />
                      <span>
                        {selectedCrypto ? (
                          <span>
                            Selected: <span className="font-bold">{selectedCrypto.s.toUpperCase()}</span>
                          </span>
                        ) : (
                          <span className="flex items-center text-muted">
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            No crypto selected
                          </span>
                        )}
                      </span>
                      
                      <Input placeholder="amount" type="number" onChange={(e) => setAddAmount(e.target.value)} />
                      
                      <Button className="w-full" onClick={handleAddCrypto}>Submit</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>


            
          </div>
          <DialogFooter>
            <div class="flex w-full justify-between items-center">
              <div class='flex flex-col gap-4 w-full'>
                <Button type="submit" className="w-full" onClick={handleSubmit}>
                  Save changes
                </Button>
                <Button variant="destructive" className="underline hover:cursor-pointer text-xs text-center" onClick={handleDeletePortfolio}>Delete portfolio?</Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}