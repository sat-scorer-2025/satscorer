// src/components/DownloadReceipt.jsx
import React from 'react';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png'; // Direct import of logo.png from assets folder

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  // Header Section
  header: {
    borderBottom: '2pt solid #000000',
    paddingBottom: 15,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 60,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 9,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 8,
    lineHeight: 1.4,
  },
  // Title Section
  titleSection: {
    textAlign: 'center',
    marginBottom: 20,
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 5,
  },
  receiptSubtitle: {
    fontSize: 9,
    color: '#333333',
  },
  // Info Boxes
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBox: {
    width: '48%',
    border: '1pt solid #000000',
    padding: 10,
  },
  infoBoxTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    borderBottom: '1pt solid #000000',
    paddingBottom: 4,
  },
  infoText: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  // Table Section
  tableSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  table: {
    border: '1pt solid #000000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000000',
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    borderRight: '1pt solid #000000',
  },
  tableCellHeader: {
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    borderRight: '1pt solid #000000',
  },
  // Totals Section
  totalsSection: {
    marginTop: 15,
    marginBottom: 20,
  },
  totalsBox: {
    marginLeft: 'auto',
    width: '45%',
    border: '1pt solid #000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
    borderBottom: '1pt solid #000000',
  },
  totalRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#000000',
    color: '#ffffff',
  },
  totalLabel: {
    fontSize: 9,
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Footer Section
  footer: {
    borderTop: '1pt solid #000000',
    paddingTop: 15,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 8,
    textAlign: 'center',
    lineHeight: 1.5,
    marginBottom: 5,
  },
  footerBold: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  // Status
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginRight: 5,
  },
  statusBadge: {
    border: '1pt solid #000000',
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: 'bold',
  },
});

const formatINR = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(num);
};

const formatDateTime = (dateObj) => {
  if (!dateObj) return { date: 'N/A', time: 'N/A' };
  try {
    const d = new Date(dateObj);
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    return { date, time };
  } catch (e) {
    return { date: 'N/A', time: 'N/A' };
  }
};

const DownloadReceipt = ({ transaction = {} }) => {
  // Debug: Log transaction to inspect data structure
  console.log('Transaction:', JSON.stringify(transaction, null, 2));

  const user = transaction.userId || {};
  const course = transaction.courseId || {};
  const courseTitle = course.title || 'N/A';
  const examType = course.examType || 'N/A';
  const rate = typeof transaction.amount === 'number' ? transaction.amount : 0;
  const quantity = 1;
  const lineTotal = rate * quantity;
  const totalAmount = lineTotal;
  const dateTime = formatDateTime(transaction.paymentDate);
  const paymentStatus = transaction.status || 'pending';
  const invoiceNumber = transaction.transactionId || transaction.cashfreeOrderId || `INV_${Date.now()}`;
  const paymentMethod = transaction.paymentMethod
    ? transaction.paymentMethod
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'N/A';
  const phone = user.phone || 'N/A';

  return (
    <PDFDownloadLink
      document={
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Image src={logo} style={styles.logo} />
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>SATSCORER</Text>
                  <Text style={styles.companyDetails}>3207 - Sudama Nagar, E-Sector</Text>
                  <Text style={styles.companyDetails}>Indore, Madhya Pradesh - 452009</Text>
                  <Text style={styles.companyDetails}>India</Text>
                  <Text style={[styles.companyDetails, { marginTop: 4 }]}>Phone: +91-7987340207</Text>
                  <Text style={styles.companyDetails}>Email: support@satscorer.com</Text>
                </View>
              </View>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.receiptTitle}>PAYMENT RECEIPT</Text>
              <Text style={styles.receiptSubtitle}>Official Transaction Receipt</Text>
            </View>

            {/* Receipt Info and Customer Info */}
            <View style={styles.infoRow}>
              {/* Customer Information */}
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxTitle}>Bill To</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Name:</Text> {user.name || 'N/A'}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Email:</Text> {user.email || 'N/A'}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Phone:</Text> {phone}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Address:</Text> {user.address || 'N/A'}</Text>
              </View>

              {/* Transaction Information */}
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxTitle}>Transaction Details</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Receipt No:</Text> {invoiceNumber}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Date:</Text> {dateTime.date}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Time:</Text> {dateTime.time}</Text>
                <Text style={styles.infoText}><Text style={styles.infoLabel}>Payment Method:</Text> {paymentMethod}</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status:</Text>
                  <Text style={styles.statusBadge}>{paymentStatus.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {/* Order ID Section */}
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Transaction ID:</Text> {transaction.transactionId || 'N/A'}</Text>
              <Text style={styles.infoText}><Text style={styles.infoLabel}>Cashfree Order ID:</Text> {transaction.cashfreeOrderId || 'N/A'}</Text>
            </View>

            {/* Items Table */}
            <View style={styles.tableSection}>
              <Text style={styles.sectionTitle}>Items Purchased</Text>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCellHeader, { width: '10%', textAlign: 'center' }]}>Sr. No.</Text>
                  <Text style={[styles.tableCellHeader, { width: '45%' }]}>Description</Text>
                  <Text style={[styles.tableCellHeader, { width: '15%' }]}>Exam Type</Text>
                  <Text style={[styles.tableCellHeader, { width: '10%', textAlign: 'center' }]}>Qty</Text>
                  <Text style={[styles.tableCellHeader, { width: '20%', textAlign: 'right', borderRight: 'none' }]}>Amount (₹)</Text>
                </View>
                {/* Table Row */}
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>1</Text>
                  <Text style={[styles.tableCell, { width: '45%' }]}>{courseTitle}</Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>{examType}</Text>
                  <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>{quantity}</Text>
                  <Text style={[styles.tableCell, { width: '20%', textAlign: 'right', borderRight: 'none' }]}>{formatINR(rate)}</Text>
                </View>
              </View>
            </View>

            {/* Totals Section */}
            <View style={styles.totalsSection}>
              <View style={styles.totalsBox}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal:</Text>
                  <Text style={styles.totalValue}>₹ {formatINR(totalAmount)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax (GST Included):</Text>
                  <Text style={styles.totalValue}>—</Text>
                </View>
                <View style={styles.totalRowLast}>
                  <Text style={styles.grandTotalLabel}>TOTAL PAID:</Text>
                  <Text style={styles.grandTotalValue}>₹ {formatINR(totalAmount)}</Text>
                </View>
              </View>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
              <Text style={styles.footerBold}>Terms & Conditions:</Text>
              <Text style={styles.footerText}>• This is a computer-generated receipt and does not require a physical signature.</Text>
              <Text style={styles.footerText}>• All payments are non-refundable unless otherwise stated in our refund policy.</Text>
              <Text style={styles.footerText}>• For any queries, please contact us at support@satscorer.com or +91-7987340207.</Text>
              <Text style={[styles.footerText, { marginTop: 10, fontWeight: 'bold' }]}>Thank you for your payment!</Text>
            </View>
          </Page>
        </Document>
      }
      fileName={`receipt_${invoiceNumber}.pdf`}
    >
      {({ loading }) => (
        <button
          type="button"
          className="text-indigo-600 hover:text-indigo-800 flex items-center text-xs sm:text-sm"
          title="Download Receipt"
          disabled={loading}
        >
          <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-0" />
          <span className="sm:hidden">{loading ? 'Preparing...' : 'Download'}</span>
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadReceipt;