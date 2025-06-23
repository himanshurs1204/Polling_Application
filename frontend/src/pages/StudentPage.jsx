import { useState, useEffect } from 'react';
import NamePrompt from '../components/NamePrompt';
import StudentPoll from '../components/StudentPoll';

function StudentPage() {
  const [studentName, setStudentName] = useState(null);

  useEffect(() => {
    const name = sessionStorage.getItem('studentName');
    if (name) setStudentName(name);
  }, []);

  if (!studentName) {
    return <NamePrompt onNameSet={setStudentName} role="student" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      
      {/* Welcome Text */}
      <h1 className="absolute top-6 left-6 text-xl sm:text-xl font-extrabold text-gray-900 mb-4">
        Welcome {studentName}
      </h1>
    {/* Content wrapper */}
    <div className="flex flex-col items-center text-center max-w-2xl w-full p-6">
      
      {/* Badge */}
      <div className="inline-block px-4 py-1 text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
        ✦ Intervue Poll
      </div>

      

      {/* Poll Component */}
      <div className="w-full">
        <StudentPoll studentName={studentName} />
      </div>
      
    </div>
  </div>
  );
}

export default StudentPage; 