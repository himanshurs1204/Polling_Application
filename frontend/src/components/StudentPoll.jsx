import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../api/SocketContext";
import PollResultsChart from "./PollResultsChart";

function StudentPoll({ studentName }) {
  const socket = useContext(SocketContext);
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [submittedList, setSubmittedList] = useState([]);
  const [notSubmittedList, setNotSubmittedList] = useState([]);

  // Helper: get submission key for sessionStorage
  const getSubmissionKey = (pollId) => `poll_submitted_${pollId}_${studentName}`;

  // Listen for poll events
  useEffect(() => {
    // Join poll on mount
    socket.emit("joinPoll", { studentName });
    const handleCreatePoll = (pollData) => {
      setPoll(pollData);
      setTimeLeft(pollData.timeLimit || 60);
      setSelected(null);
      setResults(null);
      setSubmittedList([]);
      setNotSubmittedList([]);
      // Check if this student already submitted for this poll
      const submittedFlag = sessionStorage.getItem(getSubmissionKey(pollData._id));
      setSubmitted(!!submittedFlag);
    };
    // Only update results on pollEnded, not pollResults
    const handlePollEnded = ({ results, submitted, notSubmitted }) => {
      setResults(results);
      setSubmitted(true); // All students see results when poll ends
      setSubmittedList(submitted || []);
      setNotSubmittedList(notSubmitted || []);
    };
    socket.on("createPoll", handleCreatePoll);
    socket.on("pollEnded", handlePollEnded);
    // Request current poll on mount
    socket.emit("getCurrentPoll");
    return () => {
      socket.off("createPoll", handleCreatePoll);
      socket.off("pollEnded", handlePollEnded);
    };
    // eslint-disable-next-line
  }, [socket, studentName]);

  // Listen for kicked event
  useEffect(() => {
    const handleKicked = () => {
      alert('You have been removed by the teacher.');
      sessionStorage.removeItem('studentName');
      window.location.reload();
    };
    socket.on('kicked', handleKicked);
    return () => socket.off('kicked', handleKicked);
  }, [socket]);

  // Timer logic
  useEffect(() => {
    if (!poll || submitted || results) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, poll, submitted, results]);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    sessionStorage.setItem(getSubmissionKey(poll._id), "1");
    sessionStorage.setItem(getSubmissionKey(poll._id + '_answer'), selected);
    socket.emit("submitAnswer", {
      pollId: poll._id,
      studentName,
      selectedOption: selected,
    });
  };

  if (!poll) return (
    <div>
      
<div role="status" className="flex justify-center mt-3 mb-3">
    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>

      <div className="text-black-500 sm:text-xl font-extrabold mb-8">Wait for the teacher to ask questions...</div>
    </div>
);
  if (results && poll) {
    const isCorrect = poll.correctOption && poll.correctOption === sessionStorage.getItem(getSubmissionKey(poll._id + '_answer'));
    const studentAnswer = sessionStorage.getItem(getSubmissionKey(poll._id + '_answer'));
    return (
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <h3 className="text-xl font-bold mb-4">Results for: {poll.question}</h3>
        <PollResultsChart options={poll.options} results={results} correctOption={poll.correctOption} />
        {studentAnswer && (
          <div className={`mt-4 font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            Your answer: {studentAnswer} — {isCorrect ? 'Correct!' : 'Wrong'}
          </div>
        )}
        {submittedList.length > 0 && (
          <div className="mt-4 text-green-700">Submitted: {submittedList.join(", ")}</div>
        )}
        {notSubmittedList.length > 0 && (
          <div className="mt-2 text-red-700">Did not submit: {notSubmittedList.join(", ")}</div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <div className="mb-4 font-bold text-blue-700">Student: {studentName}</div>
      <h3 className="text-lg font-semibold mb-4">{poll.question}</h3>
      {!submitted && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {poll.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                disabled={submitted}
                className={`px-4 py-2 rounded border ${selected === opt ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-blue-100"}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Time left:</span> {timeLeft}s
          </div>
          <button
            onClick={handleSubmit}
            disabled={!selected || submitted}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Submit
          </button>
        </>
      )}
      {submitted && !results && (
        <div className="mt-6 text-yellow-700 font-semibold">Waiting for others to submit...</div>
      )}
    </div>
  );
}

export default StudentPoll; 