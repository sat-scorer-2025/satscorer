import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import CourseManagement from './pages/CourseManagement';
import CreateCourseForm from './components/course/CreateCourseForm';
import CourseContentTab from './components/course/CourseContentTab';
import ManageCoursesTable from './components/course/ManageCoursesTable';
import TestManagement from './pages/TestManagement';
import CreateTest from './components/tests/CreateTest';
import TestDetailsForm from './components/tests/TestDetailsForm';
import AddQuestions from './components/tests/AddQuestions';
import ManageTests from './components/tests/ManageTests';
import EditTestDrawer from './components/tests/EditTestDrawer';
import TestAnalytics from './components/tests/TestAnalytics';
import TestResultReview from './components/tests/TestResultReview';
import StudentManagement from './pages/StudentManagement';
import RegisteredStudents from './components/students/RegisteredStudents';
import EnrolledStudents from './components/students/EnrolledStudents';
import ProfileDialog from './components/students/ProfileDialog';
import SalesAndPayments from './pages/SalesAndPayments';
import RevenueDashboard from './components/payments/RevenueDashboard';
import PurchaseHistory from './components/payments/PurchaseHistory';
import UpdateContent from './pages/UpdateContent';
import UpdateCourseContentForm from './components/content/UpdateCourseContentForm';
import LiveSessions from './pages/LiveSessions';
import CreateSessionForm from './components/sessions/CreateSessionForm';
import ManageSessions from './components/sessions/ManageSessions';
import EditSessionDialog from './components/sessions/EditSessionDialog';
import FreeTestAccess from './pages/FreeTestAccess';
import AvailableFreeTests from './components/free_tests/AvailableFreeTests';
import ManageFreePaidTests from './components/free_tests/ManageFreePaidTests';
import Announcements from './pages/Announcement';
import CreateAnnouncement from './components/announcement/CreateAnnouncement';
import ManageAnnouncement from './components/announcement/ManageAnnouncement';
import SupportAndFeedback from './pages/SupportAndFeedback';
import SupportTickets from './components/support/SupportTickets';
import FeedbackTable from './components/support/FeedbackTable';
import Profile from './pages/Profile';
import { ToastContainer, Slide } from 'react-toastify';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import 'react-toastify/dist/ReactToastify.css';
import './toastify-custom.css';

const ProtectedRoute = ({ children }) => {
  const { user, token, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin" />Loading...
      </div>
    );
  }
  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
        style={{ width: '350px', fontFamily: 'Arial, sans-serif' }}
        className="custom-toast-container"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tests/result/:resultId/review" element={<ProtectedRoute><TestResultReview /></ProtectedRoute>} />
        <Route path="/" element={<Layout />}>
          <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="courses" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>}>
            <Route index element={<Navigate to="create" replace />} />
            <Route path="create" element={<CreateCourseForm />} />
            <Route path="content" element={<CourseContentTab />} />
            <Route path="manage" element={<ManageCoursesTable />} />
          </Route>

          <Route path="tests" element={<ProtectedRoute><TestManagement /></ProtectedRoute>}>
            <Route index element={<Navigate to="create" replace />} />
            <Route path="create" element={<CreateTest />}>
              <Route index element={<Navigate to="details" replace />} />
              <Route path="details" element={<TestDetailsForm />} />
              <Route path="questions" element={<AddQuestions />} />
            </Route>
            <Route path="manage" element={<ManageTests />}>
              <Route path=":testId/edit" element={<EditTestDrawer />} />
            </Route>
            <Route path="analytics" element={<TestAnalytics />} />
          </Route>

          <Route path="students" element={<ProtectedRoute><StudentManagement /></ProtectedRoute>}>
            <Route index element={<Navigate to="registered" replace />} />
            <Route path="registered" element={<RegisteredStudents />}>
              <Route path=":studentId/profile" element={<ProfileDialog />} />
            </Route>
            <Route path="enrollments" element={<EnrolledStudents />} />
          </Route>

          <Route path="sales" element={<ProtectedRoute><SalesAndPayments /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RevenueDashboard />} />
            <Route path="history" element={<PurchaseHistory />} />
          </Route>

          <Route path="content" element={<ProtectedRoute><UpdateContent /></ProtectedRoute>}>
            <Route index element={<Navigate to="/content" replace />} />
            <Route path=":courseId/updatecontent" element={<UpdateCourseContentForm />} />
          </Route>

          <Route path="live" element={<ProtectedRoute><LiveSessions /></ProtectedRoute>}>
            <Route index element={<Navigate to="create" replace />} />
            <Route path="create" element={<CreateSessionForm />} />
            <Route path="manage" element={<ManageSessions />}>
              <Route path=":sessionId/edit" element={<EditSessionDialog />} />
            </Route>
          </Route>

          <Route path="free-tests" element={<ProtectedRoute><FreeTestAccess /></ProtectedRoute>}>
            <Route index element={<Navigate to="available" replace />} />
            <Route path="available" element={<AvailableFreeTests />} />
            <Route path="manage" element={<ManageFreePaidTests />} />
          </Route>

          <Route path="announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>}>
            <Route index element={<Navigate to="creates" replace />} />
            <Route path="creates" element={<CreateAnnouncement />} />
            <Route path="manage" element={<ManageAnnouncement />} />
          </Route>

          <Route path="support" element={<ProtectedRoute><SupportAndFeedback /></ProtectedRoute>}>
            <Route index element={<Navigate to="supporttickets" replace />} />
            <Route path="supporttickets" element={<SupportTickets />} />
            <Route path="feedbacks" element={<FeedbackTable />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;