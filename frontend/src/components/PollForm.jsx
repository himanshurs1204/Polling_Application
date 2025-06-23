import { useState } from 'react';

function PollForm({ onCreatePoll, disabled }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
    if (correctOption === options[idx]) setCorrectOption(value);
  };

  const addOption = () => {
    if (options.length < 5) setOptions([...options, '']);
  };

  const removeOption = (idx) => {
    if (options.length > 2) {
      if (options[idx] === correctOption) setCorrectOption('');
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedOptions = options.map(opt => opt.trim()).filter(Boolean);
    if (!question.trim() || trimmedOptions.length < 2 || !correctOption) return;
    onCreatePoll({
      question: question.trim(),
      options: trimmedOptions,
      timeLimit: Number(timeLimit) || 60,
      correctOption,
    });
    setQuestion('');
    setOptions(['', '']);
    setCorrectOption('');
    setTimeLimit(60);
  };

  return (
    <div className='space-y-6 '>
      <div className='flex justify-betweem items-center '>
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-4 w-full min-w-full rounded shadow">
      <div>
        
        <div className='flex justify-between items-center'>
          <label className="font-semibold text-black ">Enter your question</label>
          <div>
            <label className="text-sm px-4 py-2 rounded-md">Time Limit (seconds):</label>
          <input
          type="number"
          min={10}
          max={100}
          value={timeLimit}
          onChange={e => setTimeLimit(e.target.value)}
          className="border rounded px-2 py-1"
          disabled={disabled}
          />
          </div>
      </div>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
          className="w-full h-24 p-4 bg-gray-100 text-black rounded-md resize-none focus:outline-none"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Options:</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-1">
            <input
              type="text"
              value={opt}
              onChange={e => handleOptionChange(idx, e.target.value)}
              required
              className="border rounded px-2 py-1"
              disabled={disabled}
            />
            <input
              type="radio"
              name="correctOption"
              checked={correctOption === opt}
              onChange={() => setCorrectOption(opt)}
              disabled={disabled || !opt.trim()}
              className="ml-2"
              title="Mark as correct"
            />
            <span className="text-xs">Correct</span>
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(idx)}
                disabled={disabled}
                className="text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {options.length < 5 && (
          <button
            type="button"
            onClick={addOption}
            disabled={disabled}
            className="text-blue-500"
          >
            Add Option
          </button>
        )}
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={disabled}
      >
        Create Poll
      </button>
    </form>
      </div>
    </div>
  );
}

export default PollForm; 
// export default PollForm; 