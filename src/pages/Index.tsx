import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import { FileText } from "lucide-react";
import invoiceHero from "@/assets/invoice-hero.jpg";

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
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="create">Create Invoice</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6">
            <Card className="p-6">
              <InvoiceForm 
                invoiceData={invoiceData} 
                setInvoiceData={setInvoiceData}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            <InvoicePreview invoiceData={invoiceData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
