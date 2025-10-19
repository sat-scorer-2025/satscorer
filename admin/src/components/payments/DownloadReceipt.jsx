// import React from 'react';
// import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
// import { assets } from '../../assets/assets.js';

// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontSize: 12,
//     fontFamily: 'Helvetica',
//     position: 'relative',
//   },
//   border: {
//     border: '2px solid #333',
//     borderRadius: 10,
//     padding: 20,
//     minHeight: '100%',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     width: 120,
//     height: 50,
//   },
//   contact: {
//     fontSize: 10,
//     textAlign: 'right',
//     lineHeight: 1.4,
//     color: '#555',
//   },
//   title: {
//     textAlign: 'center',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginVertical: 10,
//     color: '#222',
//   },
//   watermark: {
//     position: 'absolute',
//     opacity: 0.05,
//     width: '50%',
//     top: '40%',
//     left: '25%',
//   },
//   section: {
//     border: '1px solid #ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 13,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   table: {
//     display: 'table',
//     width: '100%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//     marginBottom: 15,
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   tableColHeader: {
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     padding: 5,
//     fontWeight: 'bold',
//     backgroundColor: '#f2f2f2',
//     textAlign: 'center',
//   },
//   tableCol: {
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     padding: 5,
//     textAlign: 'center',
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   notes: {
//     fontSize: 8,
//     textAlign: 'center',
//     color: '#555',
//     marginTop: 10,
//   },
// });

// const DownloadReceipt = ({ transaction }) => {
//   const courses = transaction.courses || [
//     { title: transaction.courseId?.title, amount: transaction.amount },
//   ];

//   const totalAmount = courses.reduce((acc, item) => acc + (item.amount || 0), 0);

//   return (
//     <PDFDownloadLink
//       document={
//         <Document>
//           <Page size="A4" style={styles.page}>
//             <View style={styles.border}>
//               <Image src={assets.logo} style={styles.watermark} />

//               {/* Header */}
//               <View style={styles.header}>
//                 <Image src={assets.logo} style={styles.logo} />
//                 <View style={styles.contact}>
//                   <Text>Phone: +91 1234567890</Text>
//                   <Text>Email: support@satscorer.com</Text>
//                   <Text>Address: ABC Street, City, India</Text>
//                 </View>
//               </View>

//               <Text style={styles.title}>PURCHASE RECEIPT</Text>

//               {/* Student Details */}
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Student Details</Text>
//                 <Text>Name: {transaction.userId?.name || 'N/A'}</Text>
//                 <Text>Email: {transaction.userId?.email || 'N/A'}</Text>
//                 <Text>Phone: {transaction.userId?.phone || 'N/A'}</Text>
//                 <Text>Address: {transaction.userId?.address || 'N/A'}</Text>
//               </View>

//               {/* Payment Details */}
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Payment Details</Text>
//                 <Text>Transaction ID: {transaction.transactionId || transaction.cashfreeOrderId}</Text>
//                 <Text>Order ID: {transaction.cashfreeOrderId || 'N/A'}</Text>
//                 <Text>Date: {transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleDateString() : 'N/A'}</Text>
//                 <Text>Time: {transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleTimeString() : 'N/A'}</Text>
//                 <Text>Payment Method: {transaction.paymentMethod || 'N/A'}</Text>
//               </View>

//               {/* Courses Table */}
//               <View style={styles.table}>
//                 {/* Header */}
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableColHeader, { width: '10%' }]}>S.No.</Text>
//                   <Text style={[styles.tableColHeader, { width: '60%' }]}>Course Name</Text>
//                   <Text style={[styles.tableColHeader, { width: '30%' }]}>Amount (₹)</Text>
//                 </View>

//                 {courses.map((course, index) => (
//                   <View style={styles.tableRow} key={index}>
//                     <Text style={[styles.tableCol, { width: '10%' }]}>{index + 1}</Text>
//                     <Text style={[styles.tableCol, { width: '60%' }]}>{course.title}</Text>
//                     <Text style={[styles.tableCol, { width: '30%' }]}>{course.amount?.toLocaleString('en-IN')}</Text>
//                   </View>
//                 ))}

//                 {/* Total */}
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableCol, { width: '10%' }]}></Text>
//                   <Text style={[styles.tableCol, { width: '60%' }]}>Total</Text>
//                   <Text style={[styles.tableCol, { width: '30%' }]}>{totalAmount.toLocaleString('en-IN')}</Text>
//                 </View>
//               </View>

