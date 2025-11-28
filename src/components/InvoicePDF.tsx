import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { InvoiceData } from '@/pages/Index';

interface InvoicePDFProps {
  invoiceData: InvoiceData;
  logo?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  dateSection: {
    textAlign: 'right',
  },
  dateLabel: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: '#e5e5e5',
    marginVertical: 20,
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  addressBlock: {
    width: '45%',
  },
  addressLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 10,
    color: '#4a4a4a',
    lineHeight: 1.4,
  },
  table: {
    marginTop: 20,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#d4d4d4',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableColDescription: {
    width: '50%',
  },
  tableColQty: {
    width: '15%',
    textAlign: 'right',
  },
  tableColPrice: {
    width: '17.5%',
    textAlign: 'right',
  },
  tableColAmount: {
    width: '17.5%',
    textAlign: 'right',
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableBodyText: {
    fontSize: 10,
    color: '#1a1a1a',
  },
  totalsSection: {
    marginLeft: 'auto',
    width: '45%',
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 10,
    color: '#666666',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalSeparator: {
    borderTopWidth: 1,
    borderTopColor: '#d4d4d4',
    marginVertical: 8,
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  notesSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  notesLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  notesText: {
    fontSize: 10,
    color: '#4a4a4a',
    lineHeight: 1.5,
  },
});

const InvoicePDF = ({ invoiceData, logo }: InvoicePDFProps) => {
  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {logo && <Image src={logo} style={styles.logo} />}
            <View>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>{invoiceData.invoiceNumber}</Text>
            </View>
          </View>
          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>Invoice Date</Text>
            <Text style={styles.dateValue}>
              {new Date(invoiceData.invoiceDate).toLocaleDateString()}
            </Text>
            <Text style={styles.dateLabel}>Due Date</Text>
            <Text style={styles.dateValue}>
              {new Date(invoiceData.dueDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Addresses */}
        <View style={styles.addressSection}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>From</Text>
            <Text style={styles.companyName}>
              {invoiceData.fromCompany || 'Your Company'}
            </Text>
            <Text style={styles.addressText}>{invoiceData.fromEmail}</Text>
            <Text style={styles.addressText}>{invoiceData.fromAddress}</Text>
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Bill To</Text>
            <Text style={styles.companyName}>
              {invoiceData.toCompany || 'Client Company'}
            </Text>
            <Text style={styles.addressText}>{invoiceData.toEmail}</Text>
            <Text style={styles.addressText}>{invoiceData.toAddress}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.tableColDescription]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderText, styles.tableColQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.tableColPrice]}>Price</Text>
            <Text style={[styles.tableHeaderText, styles.tableColAmount]}>Amount</Text>
          </View>
          {invoiceData.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableBodyText, styles.tableColDescription]}>
                {item.description || 'Item description'}
              </Text>
              <Text style={[styles.tableBodyText, styles.tableColQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableBodyText, styles.tableColPrice]}>
                ${item.price.toFixed(2)}
              </Text>
              <Text style={[styles.tableBodyText, styles.tableColAmount]}>
                ${(item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Tax ({invoiceData.taxRate}%)
            </Text>
            <Text style={styles.totalValue}>${taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalSeparator} />
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoiceData.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoiceData.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
