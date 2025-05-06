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
    <div className="flex items-center space-x-2 relative">
      <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="appearance-none bg-transparent text-gray-500 px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
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
