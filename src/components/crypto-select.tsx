import { useState } from "preact/hooks";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CryptoSelector = ({ cryptosList, onSelect }) => {
  const [filter, setFilter] = useState("");
  const [showCount, setShowCount] = useState(10);

  const filteredCryptos = cryptosList.filter(
    crypto =>
      crypto.n.toLowerCase().includes(filter.toLowerCase()) ||
      crypto.s.toLowerCase().includes(filter.toLowerCase())
  );

  const handleShowMore = () => {
    setShowCount(prevCount => prevCount + 10);
  };

  return (
    <div class="relative w-full max-h-[200px]">
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
      <div class="relative flex flex-col w-full gap-1 overflow-y-scroll max-h-[170px]">
        <div class="overflow-y-scroll max-h-[300px] mt-3">
          {filteredCryptos.slice(0, showCount).map((crypto) => {
            
            return (
            <div class="w-full text-left" onClick={() => onSelect(crypto)}>
              <Button className="w-full text-left flex gap-2 items-center justify-between px-1" variant="ghost">
                <div class="flex items-center gap-2 py-1">
                  <img class="w-[24px] h-[24px] rounded-full" src={crypto.img} />
                  <div class="flex flex-col">
                    <span class="text-left w-full">{crypto.n}</span>
                    <div class="flex flex-row gap-2">
                      <span class="text-left text-muted-foreground">{crypto.s.toUpperCase()}</span>
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
          )})}
        </div>
        {showCount < filteredCryptos.length && (
          <Button variant="ghost" onClick={handleShowMore} className="mt-2">
            Show More
          </Button>
        )}
      </div>
    </div>
  );
};

export default CryptoSelector;