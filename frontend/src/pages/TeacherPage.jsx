import { useState, useEffect } from 'react';
import NamePrompt from '../components/NamePrompt';
import TeacherDashboard from '../components/TeacherDashboard';

function TeacherPage() {
  const [teacherName, setTeacherName] = useState(null);

  useEffect(() => {
    const name = sessionStorage.getItem('teacherName');
    if (name) setTeacherName(name);
  }, []);

  if (!teacherName) {
    return <NamePrompt onNameSet={setTeacherName} role="teacher" />;
  }

  return (
    <div>
        <h1 className="absolute top-6 right-6 text-xl sm:text-xl font-extrabold text-gray-900 mb-4">
        Welcome {teacherName}
        </h1>
      <TeacherDashboard teacherName={teacherName} />
    </div>
  );
}

export default TeacherPage; 