// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { BellIcon, Bars3Icon, XMarkIcon, AcademicCapIcon, LifebuoyIcon, Cog6ToothIcon, VideoCameraIcon, DocumentTextIcon, BookOpenIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
// import { AuthContext } from '../context/AuthContext';
// import NotificationDialog from './NotificationDialog';
// import { Helmet } from 'react-helmet';
// import logo from '../assets/logo.png';

// const Header = ({ onMenuClick }) => {
//   const { user, logout, loading, refreshUserData, notifications } = useContext(AuthContext);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isExamsOpen, setIsExamsOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [userDetails, setUserDetails] = useState(user || {});
//   const [isHeaderVisible, setIsHeaderVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   const examsDropdownRef = useRef(null);
//   const profileDropdownRef = useRef(null);
//   const notificationRef = useRef(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const isHomePage = location.pathname === '/';
//   const isStudentDashboard = location.pathname.startsWith('/studentdashboard');
//   const isViewCourse = location.pathname.startsWith('/studentdashboard/mycourses/viewcourse');
//   const isExamsPage = location.pathname.startsWith('/exams');
//   const isFullWidthHeader = isStudentDashboard || isExamsPage;

//   // Extract enrolledcourseId from pathname
//   const enrolledcourseId = isViewCourse
//     ? location.pathname.split('/studentdashboard/mycourses/viewcourse/')[1]?.split('/')[0]
//     : null;

//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

//   const fetchUserProfile = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/user/profile`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       const profileData = await response.json();
//       if (!response.ok) throw new Error(profileData.message || 'Failed to fetch profile');
//       setUserDetails(profileData.user);
//       await refreshUserData();
//     } catch (err) {
//       console.error('Error fetching user profile:', err.message);
//     }
//   };

//   useEffect(() => {
//     if (!loading && user && (!user.name || !user.profilePhoto)) fetchUserProfile();
//     else if (user) setUserDetails(user);
//   }, [user, loading, refreshUserData]);

//   useEffect(() => {
//     if (!isHomePage) {
//       setIsHeaderVisible(true);
//       return;
//     }

//     let ticking = false;
//     const handleScroll = () => {
//       if (!ticking) {
//         window.requestAnimationFrame(() => {
//           const currentScrollY = window.scrollY;
//           if (currentScrollY > lastScrollY && currentScrollY > 100) setIsHeaderVisible(false);
//           else if (currentScrollY < lastScrollY && currentScrollY > 0) setIsHeaderVisible(true);
//           setLastScrollY(currentScrollY);
//           ticking = false;
//         });
//         ticking = true;
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [lastScrollY, isHomePage]);

//   const studentName = userDetails?.name || 'User';

//   const toggleMenu = () => {
//     setIsMenuOpen((prev) => !prev);
//     setIsExamsOpen(false);
//     setIsProfileOpen(false);
//     setIsNotificationOpen(false);
//   };

//   const toggleExamsDropdown = (e) => {
//     e.preventDefault();
//     setIsExamsOpen((prev) => !prev);
//     setIsProfileOpen(false);
//     setIsNotificationOpen(false);
//   };

//   const toggleProfileDropdown = (e) => {
//     e.preventDefault();
//     setIsProfileOpen((prev) => !prev);
//     setIsExamsOpen(false);
//     setIsNotificationOpen(false);
//   };

