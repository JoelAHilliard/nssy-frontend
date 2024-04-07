
import { portfolio_data } from "@/preact-service";
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
import { useState } from "preact/hooks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Edit2, TrashIcon } from "lucide-react";
export function Edit({ portfolio }) {
  const portfolio_name = portfolio;
  const port = portfolio_data.value.find((c) => c.name === portfolio_name);

  const [editedName, setEditedName] = useState(portfolio_name);
  const [editedDescription, setEditedDescription] = useState(port.description);
  const [editedCoins, setEditedCoins] = useState(port.coins);

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
      coins: editedCoins,
    };

    const updatedPortfolioData = portfolio_data.value.map((p) =>
      p.name === portfolio_name ? updatedPortfolio : p
    );

    portfolio_data.value = updatedPortfolioData;
  };

  const handleDelete = (c) => {
    const updatedPortfolio = {...port, coins:[]};
    for(let i =0; i < port.coins.length;i++){
      if(port.coins[i].crypto != c.crypto){
        updatedPortfolio.coins.append(port.coins[i])
      }
    }
    console.log(updatedPortfolio)
    const updatedPortfolioData = portfolio_data.value.map((p) =>
      p.name === portfolio_name ? updatedPortfolio : p
    );

    portfolio_data.value = updatedPortfolioData;
  }

  return (
    <Dialog className="absolute top-0">
      <DialogTrigger asChild>
        <Button variant="outline">Edit Portfolio</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {portfolio}</DialogTitle>
          <DialogDescription>
            Make changes to your portfolio here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {editedCoins.map((c, index) => (
            <div key={index} className="grid grid-cols-4 items-center gap-4">
              <div class="flex items-center gap-2">
                <TrashIcon onClick={()=>handleDelete(c)} className="h-4 text-red-600"/>
                <Label htmlFor={`coin-${index}`} className="text-right">
                  {c.crypto}
                </Label>
              </div>
              
              <Input
                id={`coin-${index}`}
                value={c.amount}
                onInput={(e) => handleCoinChange(index, e.target.value)}
                className="col-span-3"
              />
            </div>
          ))}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
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
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={editedDescription}
              onInput={(e) => setEditedDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}