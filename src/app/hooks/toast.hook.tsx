"use client";

import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

export function useToastDefault(title: string, description: any) {
  toast({
    variant: "default",
    title,
    description,
  });
}

export function useToastDestructive(title: string, description: any) {
  toast({
    variant: "destructive",
    title,
    description,
  });
}
