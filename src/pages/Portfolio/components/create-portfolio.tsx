import { portfolio_data } from "@/preact-service"
import { signal } from "@preact/signals";
import { Card } from "@/components/ui/card";
import { useState } from "preact/hooks";
const name = signal("Name")
const amount = signal(0)
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export const CreatePortfolio = () => {
    const [name,setName]= useState(null);


    const createPort = () =>{
        let portfolio_copy = portfolio_data.value ? [...portfolio_data.value] : [];
        let newPort = {
            "name":name,
            "coins":[]
        }
        portfolio_copy.push(newPort);

        portfolio_data.value = portfolio_copy;
        localStorage.setItem("portfolios",JSON.stringify(portfolio_copy))
    }
    return(
        <div>
             <Dialog>
            <DialogTrigger><Button variant="ghost">Add Bucket</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create</DialogTitle>
                </DialogHeader>
                <div>
                    <Label htmlFor="portfoliotitle">Bucket Name</Label>
                    <Input type="text" id="amount" placeholder="Hot/Cold wallet, Coinbase, PoW..." onChange={(e) => setName(e.target.value)} />
                </div>
                {/* <div>
                    <Label htmlFor="price">Entry Price (optional)</Label>
                    <Input type="number" id="price" placeholder="$250" onChange={(e) => setPrice(e.target.value)} />

                </div> */}
                <DialogClose disabled={!name}>
                    <Button className={(name) ? "active" : "disabled"} onClick={createPort}>Add</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
        </div>
    )
}