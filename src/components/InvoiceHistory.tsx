import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, Trash2, Eye, Download, Calendar } from "lucide-react";
import { SavedInvoice } from "@/hooks/useInvoiceHistory";
import { InvoiceData } from "@/pages/Index";
import { toast } from "sonner";
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from "./InvoicePDF";

interface InvoiceHistoryProps {
  history: SavedInvoice[];
  onLoadInvoice: (invoice: InvoiceData) => void;
  onDeleteInvoice: (id: string) => void;
  onClearHistory: () => void;
  onViewInvoice: (invoice: SavedInvoice) => void;
}

const InvoiceHistory = ({
  history,
  onLoadInvoice,
  onDeleteInvoice,
  onClearHistory,
  onViewInvoice,
}: InvoiceHistoryProps) => {
  const handleDownloadPDF = async (invoice: SavedInvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      toast.loading("Generating PDF...");
      
      const blob = await pdf(
        <InvoicePDF invoiceData={invoice} logo={invoice.logo} />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success("PDF downloaded!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.dismiss();
      toast.error("Failed to generate PDF");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotal = (invoice: SavedInvoice) => {
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const taxAmount = subtotal * (invoice.taxRate / 100);
    return subtotal + taxAmount;
  };

  if (history.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">No invoices yet</h3>
        <p className="text-muted-foreground">
          Create your first invoice and it will be automatically saved here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Invoice History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {history.length} {history.length === 1 ? 'invoice' : 'invoices'} saved
          </p>
        </div>
        {history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all saved invoices. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onClearHistory();
                    toast.success("History cleared");
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid gap-4">
        {history.map((invoice) => (
          <Card
            key={invoice.id}
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onViewInvoice(invoice)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  {invoice.logo ? (
                    <img
                      src={invoice.logo}
                      alt="Logo"
                      className="w-10 h-10 object-contain rounded"
                    />
                  ) : (
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {invoice.invoiceNumber}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {invoice.toCompany || 'No client name'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-semibold text-foreground">
                      ${calculateTotal(invoice).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Invoice Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Saved
                    </p>
                    <p className="font-semibold text-foreground text-xs">
                      {formatDate(invoice.savedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadInvoice(invoice);
                    toast.success("Invoice loaded for editing");
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDownloadPDF(invoice, e)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete invoice?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{invoice.invoiceNumber}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteInvoice(invoice.id);
                          toast.success("Invoice deleted");
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvoiceHistory;
