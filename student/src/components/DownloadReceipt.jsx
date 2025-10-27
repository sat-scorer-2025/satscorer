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
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  container: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 20,
    minHeight: '100%',
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 180,
    height: 90,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 8,
    color: '#374151',
    flexShrink: 1,
  },
  invoiceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  invoiceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#0f172a',
    borderBottom: '2 solid #8b5cf6', // Matches purple theme
    paddingBottom: 2,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0f172a',
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billingBox: {
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 8,
    width: '48%',
  },
  billingText: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  table: {
    display: 'table',
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
  },
  th: {
    padding: 5,
    borderRight: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    fontSize: 9,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    textAlign: 'center',
  },
  td: {
    padding: 5,
    borderRight: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    fontSize: 9,
    textAlign: 'center',
    wordBreak: 'break-word',
  },
  right: {
    textAlign: 'right',
  },
  totalsBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalsInner: {
    width: '40%',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 8,
  },
  smallMuted: {
    fontSize: 8,
    color: '#6b7280',
  },
  watermark: {
    position: 'absolute',
    opacity: 0.05,
    width: '60%',
    left: '20%',
    top: '30%',
  },
  footerNote: {
    marginTop: 16,
    fontSize: 8,
    textAlign: 'center',
    color: '#6b7280',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 10,
    fontSize: 8,
    textAlign: 'center',
    color: '#fff',
    minWidth: 60,
  },
  statusCompleted: { backgroundColor: '#10b981' },
  statusPending: { backgroundColor: '#f59e0b' },
  statusFailed: { backgroundColor: '#ef4444' },
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
  const statusStyle =
    paymentStatus === 'completed'
      ? styles.statusCompleted
      : paymentStatus === 'failed'
      ? styles.statusFailed
      : styles.statusPending;
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
            <View style={styles.container}>
              <Image src={logo} style={styles.watermark} />
              <View style={styles.headerRow}>
                <Image src={logo} style={styles.logo} />
                <View style={styles.companyInfo}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0f172a' }}>SATScorer</Text>
                  <Text style={{ marginTop: 2 }}>Phone: +91-7987340207</Text>
                  <Text>Email: support@satscorer.com</Text>
                  <Text>3207 - Sudama Nagar, E-Sector, Indore, Madhya Pradesh - 452009, India</Text>
                </View>
              </View>

              <View style={styles.invoiceTitleRow}>
                <Text style={styles.invoiceLabel}>PAYMENT RECEIPT</Text>
              </View>

              <View style={[styles.twoColumn, styles.section]}>
                <View style={styles.billingBox}>
                  <Text style={styles.sectionHeader}>Billed To</Text>
                  <View style={styles.billingText}>
                    <Text>{user.name || 'N/A'}</Text>
                    <Text style={{ marginTop: 4 }}>{user.email || 'N/A'}</Text>
                    <Text style={{ marginTop: 2 }}>{phone}</Text>
                    <Text style={{ marginTop: 2 }}>{user.address || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.billingBox}>
                  <Text style={styles.sectionHeader}>Payment Details</Text>
                  <View style={styles.billingText}>
                    <Text>Transaction ID: {transaction.transactionId || 'N/A'}</Text>
                    <Text style={{ marginTop: 4 }}>Cashfree Order ID: {transaction.cashfreeOrderId || 'N/A'}</Text>
                    <Text style={{ marginTop: 4 }}>Date: {dateTime.date}</Text>
                    <Text style={{ marginTop: 2 }}>Time: {dateTime.time}</Text>
                    <Text style={{ marginTop: 4 }}>Payment Method: {paymentMethod}</Text>
                    <Text style={{ marginTop: 4 }}>
                      Status: <Text style={[styles.statusBadge, statusStyle]}>{paymentStatus.toUpperCase()}</Text>
                    </Text>
                    <Text style={{ marginTop: 6, fontSize: 8, color: '#6b7280' }}>
                      Note: This receipt is system-generated and does not require a signature.
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Order Summary</Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.th, { width: '8%' }]}>No.</Text>
                    <Text style={[styles.th, { width: '45%' }]}>Course</Text>
                    <Text style={[styles.th, { width: '14%' }]}>Exam</Text>
                    <Text style={[styles.th, { width: '11%' }]}>Qty</Text>
                    <Text style={[styles.th, { width: '11%' }]}>Rate</Text>
                    <Text style={[styles.th, { width: '11%' }]}>Total</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={[styles.td, { width: '8%' }]}>1</Text>
                    <Text style={[styles.td, { width: '45%', textAlign: 'left' }]}>{courseTitle}</Text>
                    <Text style={[styles.td, { width: '14%' }]}>{examType}</Text>
                    <Text style={[styles.td, { width: '11%' }]}>{quantity}</Text>
                    <Text style={[styles.td, { width: '11%', textAlign: 'right' }]}>₹{formatINR(rate)}</Text>
                    <Text style={[styles.td, { width: '11%', textAlign: 'right' }]}>₹{formatINR(lineTotal)}</Text>
                  </View>
                </View>

                <View style={styles.totalsBox}>
                  <View style={styles.totalsInner}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={styles.smallMuted}>Subtotal</Text>
                      <Text style={styles.smallMuted}>₹{formatINR(totalAmount)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={styles.smallMuted}>GST (included)</Text>
                      <Text style={styles.smallMuted}>—</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <Text>Total</Text>
                      <Text>₹{formatINR(totalAmount)}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.footerNote}>
                If you have questions about this receipt, contact support@satscorer.com or +91-7987340207.
              </Text>
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