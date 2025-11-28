import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import InvoiceHistory from "@/components/InvoiceHistory";
import { FileText, Save } from "lucide-react";
import { toast } from "sonner";
import invoiceHero from "@/assets/invoice-hero.jpg";
import { useInvoiceHistory, SavedInvoice } from "@/hooks/useInvoiceHistory";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  fromCompany: string;
  fromEmail: string;
  fromAddress: string;
  toCompany: string;
  toEmail: string;
  toAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  logo?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { history, saveInvoice, deleteInvoice, clearHistory } = useInvoiceHistory();
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fromCompany: "",
    fromEmail: "",
    fromAddress: "",
    toCompany: "",
    toEmail: "",
    toAddress: "",
    items: [{ id: "1", description: "", quantity: 1, price: 0 }],
    taxRate: 0,
    notes: "",
    logo: undefined,
  });

  const handleSaveInvoice = () => {
    // Validate required fields
    if (!invoiceData.fromCompany || !invoiceData.toCompany) {
      toast.error("Please fill in company names before saving");
      return;
    }

    if (invoiceData.items.some(item => !item.description || item.price <= 0)) {
      toast.error("Please complete all line items before saving");
      return;
    }

    saveInvoice(invoiceData);
    toast.success("Invoice saved to history!");
  };

  const handleLoadInvoice = (invoice: InvoiceData) => {
    setInvoiceData(invoice);
    setActiveTab("create");
  };

  const handleViewInvoice = (invoice: SavedInvoice) => {
    setInvoiceData(invoice);
    setActiveTab("preview");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${invoiceHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Invoice Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create professional invoices in minutes. Add your details, line items, and generate a polished invoice ready to send.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="create">Create Invoice</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="history">
              History
              {history.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                  {history.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6">
            <Card className="p-6">
              <InvoiceForm 
                invoiceData={invoiceData} 
                setInvoiceData={setInvoiceData}
              />
            </Card>
            <div className="flex justify-center">
              <Button onClick={handleSaveInvoice} size="lg" className="gap-2">
                <Save className="w-5 h-5" />
                Save to History
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <InvoicePreview invoiceData={invoiceData} />
            <div className="flex justify-center mt-6">
              <Button onClick={handleSaveInvoice} variant="outline" className="gap-2">
                <Save className="w-5 h-5" />
                Save to History
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <InvoiceHistory
              history={history}
              onLoadInvoice={handleLoadInvoice}
              onDeleteInvoice={deleteInvoice}
              onClearHistory={clearHistory}
              onViewInvoice={handleViewInvoice}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