//   const toggleNotificationDialog = (e) => {
//     e.preventDefault();
//     setIsNotificationOpen((prev) => !prev);
//     setIsExamsOpen(false);
//     setIsProfileOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (examsDropdownRef.current && !examsDropdownRef.current.contains(event.target)) setIsExamsOpen(false);
//       if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) setIsProfileOpen(false);
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) setIsNotificationOpen(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const exams = ['sat', 'gre', 'gmat', 'ielts', 'act', 'ap'];

//   const dashboardNavItems = [
//     { name: "My Courses", path: "/studentdashboard/mycourses", icon: AcademicCapIcon },
//     { name: "Support", path: "/studentdashboard/support", icon: LifebuoyIcon },
//     { name: "Settings", path: "/studentdashboard/settings", icon: Cog6ToothIcon },
//   ];

//   const courseNavItems = [
//     {
//       name: "Videos/Lectures",
//       path: enrolledcourseId ? `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/lectures` : '#',
//       icon: VideoCameraIcon,
//     },
//     {
//       name: "Notes",
//       path: enrolledcourseId ? `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/notes` : '#',
//       icon: DocumentTextIcon,
//     },
//     {
//       name: "Live Sessions/Class",
//       path: enrolledcourseId ? `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/classes` : '#',
//       icon: BookOpenIcon,
//     },
//     {
//       name: "Tests",
//       path: enrolledcourseId ? `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/tests` : '#',
//       icon: ChatBubbleBottomCenterTextIcon,
//     },
//   ];

//   const handleLogout = () => {
//     logout();
//     setIsProfileOpen(false);
//     setIsMenuOpen(false);
//     setIsNotificationOpen(false);
//     navigate('/');
//   };

//   if (loading) {
//     return (
//       <header className="bg-gradient-to-r from-purple-200 to-purple-900 text-white top-0 left-0 right-0 z-50 h-14 sm:h-16 font-sans">
//         <div className="flex items-center justify-between px-4 h-full">
//           <div className="text-xl sm:text-2xl font-bold animate-pulse">Loading...</div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <>
//       <Helmet>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
//           rel="stylesheet"
//         />
//       </Helmet>

//       <header
//         className={`pt-1 pb-1 bg-gradient-to-r from-30% from-indigo-200 via-purple-400 to-purple-500 text-white top-0 left-0 right-0 z-50 font-sans shadow-md sticky transition-transform duration-300 ${
//           isHomePage && !isHeaderVisible ? '-translate-y-full' : 'translate-y-0'
//         }`}
//       >
//         <div
//           className={`flex items-center justify-between px-2 sm:px-4 lg:px-8 h-14 sm:h-16 md:h-18 ${
//             isFullWidthHeader ? 'w-full' : 'mx-auto max-w-7xl'
//           }`}
//         >
//           {/* Left: Logo + Text */}
//           <div className="flex items-center space-x-1 sm:space-x-2">
//             {/* Mobile menu toggle */}
//             <button
//               className="md:hidden p-2 rounded-lg hover:bg-purple-100 text-purple-700 transition-all duration-200"
//               onClick={toggleMenu}
//               aria-label="Toggle Menu"
//             >
//               {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
//             </button>

//             <Link to="/" className="flex items-center">
//               <img
//                 src={logo}
//                 alt="SATScorer Logo"
//                 className="h-10 sm:h-12 md:h-14 md:w-50 sm:w-40 lg:w-60 hover:scale-105 transition-transform duration-200"
//               />
//             </Link>
//           </div>

//           {/* Right: Nav / Notifications / Profile */}
//           <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
//             {/* Navigation */}
//             <nav
//               className={`${
//                 isMenuOpen
//                   ? 'flex flex-col absolute top-14 sm:top-16 left-0 right-0 bg-purple-400 backdrop-blur-md shadow-xl border-b border-purple-200 rounded-b-xl transition-all duration-300 ease-in-out p-3 sm:p-4 md:hidden'
//                   : 'hidden md:flex md:items-center md:space-x-1 lg:space-x-2 xl:space-x-3'
//               }`}
//             >
//               {isViewCourse ? (
//                 // Mobile menu for view course routes
//                 courseNavItems.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.path}
//                     className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                       item.path === '#' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-100 hover:text-purple-700'
//                     }`}
//                     onClick={() => item.path !== '#' && setIsMenuOpen(false)}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     {item.name}
//                   </Link>
//                 ))
//               ) : isStudentDashboard ? (
//                 // Mobile menu for student dashboard
//                 dashboardNavItems.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.path}
//                     className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 text-sm font-medium transition-all duration-200"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     {item.name}
//                   </Link>
//                 ))
//               ) : (
//                 <>
//                   {/* Exams Dropdown */}
//                   <div ref={examsDropdownRef} className="relative inline-block">
//                     <button
//                       className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 text-sm md:text-base font-medium transition-all duration-200"
//                       onClick={toggleExamsDropdown}
//                     >
//                       Exams
//                       <span
//                         className={`ml-2 transform transition-transform duration-200 ${
//                           isExamsOpen ? 'rotate-180' : 'rotate-0'
//                         }`}
//                       >
//                         ▼
//                       </span>
//                     </button>

//                     {/* Mobile view */}
//                     {isExamsOpen && isMenuOpen && (
//                       <div className="flex flex-col bg-purple-300 rounded-lg mt-1 transition-all duration-200 overflow-hidden">
//                         {exams.map((exam) => (
//                           <Link
//                             key={exam}
//                             to={`/exams/${exam}`}
//                             className="px-4 py-2 text-sm font-medium text-gray-800 hover:bg-purple-200 hover:text-purple-700 border-b border-purple-200 last:border-none uppercase tracking-wide"
//                             onClick={() => {
//                               setIsExamsOpen(false);
//                               setIsMenuOpen(false);
//                             }}
//                           >
//                             {exam.toUpperCase()}
//                           </Link>
//                         ))}
//                       </div>
//                     )}

//                     {/* Desktop view */}
//                     {!isMenuOpen && isExamsOpen && (
//                       <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-xl border border-purple-100 overflow-hidden z-50">
//                         {exams.map((exam) => (
//                           <Link
//                             key={exam}
//                             to={`/exams/${exam}`}
//                             className="block px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-sm font-medium text-gray-700 hover:text-purple-700 transition-all duration-200 hover:translate-x-1 border-b border-purple-50 last:border-b-0 uppercase tracking-wide"
//                             onClick={() => setIsExamsOpen(false)}
//                           >
//                             {exam.toUpperCase()}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <Link
//                     to="/aboutus"
//                     className="px-2 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 text-sm md:text-base font-medium transition-all duration-200"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     About Us
//                   </Link>
//                   <Link
//                     to="/contactus"
//                     className="px-2 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 text-sm md:text-base font-medium transition-all duration-200"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Contact Us
//                   </Link>
//                 </>
//               )}
//             </nav>

//             {/* Notification + Profile */}
//             {user ? (
//               <>
//                 <div className="relative hidden md:block" ref={notificationRef}>
//                   <button
//                     onClick={toggleNotificationDialog}
//                     className="relative p-2 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
//                   >
//                     <BellIcon className="w-4 sm:w-5 h-4 sm:h-5" />
//                     {notifications.length > 0 && (
//                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
//                     )}
//                   </button>
//                   <NotificationDialog isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
//                 </div>

//                 <span className="hidden sm:inline text-xs sm:text-sm md:text-base font-semibold text-gray-100 transition-opacity duration-300 hover:opacity-80">
//                   Hi, {studentName}
//                 </span>

//                 <div className="relative" ref={profileDropdownRef}>
//                   <button
//                     onClick={toggleProfileDropdown}
//                     className="flex items-center p-1.5 rounded-full hover:bg-purple-100 hover:scale-105 transition-all duration-200"
//                   >
//                     {userDetails.profilePhoto ? (
//                       <img
//                         src={userDetails.profilePhoto}
//                         alt="Profile"
//                         className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full border-2 border-purple-200"
//                         onError={(e) => {
//                           e.target.src = `https://ui-avatars.com/api/?name=${studentName}&background=purple-200&color=indigo-900`;
//                         }}
//                       />
//                     ) : (
//                       <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full bg-purple-200 flex items-center justify-center text-indigo-900 font-semibold text-xs sm:text-sm md:text-base">
//                         {studentName[0]?.toUpperCase() || 'U'}
//                       </div>
//                     )}
//                   </button>
//                   {isProfileOpen && (
//                     <div className="absolute right-0 mt-2 w-32 sm:w-36 md:w-40 lg:w-48 bg-white text-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
//                       <Link
//                         to="/myprofile"
//                         className="block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:translate-x-1"
//                         onClick={() => setIsProfileOpen(false)}
//                       >
//                         My Profile
//                       </Link>
//                       <Link
//                         to="/studentdashboard"
//                         className="block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:translate-x-1"
//                         onClick={() => setIsProfileOpen(false)}
//                       >
//                         Student Dashboard
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:translate-x-1"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <Link
//                 to="/login"
//                 className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm md:text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;



import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BellIcon, Bars3Icon, XMarkIcon, AcademicCapIcon, LifebuoyIcon, Cog6ToothIcon, VideoCameraIcon, DocumentTextIcon, BookOpenIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';
import NotificationDialog from './NotificationDialog';
import { Helmet } from 'react-helmet';
import logo from '../assets/logo.png';

const Header = ({ onMenuClick }) => {
  const { user, logout, loading, refreshUserData, notifications } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExamsOpen, setIsExamsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(user || {});
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const examsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isStudentDashboard = location.pathname.startsWith('/studentdashboard');
  const isViewCourse = location.pathname.startsWith('/studentdashboard/mycourses/viewcourse');
  const isExamsPage = location.pathname.startsWith('/exams');
  const isFullWidthHeader = isStudentDashboard || isExamsPage;

  // Extract enrolledcourseId from pathname
  const enrolledcourseId = isViewCourse
    ? location.pathname.split('/studentdashboard/mycourses/viewcourse/')[1]?.split('/')[0]
    : null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const profileData = await response.json();
      if (!response.ok) throw new Error(profileData.message || 'Failed to fetch profile');
      setUserDetails(profileData.user);
      await refreshUserData();
    } catch (err) {
      console.error('Error fetching user profile:', err.message);
    }
  };

  useEffect(() => {
    if (!loading && user && (!user.name || !user.profilePhoto)) fetchUserProfile();
    else if (user) setUserDetails(user);
  }, [user, loading, refreshUserData]);

  useEffect(() => {
    if (!isHomePage) {
      setIsHeaderVisible(true);
      return;
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 100) setIsHeaderVisible(false);
          else if (currentScrollY < lastScrollY && currentScrollY > 0) setIsHeaderVisible(true);
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isHomePage]);

  const studentName = userDetails?.name || 'User';

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsExamsOpen(false);
    setIsProfileOpen(false);
    setIsNotificationOpen(false);
  };

  const toggleExamsDropdown = (e) => {
    e.preventDefault();
    setIsExamsOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsNotificationOpen(false);
  };

  const toggleProfileDropdown = (e) => {
    e.preventDefault();
    setIsProfileOpen((prev) => !prev);
    setIsExamsOpen(false);
    setIsNotificationOpen(false);
  };

  const toggleNotificationDialog = (e) => {
    e.preventDefault();
    setIsNotificationOpen((prev) => !prev);
    setIsExamsOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (examsDropdownRef.current && !examsDropdownRef.current.contains(event.target)) setIsExamsOpen(false);
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setIsNotificationOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exams = ['sat', 'gre', 'gmat', 'ielts', 'act', 'ap'];

  const dashboardNavItems = [
    { name: "My Courses", path: "/studentdashboard/mycourses", icon: AcademicCapIcon },
    { name: "Support", path: "/studentdashboard/support", icon: LifebuoyIcon },
    { name: "Settings", path: "/studentdashboard/settings", icon: Cog6ToothIcon },
  ];

  const courseNavItems = [
    {
      name: "Videos/Lectures",
      path: enrolledcourseId ? `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/lectures` : '#',
      icon: VideoCameraIcon,
    },
    {
      name: "Notes",
      path: enrolledcourseId ? `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/notes` : '#',
      icon: DocumentTextIcon,
    },
    {
      name: "Live Sessions/Class",
      path: enrolledcourseId ? `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/classes` : '#',
      icon: BookOpenIcon,
    },
    {
      name: "Tests",
      path: enrolledcourseId ? `/studentdashboard/mycourses/viewcourse/${enrolledcourseId}/tests` : '#',
      icon: ChatBubbleBottomCenterTextIcon,
    },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    setIsNotificationOpen(false);
    navigate('/');
  };

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-purple-200 to-purple-900 text-white top-0 left-0 right-0 z-50 h-14 sm:h-16 font-sans">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="text-xl sm:text-2xl font-bold animate-pulse">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <header
        className={`pt-1 pb-1 bg-gradient-to-r from-30% from-indigo-200 via-purple-400 to-purple-500 text-white top-0 left-0 right-0 z-50 font-sans shadow-md sticky transition-transform duration-300 ${
          isHomePage && !isHeaderVisible ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div
          className={`flex items-center justify-between px-2 sm:px-4 lg:px-8 h-14 sm:h-16 md:h-18 ${
            isFullWidthHeader ? 'w-full' : 'mx-auto max-w-7xl'
          }`}
        >
          {/* Left: Logo + Text */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-purple-100 text-purple-700 transition-all duration-200"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="SATScorer Logo"
                className="h-10 sm:h-12 md:h-14 md:w-50 sm:w-40 lg:w-60 hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Right: Nav / Notifications / Profile */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            {/* Navigation */}
            <nav
              className={`${
                isMenuOpen
                  ? 'flex flex-col absolute top-14 sm:top-16 left-0 right-0 bg-purple-400 backdrop-blur-md shadow-xl border-b border-purple-200 rounded-b-xl transition-all duration-300 ease-in-out p-3 sm:p-4 md:hidden'
                  : 'hidden md:flex md:items-center md:space-x-1 lg:space-x-2 xl:space-x-3'
              }`}
            >
              {isViewCourse ? (
                // Mobile menu for view course routes
                courseNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.path === '#' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-100 hover:text-purple-700'
                    }`}
                    onClick={() => item.path !== '#' && setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))
              ) : isStudentDashboard ? (
                // Mobile menu for student dashboard
                dashboardNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 text-sm font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))
              ) : (
                <>
                  {/* Exams Dropdown */}
                  <div ref={examsDropdownRef} className="relative inline-block">
                    <button
                      className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 text-sm md:text-base font-medium transition-all duration-200"
                      onClick={toggleExamsDropdown}
                    >
                      Exams
                      <span
                        className={`ml-2 transform transition-transform duration-200 ${
                          isExamsOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {/* Mobile view */}
                    {isExamsOpen && isMenuOpen && (
                      <div className="flex flex-col bg-purple-300 rounded-lg mt-1 transition-all duration-200 overflow-hidden">
                        {exams.map((exam) => (
                          <Link
                            key={exam}
                            to={`/exams/${exam}`}
                            className="px-4 py-2 text-sm font-medium text-gray-800 hover:bg-purple-200 hover:text-purple-700 border-b border-purple-200 last:border-none uppercase tracking-wide"
                            onClick={() => {
                              setIsExamsOpen(false);
                              setIsMenuOpen(false);
                            }}
                          >
                            {exam.toUpperCase()}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Desktop view */}
                    {!isMenuOpen && isExamsOpen && (
                      <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-xl border border-purple-100 overflow-hidden z-50">
                        {exams.map((exam) => (
                          <Link
                            key={exam}
                            to={`/exams/${exam}`}
                            className="block px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-sm font-medium text-gray-700 hover:text-purple-700 transition-all duration-200 hover:translate-x-1 border-b border-purple-50 last:border-b-0 uppercase tracking-wide"
                            onClick={() => setIsExamsOpen(false)}
                          >
                            {exam.toUpperCase()}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/aboutus"
                    className="px-2 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 text-sm md:text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contactus"
                    className="px-2 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 text-sm md:text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </>
              )}
            </nav>

            {/* Notification + Profile */}
            {user ? (
              <>
                <div className="relative hidden md:block" ref={notificationRef}>
                  <button
                    onClick={toggleNotificationDialog}
                    className="relative p-2 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
                  >
                    <BellIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </button>
                  <NotificationDialog isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                </div>

                <span className="hidden sm:inline text-xs sm:text-sm md:text-base font-semibold text-gray-100 transition-opacity duration-300 hover:opacity-80">
                  Hi, {studentName}
                </span>

                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center p-1.5 rounded-full hover:bg-purple-100 hover:scale-105 transition-all duration-200"
                  >
                    {userDetails.profilePhoto ? (
                      <img
                        src={userDetails.profilePhoto}
                        alt="Profile"
                        className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full border-2 border-purple-200"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${studentName}&background=purple-200&color=indigo-900`;
                        }}
                      />
                    ) : (
                      <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full bg-purple-200 flex items-center justify-center text-indigo-900 font-semibold text-xs sm:text-sm md:text-base">
                        {studentName[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-32 sm:w-36 md:w-40 lg:w-48 bg-white text-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
                      <Link
                        to="/myprofile"
                        className="block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:translate-x-1"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/studentdashboard"
                        className="block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:translate-x-1"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Student Dashboard
                      </Link>
                      <Link
                        to="/payments"
                        className="block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:translate-x-1"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Payment History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:translate-x-1"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm md:text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;