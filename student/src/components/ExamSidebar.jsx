import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ExamSidebar = () => {
  const exams = ['sat', 'gre', 'gmat', 'ielts', 'act', 'ap'];
  const location = useLocation();

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-950 to-purple-950 text-white hidden lg:block font-sans shadow-lg overflow-y-auto transition-all duration-300 ease-in-out">
      <nav className="p-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-8 tracking-wider uppercase border-b border-purple-700 pb-4">Exams</h2>
        <ul className="space-y-4">
          {exams.map((exam) => (
            <li key={exam}>
              <Link
                to={`/exams/${exam}`}
                className={`block px-5 py-3 rounded-md text-lg font-semibold uppercase transition-all duration-300 transform ${
                  location.pathname === `/exams/${exam}`
                    ? 'bg-purple-600 text-white shadow-md scale-105'
                    : 'text-gray-200 hover:bg-purple-700 hover:text-white hover:scale-105 hover:shadow-md'
                }`}
              >
                {exam}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default ExamSidebar;