// import React from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import Home from './pages/Home';
// import SignUp from './pages/Signup';
// import Login from './pages/Login';
// import ContactUs from './pages/ContactUs';
// import AboutUs from './pages/AboutUs';
// import Courses from './pages/Courses';
// import ExamsLayout from './ExamsLayout';
// import ExamPage from './pages/ExamPage';
// import CourseDetails from './pages/CourseDetails';
// import FreeTest from './pages/FreeTest';
// import FreeTestResult from './pages/FreeTestResult';
// import StudentDashboard from './pages/StudentDashboard';
// import MyCourses from './components/StudentDashboard/MyCourses';
// import Support from './components/StudentDashboard/Support';
// import Settings from './components/StudentDashboard/Settings';
// import Header from './components/Header';
// import ViewCourse from './pages/ViewCourse';
// import LecturesContent from './components/StudentDashboard/ViewCourse/LecturesContent';
// import NotesContent from './components/StudentDashboard/ViewCourse/NotesContent';
// import ClassesContent from './components/StudentDashboard/ViewCourse/ClassesContent';
// import TestsContent from './components/StudentDashboard/ViewCourse/TestsContent';
// import TakeTest from './pages/TakeTest';
// import TestReview from './pages/TestReview';
// import MyProfile from './pages/MyProfile';

// const App = () => {
//   const location = useLocation();
//   const hideHeader = location.pathname.startsWith('/taketest/') || location.pathname.startsWith('/testreview/') || location.pathname.startsWith('/free-test/') || location.pathname.startsWith('/free-test-result/');

//   return (
//     <>
//       {!hideHeader && <Header />}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/contactus" element={<ContactUs />} />
//         <Route path="/aboutus" element={<AboutUs />} />
//         <Route path="/courses" element={<Courses />} />
//         <Route path="/coursedetails/:id" element={<CourseDetails />} />
//         <Route path="/free-test/:examType" element={<FreeTest />} />
//         <Route path="/free-test-result/:examType" element={<FreeTestResult />} />
//         <Route path="/myprofile" element={<MyProfile />} />
//         <Route path="/taketest/:enrolledcourseId/:testId" element={<TakeTest />} />
//         <Route path="/testreview/:enrolledcourseId/:testId" element={<TestReview />} />
//         <Route path="/exams" element={<ExamsLayout />}>
//           <Route path=":examType" element={<ExamPage />} />
//         </Route>
//         <Route path="/studentdashboard" element={<StudentDashboard />}>
//           <Route index element={<Navigate to="mycourses" replace />} />
//           <Route path="mycourses" element={<MyCourses />} />
//           <Route path="mycourses/viewcourse/:enrolledcourseId" element={<ViewCourse />}>
//             <Route index element={<Navigate to="lectures" replace />} />
//             <Route path="lectures" element={<LecturesContent />} />
//             <Route path="notes" element={<NotesContent />} />
//             <Route path="classes" element={<ClassesContent />} />
//             <Route path="tests" element={<TestsContent />} />
//           </Route>
//           <Route path="support" element={<Support />} />
//           <Route path="settings" element={<Settings />} />
//         </Route>
//       </Routes>
//     </>
//   );
// };

// export default App;


import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Courses from './pages/Courses';
import ExamsLayout from './ExamsLayout';
import ExamPage from './pages/ExamPage';
import CourseDetails from './pages/CourseDetails';
import FreeTest from './pages/FreeTest';
import FreeTestResult from './pages/FreeTestResult';
import StudentDashboard from './pages/StudentDashboard';
import MyCourses from './components/StudentDashboard/MyCourses';
import Support from './components/StudentDashboard/Support';
import Settings from './components/StudentDashboard/Settings';
import Header from './components/Header';
import ViewCourse from './pages/ViewCourse';
import LecturesContent from './components/StudentDashboard/ViewCourse/LecturesContent';
import NotesContent from './components/StudentDashboard/ViewCourse/NotesContent';
import ClassesContent from './components/StudentDashboard/ViewCourse/ClassesContent';
import TestsContent from './components/StudentDashboard/ViewCourse/TestsContent';
import TakeTest from './pages/TakeTest';
import TestReview from './pages/TestReview';
import MyProfile from './pages/MyProfile';
import MyPayments from './pages/MyPayments'; // Import MyPayments

const App = () => {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith('/taketest/') || location.pathname.startsWith('/testreview/') || location.pathname.startsWith('/free-test/') || location.pathname.startsWith('/free-test-result/');

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/coursedetails/:id" element={<CourseDetails />} />
        <Route path="/free-test/:examType" element={<FreeTest />} />
        <Route path="/free-test-result/:examType" element={<FreeTestResult />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/payments" element={<MyPayments />} />
        <Route path="/taketest/:enrolledcourseId/:testId" element={<TakeTest />} />
        <Route path="/testreview/:enrolledcourseId/:testId" element={<TestReview />} />
        <Route path="/exams" element={<ExamsLayout />}>
          <Route path=":examType" element={<ExamPage />} />
        </Route>
        <Route path="/studentdashboard" element={<StudentDashboard />}>
          <Route index element={<Navigate to="mycourses" replace />} />
          <Route path="mycourses" element={<MyCourses />} />
          <Route path="mycourses/viewcourse/:enrolledcourseId" element={<ViewCourse />}>
            <Route index element={<Navigate to="lectures" replace />} />
            <Route path="lectures" element={<LecturesContent />} />
            <Route path="notes" element={<NotesContent />} />
            <Route path="classes" element={<ClassesContent />} />
            <Route path="tests" element={<TestsContent />} />
          </Route>
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;