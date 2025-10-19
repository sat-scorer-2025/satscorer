import React, { useState, useEffect } from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useStudentContext } from "../context/StudentContext";

const ViewCourse = () => {
  const { enrolledcourseId } = useParams();
  const { fetchCourseById, error } = useStudentContext();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const courseData = await fetchCourseById(enrolledcourseId);
      setCourse(courseData);
      setLoading(false);
    };

    if (enrolledcourseId && !course) {
      loadCourse();
    }
  }, [enrolledcourseId, fetchCourseById, course]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading course...</div>;
  }

  if (error || !course) {
    return (
      <div className="text-center text-red-500">
        {error || "Course not found"}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/studentdashboard/mycourses")}
        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition duration-200 mb-4"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to My Courses
      </button>
      <hr className="border-b-2 border-gray-300"/>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ViewCourse;