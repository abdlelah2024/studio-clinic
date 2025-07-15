
"use client"
import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
    options: { value: string; label: string }[];
    selectedValue: string;
    onSelectedValueChange: (value: string) => void;
    placeholder: string;
    searchPlaceholder: string;
    noResultsText: string;
    className?: string;
    onSearchChange?: (search: string) => void;
    addNew?: {
        label: string;
        action: () => void;
    };
}

export function Combobox({ 
    options, 
    selectedValue, 
    onSelectedValueChange,
    placeholder,
    searchPlaceholder,
    noResultsText,
    className,
    onSearchChange,
    addNew
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (onSearchChange) {
        onSearchChange(value);
    }
  }

  const handleSelect = (currentValue: string) => {
    onSelectedValueChange(currentValue === selectedValue ? "" : currentValue)
    setOpen(false)
  }
  
  const displayValue = options.find((option) => option.value === selectedValue)?.label || "";

  // Reset search when the popover closes
  React.useEffect(() => {
    if (!open) {
      setSearch("");
      if(onSearchChange) onSearchChange("");
    }
  }, [open, onSearchChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className, !selectedValue && "text-muted-foreground")}
        >
          <span className="truncate">{selectedValue ? displayValue : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{minWidth: "var(--radix-popover-trigger-width)"}}>
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={search}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>
                {addNew && search ? (
                     <Button variant="ghost" className="w-full justify-start" onClick={() => {
                         addNew.action();
                         setOpen(false);
                     }}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {addNew.label}
                    </Button>
                ) : (
                    noResultsText
                )}
            </CommandEmpty>
            <CommandGroup>
              {options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase())).map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Use label for filtering and display in CMDK
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
