import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { __ } from '@wordpress/i18n';

import { cn } from "../utils"
import { Button } from "./Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./Popover"

export function ComboBox({ options, onChange, defaultValue, className, variant = "select", searchInputPlaceholder = "Search" }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          role="combobox"
          aria-expanded={open}
          className={cn("w-[85px]", className)}
          size="select"
        >
          {
            value
              ? options.find((option) => option.value === value)?.selectedLabel
              : __('Select', 'favcrm-for-woocommerce')
          }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, query, keywords) => {
            return (value?.toLowerCase().includes(query?.toLowerCase()) || keywords?.[0]?.toLowerCase().includes(query?.toLowerCase())) ? 1 : 0;
          }}
        >
          <CommandInput className="text-black" placeholder={__(searchInputPlaceholder, 'favcrm-for-woocommerce')} />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className="text-black"
                  key={option.label}
                  keywords={[option.label]}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onChange(currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
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