//               <Text style={styles.notes}>
//                 Note: This receipt is software generated and does not require a signature.
//               </Text>
//             </View>
//           </Page>
//         </Document>
//       }
//       fileName={`receipt_${transaction.transactionId || transaction.cashfreeOrderId}.pdf`}
//     >
//       {({ loading }) => (
//         <button className="text-amber-600 hover:text-amber-700 font-semibold py-1 rounded-lg flex flex-row items-center gap-2">
//           <svg
//             className="w-4 h-4 text-amber-600"
//             aria-hidden="true"
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <path
//               stroke="currentColor"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
//             />
//           </svg>
//           <span>{loading ? 'Generating...' : 'Download PDF'}</span>
//         </button>
//       )}
//     </PDFDownloadLink>
//   );
// };

// export default DownloadReceipt;


import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { assets } from '../../assets/assets.js';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  border: {
    border: '2px solid #e5e7eb',
    borderRadius: 10,
    padding: 20,
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 50,
  },
  contact: {
    fontSize: 10,
    textAlign: 'right',
    lineHeight: 1.4,
    color: '#4b5563',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#111827',
  },
  watermark: {
    position: 'absolute',
    opacity: 0.05,
    width: '50%',
    top: '40%',
    left: '25%',
  },
  section: {
    border: '1px solid #e5e7eb',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 15,
    borderColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    textAlign: 'center',
    color: '#4b5563',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'center',
    color: '#1f2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  notes: {
    fontSize: 8,
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 10,
  },
});

const DownloadReceipt = ({ transaction }) => {
  const courses = transaction.courses || [
    { title: transaction.courseId?.title, amount: transaction.amount },
  ];

  const totalAmount = courses.reduce((acc, item) => acc + (item.amount || 0), 0);

  return (
    <PDFDownloadLink
      document={
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.border}>
              <Image src={assets.logo} style={styles.watermark} />

              {/* Header */}
              <View style={styles.header}>
                <Image src={assets.logo} style={styles.logo} />
                <View style={styles.contact}>
                  <Text>Phone: +91 1234567890</Text>
                  <Text>Email: support@satscorer.com</Text>
                  <Text>Address: ABC Street, City, India</Text>
                </View>
              </View>

              <Text style={styles.title}>PURCHASE RECEIPT</Text>

              {/* Student Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Student Details</Text>
                <Text>Name: {transaction.userId?.name || 'N/A'}</Text>
                <Text>Email: {transaction.userId?.email || 'N/A'}</Text>
                <Text>Phone: {transaction.userId?.phone || 'N/A'}</Text>
                <Text>Address: {transaction.userId?.address || 'N/A'}</Text>
              </View>

              {/* Payment Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <Text>Transaction ID: {transaction.transactionId || transaction.cashfreeOrderId}</Text>
                <Text>Order ID: {transaction.cashfreeOrderId || 'N/A'}</Text>
                <Text>Date: {transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleDateString() : 'N/A'}</Text>
                <Text>Time: {transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleTimeString() : 'N/A'}</Text>
                <Text>Payment Method: {transaction.paymentMethod || 'N/A'}</Text>
              </View>

              {/* Courses Table */}
              <View style={styles.table}>
                {/* Header */}
                <View style={styles.tableRow}>
                  <Text style={[styles.tableColHeader, { width: '10%' }]}>S.No.</Text>
                  <Text style={[styles.tableColHeader, { width: '60%' }]}>Course Name</Text>
                  <Text style={[styles.tableColHeader, { width: '30%' }]}>Amount (₹)</Text>
                </View>

                {courses.map((course, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={[styles.tableCol, { width: '10%' }]}>{index + 1}</Text>
                    <Text style={[styles.tableCol, { width: '60%' }]}>{course.title}</Text>
                    <Text style={[styles.tableCol, { width: '30%' }]}>{course.amount?.toLocaleString('en-IN')}</Text>
                  </View>
                ))}

                {/* Total */}
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCol, { width: '10%' }]}></Text>
                  <Text style={[styles.tableCol, { width: '60%' }]}>Total</Text>
                  <Text style={[styles.tableCol, { width: '30%' }]}>{totalAmount.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              <Text style={styles.notes}>
                Note: This receipt is software generated and does not require a signature.
              </Text>
            </View>
          </Page>
        </Document>
      }
      fileName={`receipt_${transaction.transactionId || transaction.cashfreeOrderId}.pdf`}
    >
      {({ loading }) => (
        <button className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-200">
          <ArrowDownTrayIcon className="w-4 h-4" />
          {/* <span>{loading ? 'Generating...' : 'Download PDF'}</span> */}
          <span>{loading ? 'Download PDF' : 'Download PDF'}</span>
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadReceipt;