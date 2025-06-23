// src/RoleSelection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === 'student') navigate('/student');
    if (selectedRole === 'teacher') navigate('/teacher');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-block px-4 py-1 text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
          ✦ Intervue Poll
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
          Welcome to the <span className="font-bold">Live Polling System</span>
        </h1>
        <p className="text-gray-500 mb-8">
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div
            onClick={() => setSelectedRole('student')}
            className={`cursor-pointer rounded-xl p-6 transition-all border-2 ${
              selectedRole === 'student'
                ? 'border-indigo-500 shadow-md'
                : 'border-gray-200 hover:shadow-md'
            }`}
          >
            <h2 className="font-semibold text-lg text-gray-800 mb-1">I’m a Student</h2>
            <p className="text-sm text-gray-500">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </div>

          <div
            onClick={() => setSelectedRole('teacher')}
            className={`cursor-pointer rounded-xl p-6 transition-all border-2 ${
              selectedRole === 'teacher'
                ? 'border-indigo-500 shadow-md'
                : 'border-gray-200 hover:shadow-md'
            }`}
          >
            <h2 className="font-semibold text-lg text-gray-800 mb-1">I’m a Teacher</h2>
            <p className="text-sm text-gray-500">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
            selectedRole
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
