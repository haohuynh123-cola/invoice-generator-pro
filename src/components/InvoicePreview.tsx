import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Printer, Download } from "lucide-react";
import { InvoiceData } from "@/pages/Index";
import { toast } from "sonner";

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

const InvoicePreview = ({ invoiceData }: InvoicePreviewProps) => {
  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
    toast.success("Opening print dialog...");
  };

  const handleDownload = () => {
    toast.info("PDF generation coming soon! Use print for now.");
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-center print:hidden">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownload} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Invoice Preview */}
      <Card className="p-8 md:p-12 max-w-4xl mx-auto bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">INVOICE</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {invoiceData.invoiceNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Invoice Date</p>
            <p className="font-semibold text-foreground">
              {new Date(invoiceData.invoiceDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Due Date</p>
            <p className="font-semibold text-foreground">
              {new Date(invoiceData.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* From and To Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
              From
            </h3>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                {invoiceData.fromCompany || "Your Company"}
              </p>
              <p className="text-sm text-muted-foreground">
                {invoiceData.fromEmail}
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {invoiceData.fromAddress}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
              Bill To
            </h3>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                {invoiceData.toCompany || "Client Company"}
              </p>
              <p className="text-sm text-muted-foreground">
                {invoiceData.toEmail}
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {invoiceData.toAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground uppercase">
                    Description
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground uppercase">
                    Qty
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground uppercase">
                    Price
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="py-3 px-2 text-foreground">
                      {item.description || "Item description"}
                    </td>
                    <td className="text-right py-3 px-2 text-foreground">
                      {item.quantity}
                    </td>
                    <td className="text-right py-3 px-2 text-foreground">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-2 font-semibold text-foreground">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax ({invoiceData.taxRate}%)</span>
              <span className="font-semibold">${taxAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoiceData.notes && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
              Notes
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {invoiceData.notes}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InvoicePreview;
