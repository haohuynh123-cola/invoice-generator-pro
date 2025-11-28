import { useState, useEffect } from "react";
import { InvoiceData } from "@/pages/Index";

export interface SavedInvoice extends InvoiceData {
  savedAt: string;
  id: string;
}

const STORAGE_KEY = "invoice_history";

export const useInvoiceHistory = () => {
  const [history, setHistory] = useState<SavedInvoice[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (error) {
        console.error("Failed to parse invoice history:", error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const saveInvoice = (invoice: InvoiceData) => {
    const savedInvoice: SavedInvoice = {
      ...invoice,
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      savedAt: new Date().toISOString(),
    };

    setHistory((prev) => [savedInvoice, ...prev]);
    return savedInvoice;
  };

  const deleteInvoice = (id: string) => {
    setHistory((prev) => prev.filter((inv) => inv.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    saveInvoice,
    deleteInvoice,
    clearHistory,
  };
};
