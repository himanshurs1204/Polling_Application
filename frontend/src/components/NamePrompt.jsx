import { useState } from 'react';

function NamePrompt({ onNameSet, role }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const key = role === 'teacher' ? 'teacherName' : 'studentName';
      sessionStorage.setItem(key, name.trim());
      onNameSet(name.trim());
    }
  };

  return (
   <div className='flex items-center justify-center min-h-screen border-amber-600'>
    <div className="max-w-xl w-full text-center border-red-600">
      <div className="inline-block px-4 py-1 text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
          ✦ Intervue Poll
        </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Let’s <span className="text-black font-bold">Get Started</span>
        </h1>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          If you’re a student, you’ll be able to <span className="font-semibold text-gray-700">submit your answers</span>, participate in live polls, and see how your responses compare with your classmates
        </p>

      <div className="text-left mb-6">
         <form onSubmit={handleSubmit} style={{ margin: '2rem' }}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Enter your {role} name:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className='w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400'
        />
      </label>
      <div className='mt-4 flex justify-center'>
        <button type="submit" 
      className={`flex items-center justify-center px-10 py-2 rounded-full font-semibold text-sm transition-all 
            ${name.trim()
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
      >Join</button>
      </div>
    </form>
      </div>
    </div>
   </div>
  );
}

export default NamePrompt; 