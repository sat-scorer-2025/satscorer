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
import { assets } from '../../assets/assets.js';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  container: {
    border: '1px solid #e6e7ea',
    borderRadius: 8,
    padding: 24,
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
    width: 200,
    height: 100,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 9,
    color: '#374151',
    flexShrink: 1,
  },
  invoiceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  invoiceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: '#0f172a',
    borderBottom: '2 solid #10b981',
    paddingBottom: 2,
  },
  invoiceMetaBox: {
    border: '1px solid #e6e7ea',
    borderRadius: 6,
    padding: 8,
    minWidth: 190,
    marginTop: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    marginBottom: 4,
  },
  section: {
    marginTop: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#0f172a',
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billingBox: {
    border: '1px solid #e6e7ea',
    borderRadius: 6,
    padding: 10,
    width: '48%',
  },
  billingText: {
    fontSize: 10,
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
    border: '1px solid #e6e7ea',
  },
  tableRow: {
    flexDirection: 'row',
  },
  th: {
    padding: 6,
    borderRight: '1px solid #e6e7ea',
    borderBottom: '1px solid #e6e7ea',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    textAlign: 'center',
  },
  td: {
    padding: 6,
    borderRight: '1px solid #e6e7ea',
    borderBottom: '1px solid #e6e7ea',
    fontSize: 10,
    textAlign: 'center',
    wordBreak: 'break-word',
  },
  right: {
    textAlign: 'right',
  },
  totalsBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  totalsInner: {
    width: '40%',
    border: '1px solid #e6e7ea',
    borderRadius: 6,
    padding: 8,
  },
  smallMuted: {
    fontSize: 8,
    color: '#6b7280',
  },
  watermark: {
    position: 'absolute',
    opacity: 0.04,
    width: '60%',
    left: '20%',
    top: '32%',
  },
  footerNote: {
    marginTop: 18,
    fontSize: 9,
    textAlign: 'center',
    color: '#6b7280',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 9,
    textAlign: 'center',
    color: '#fff',
    minWidth: 70,
  },
  statusCompleted: { backgroundColor: '#10b981' },
  statusPending: { backgroundColor: '#f59e0b' },
  statusFailed: { backgroundColor: '#ef4444' },
});

const formatINR = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(num);
};

const formatDateTime = (dateObj) => {
  if (!dateObj) return 'N/A';
  try {
    const d = new Date(dateObj);
    const date = d.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
    const time = d.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Kolkata' });
    return { date, time, raw: d.toISOString() };
  } catch (e) {
    return 'N/A';
  }
};

const DownloadReceipt = ({ transaction = {} }) => {
  const user = transaction.userId || transaction.user || {};
  const course = transaction.courseId || transaction.course || {};
  const courseTitle = course.title || transaction.courseTitle || 'Course';
  const examType = course.examType || transaction.examType || 'N/A';
  const rate = typeof course.price === 'number' ? course.price : transaction.amount || 0;
  const quantity = 1;
  const lineTotal = rate * quantity;
  const totalAmount = lineTotal;
  const dateTime = formatDateTime(transaction.paymentDate || transaction.createdAt || transaction.updatedAt);
  const paymentStatus = transaction.status || 'pending';
  const statusStyle =
    paymentStatus === 'completed' ? styles.statusCompleted :
    paymentStatus === 'failed' ? styles.statusFailed :
    styles.statusPending;
  const invoiceNumber = transaction.transactionId || transaction.cashfreeOrderId || transaction._id || `INV_${Date.now()}`;

  return (
    <PDFDownloadLink
      document={
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.container}>
              {assets?.logo && <Image src={assets.logo} style={styles.watermark} />}

              <View style={styles.headerRow}>
                {assets?.logo && <Image src={assets.logo} style={styles.logo} />}
                <View style={styles.companyInfo}>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0f172a' }}>SATScorer</Text>
                  <Text style={{ marginTop: 2 }}>Phone: +91-7987340207</Text>
                  <Text>Mail: support@satscorer.com</Text>
                  <Text>3207 - Sudama Nagar, E-Sector, Indore, Madhya Pradesh - 452009, India</Text>
                </View>
              </View>

              <View style={styles.invoiceTitleRow}>
                <Text style={styles.invoiceLabel}>INVOICE / RECEIPT</Text>
              </View>

              <View style={[styles.twoColumn, styles.section]}>
                <View style={styles.billingBox}>
                  <Text style={styles.sectionHeader}>Billed To</Text>
                  <View style={styles.billingText}>
                    <Text>{user.name || 'N/A'}</Text>
                    <Text style={{ marginTop: 4 }}>{user.email || 'N/A'}</Text>
                    <Text style={{ marginTop: 2 }}>{user.phone || 'N/A'}</Text>
                    <Text style={{ marginTop: 2 }}>{user.address || 'N/A'}</Text>
                    <Text style={{ marginTop: 4, fontSize: 9, color: '#6b7280' }}>Role: {user.role || 'student'}</Text>
                    {user.exam && <Text style={{ marginTop: 2, fontSize: 9, color: '#6b7280' }}>Exam: {user.exam}</Text>}
                  </View>
                </View>

                <View style={styles.billingBox}>
                  <Text style={styles.sectionHeader}>Payment Details</Text>
                  <View style={styles.billingText}>
                    <Text>Transaction ID: {transaction.transactionId || 'N/A'}</Text>
                    {/* <Text style={{ marginTop: 4 }} wrap={false}>Order ID: {transaction.cashfreeOrderId || 'N/A'}</Text> */}
                    <Text style={{ marginTop: 4 }}>Payment Method: {transaction.paymentMethod || 'N/A'}</Text>
                    <Text style={{ marginTop: 4 }}>Status: <Text style={[styles.statusBadge, statusStyle]}>{paymentStatus.toUpperCase()}</Text></Text>
                    <Text style={{ marginTop: 6 }} selectable={false}>Note: This receipt is system generated and does not require a signature.</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Order Summary</Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.th, { width: '8%' }]}>No.</Text>
                    <Text style={[styles.th, { width: '45%' }]}>Course / Item</Text>
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
                    <Text style={[styles.td, { width: '11%', textAlign: 'right' }]}>{formatINR(rate)}</Text>
                    <Text style={[styles.td, { width: '11%', textAlign: 'right' }]}>{formatINR(lineTotal)}</Text>
                  </View>
                </View>

                <View style={styles.totalsBox}>
                  <View style={styles.totalsInner}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={styles.smallMuted}>Subtotal</Text>
                      <Text style={styles.smallMuted}>{formatINR(totalAmount)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={styles.smallMuted}>GST (included)</Text>
                      <Text style={styles.smallMuted}>—</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <Text>Total</Text>
                      <Text>{formatINR(totalAmount)}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.footerNote}>If you have questions about this invoice, contact support@satscorer.com or +91-7987340207.</Text>
            </View>
          </Page>
        </Document>
      }
      fileName={`receipt_${transaction.transactionId || transaction.cashfreeOrderId || 'invoice'}.pdf`}
    >
      {({ loading }) => (
        <button type="button" className="flex items-center space-x-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200">
          <ArrowDownTrayIcon className="w-4 h-4" />
          <span>{loading ? 'Preparing PDF...' : 'Download Invoice'}</span>
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadReceipt;
