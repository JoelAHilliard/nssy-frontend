import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { portfolio_data } from "@/preact-service"
import { useState, useEffect } from "preact/hooks";
import { CheckIcon, Edit2Icon, EditIcon, TrashIcon } from "lucide-react";

const EditPortfolio = (params) => {
    const [portfolio, setPortfolio] = useState(null);
    const [newName, setNewName] = useState(null);

    useEffect(() => {
        const currentPortfolio = portfolio_data.peek().find(p => p.name === params.portName);
        if (currentPortfolio) {
            setPortfolio({ ...currentPortfolio });
        }
    }, [params.portName]);


    const updateCoinAmount = (coinName, newAmount) => {
        const updatedCoins = portfolio.coins.map(coin => {
            if (coin.crypto.name === coinName) {
                return { ...coin, amount: newAmount }; // Only update the amount of the matching coin
            }
            return coin; // Leave other coins unchanged
        });
        setPortfolio({ ...portfolio, coins: updatedCoins }); // Update the state with the new coins array
    };
    

    const deleteCoin = (coinName) => {
        const updatedCoins = portfolio.coins.filter(coin => coin.crypto.name !== coinName);
        setPortfolio({ ...portfolio, coins: updatedCoins });
    };


    const submitNewName = () => {
        let copy = [...portfolio_data.peek()];
        for(let i =0;i<copy.length;i++){
            if(copy[i].name == params.portName){
                copy[i].name = newName;
            }
        }

        portfolio_data.value = copy;
    }
    const saveChanges = () => {
        const updatedPortfolios = portfolio_data.peek().map(p => {
            if (p.name === params.portName) {
                return portfolio;
            }
            return p;
        });
        portfolio_data.value = updatedPortfolios;

        setNewName(null);
    };


 
    if (!portfolio) return <p>Loading...</p>;

    return (
        <div>
            <Dialog>
                <DialogTrigger className="flex items-center"><Button variant="outline"><EditIcon /></Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Portfolio: {portfolio.name}</DialogTitle>
                    </DialogHeader>
                    <div class="flex items-center gap-8">
                        <Input  type="text" placeholder="Change name"
                            onChange={(e) => setNewName(e.target.value)} 
                        />
                        {newName && <Button onClick={submitNewName}><CheckIcon /></Button>}
                    </div>
                    
                    <div>
                        {portfolio.coins.map((coin, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex items-center gap-2 font-bold text-lg py-1">
                                    <span>{coin.crypto.name}</span>
                                    <Button size="icon" variant="destructive" onClick={() => deleteCoin(coin.crypto.name)}><TrashIcon /></Button>
                                </div>
                                <div class="flex items-center gap-8">

                                    <Input 
                                        type="number" 
                                        id={`coin-input`+coin.crypto.name}
                                        onChange={(e) => updateCoinAmount(coin.crypto.name, e.target.value)} 
                                        placeholder="Amount"
                                    />
                                    <Button onClick={saveChanges}><CheckIcon /></Button>
                                </div>
                                

                            </div>
                        ))}
                    </div>
                    <DialogClose onClick={saveChanges}>Close</DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditPortfolio;
