import { Loader2 } from "lucide-react";

export const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-[50vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
