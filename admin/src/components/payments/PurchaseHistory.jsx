import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Filters from './Filters';
import PurchaseHistoryTable from './PurchaseHistoryTable';

const PurchaseHistory = () => {
  const { searchQuery, setSearchQuery, startDate, setStartDate, endDate, setEndDate, selectedCourse, setSelectedCourse, courses, transactions, isLoading } = useOutletContext();

  return (
    <div>
      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        courses={courses}
      />
      <PurchaseHistoryTable transactions={transactions} isLoading={isLoading} />
    </div>
  );
};

export default PurchaseHistory;