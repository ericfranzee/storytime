import { toast } from "@/hooks/use-toast";

export const showToast = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
      duration: 3000,
    });
  },
  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      duration: 5000,
    });
  },
  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
      duration: 4000,
    });
  }
};
