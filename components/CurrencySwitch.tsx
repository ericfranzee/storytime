"use client";

import { useCurrency } from "@/lib/currency-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CurrencySwitch = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center space-x-2 mr-5">
      <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="bg-transparent border focus:outline-none w-[150px] md:mr-2">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="NGN">NGN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySwitch;
