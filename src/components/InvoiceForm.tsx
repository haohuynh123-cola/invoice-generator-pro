import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { InvoiceData, InvoiceItem } from "@/pages/Index";

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData) => void;
}

const InvoiceForm = ({ invoiceData, setInvoiceData }: InvoiceFormProps) => {
  const handleInputChange = (field: keyof InvoiceData, value: string | number) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = invoiceData.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
    };
    setInvoiceData({ ...invoiceData, items: [...invoiceData.items, newItem] });
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({
        ...invoiceData,
        items: invoiceData.items.filter(item => item.id !== id),
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Invoice Details */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
              placeholder="INV-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input
              id="invoiceDate"
              type="date"
              value={invoiceData.invoiceDate}
              onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* From Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">From</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromCompany">Company Name</Label>
            <Input
              id="fromCompany"
              value={invoiceData.fromCompany}
              onChange={(e) => handleInputChange("fromCompany", e.target.value)}
              placeholder="Your Company Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromEmail">Email</Label>
            <Input
              id="fromEmail"
              type="email"
              value={invoiceData.fromEmail}
              onChange={(e) => handleInputChange("fromEmail", e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fromAddress">Address</Label>
            <Textarea
              id="fromAddress"
              value={invoiceData.fromAddress}
              onChange={(e) => handleInputChange("fromAddress", e.target.value)}
              placeholder="Street, City, State, ZIP"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* To Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Bill To</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="toCompany">Company Name</Label>
            <Input
              id="toCompany"
              value={invoiceData.toCompany}
              onChange={(e) => handleInputChange("toCompany", e.target.value)}
              placeholder="Client Company Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toEmail">Email</Label>
            <Input
              id="toEmail"
              type="email"
              value={invoiceData.toEmail}
              onChange={(e) => handleInputChange("toEmail", e.target.value)}
              placeholder="client@email.com"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="toAddress">Address</Label>
            <Textarea
              id="toAddress"
              value={invoiceData.toAddress}
              onChange={(e) => handleInputChange("toAddress", e.target.value)}
              placeholder="Street, City, State, ZIP"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Line Items</h2>
          <Button onClick={addItem} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        <div className="space-y-4">
          {invoiceData.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 rounded-lg border bg-card">
              <div className="col-span-12 md:col-span-5 space-y-2">
                <Label htmlFor={`desc-${item.id}`}>Description</Label>
                <Input
                  id={`desc-${item.id}`}
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  placeholder="Service or product description"
                />
              </div>
              <div className="col-span-5 md:col-span-2 space-y-2">
                <Label htmlFor={`qty-${item.id}`}>Quantity</Label>
                <Input
                  id={`qty-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="col-span-5 md:col-span-3 space-y-2">
                <Label htmlFor={`price-${item.id}`}>Price</Label>
                <Input
                  id={`price-${item.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(item.id, "price", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-2 md:col-span-2 flex items-end justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  disabled={invoiceData.items.length === 1}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax and Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={invoiceData.taxRate}
            onChange={(e) => handleInputChange("taxRate", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={invoiceData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Additional notes or payment terms"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
