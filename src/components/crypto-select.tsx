import { useState } from "preact/hooks";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CryptoSelector = ({ cryptosList, onSelect }) => {
  const [filter, setFilter] = useState("");

  return (
    <div class="relative w-full">
      <div class="">
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
        <div class="overflow-y-scroll max-h-[300px] mt-3">
          {cryptosList.filter(
            crypto =>
              crypto.name.toLowerCase().includes(filter.toLowerCase()) ||
              crypto.symbol.toLowerCase().includes(filter.toLowerCase())
          ).slice(0, 70).map((crypto => (
            <div class="w-full text-left" onClick={() => onSelect(crypto)}>
              <Button className="w-full text-left flex gap-2 items-center justify-between px-1" variant="ghost">
                <div class="flex items-center gap-2 py-1">
                  <img class="w-[24px] h-[24px] rounded-full" src={crypto.img} />
                  <div class="flex flex-col">
                    <span class="text-left w-full">{crypto.name}</span>
                    <div class="flex flex-row gap-2">
                      <span class="text-left text-muted-foreground">{crypto.symbol.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                {crypto.daily && (
                  <span class={crypto.daily > 0 ? "text-left text-green-600" : "text-left text-red-600"}>
                    {crypto.daily.toFixed(2)}%
                  </span>
                )}
              </Button>
            </div>
          )))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default CryptoSelector;