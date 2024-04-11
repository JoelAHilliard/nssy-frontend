import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"

const DropDownMenu = ({callback, filter, name, activeFilter}) => {
    return(
        <div class="flex justify-center">
            <DropdownMenu className={`hover:cursor-pointer flex justify-center`}>

                <DropdownMenuTrigger className="flex items-center justify-center">
                    <Button className={`${filter === activeFilter.value ? "text-primary bg-primary/25" : "bg-background"} whitespace-nowrap w-fit focus-visible:none min-w-[30px]`} variant="ghost">{name}</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                        <DropdownMenuLabel>Sort {name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                     
                        <div>
                            <DropdownMenuItem onClick={() => callback(filter,"a")}>Ascending</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => callback(filter,"d")}>Descending</DropdownMenuItem>
                        </div>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        
    )
                    
}

export default DropDownMenu