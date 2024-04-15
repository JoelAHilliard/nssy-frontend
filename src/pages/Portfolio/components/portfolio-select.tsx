// PortfolioDropdown.jsx
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { portfolio_data } from '@/preact-service';

const PortfolioDropdown = ({ cryptosMap, activePortName, setActivePortName, setActivePort, setShowCreate }) => {

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newPortfolioData = Array.from(portfolio_data.value);
    const [reorderedPort] = newPortfolioData.splice(result.source.index, 1);
    newPortfolioData.splice(result.destination.index, 0, reorderedPort);

    portfolio_data.value = newPortfolioData;

  };

  return (
    <DropdownMenu>
        <Button className="p-0">
          <DropdownMenuTrigger className='rounded p-2 w-full'>
              <span className="underline w-full">Select Portfolio ({portfolio_data.value.length})</span>
          </DropdownMenuTrigger>
        </Button>
      <DropdownMenuContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="portfolio-list">
            {(provided) => {return (
              <DropdownMenuRadioGroup {...provided.droppableProps} ref={provided.innerRef} value={activePortName} onValueChange={setActivePortName}>
                {portfolio_data.value.length > 0 && portfolio_data.value.map((port, index) => {
                  const portValue = port.coins.reduce((acc, coin) => acc + cryptosMap[coin.crypto].current_price[0] * coin.amount, 0);
                  return (
                    <Draggable key={port.name} draggableId={port.name} index={index}>
                      {(provided) => (
                        <DropdownMenuRadioItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} onClick={() => { setActivePort(port); setShowCreate(false); }} value={port.name}>
                          <span className="flex ml-auto gap-1">
                            <span className="font-bold">{port.name}</span>
                            {portValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                          </span>
                        </DropdownMenuRadioItem>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </DropdownMenuRadioGroup>
            )}}
          </Droppable>
        </DragDropContext>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setShowCreate(true)}>
          <div className="flex flex-row w-full justify-between">
            <PlusCircle /> Create
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PortfolioDropdown;