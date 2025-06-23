import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../api/SocketContext";
import PollForm from "./PollForm";
import PollResultsChart from "./PollResultsChart";
import { getPastPolls, getPollById } from "../api/api";

function TeacherDashboard({ teacherName }) {
  const socket = useContext(SocketContext);
  const [activePoll, setActivePoll] = useState(null);
  const [results, setResults] = useState(null);
  const [creating, setCreating] = useState(false);
  const [pastPolls, setPastPolls] = useState([]);
  const [tab, setTab] = useState('current');
  const [selectedPastPoll, setSelectedPastPoll] = useState(null);
  const [pastPollDetails, setPastPollDetails] = useState(null);
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    socket.on("createPoll", (poll) => {
      setActivePoll(poll);
      setResults({});
      setCreating(false);
    });
    socket.on("pollResults", (res) => setResults(res));
    socket.on("pollEnded", ({ results }) => {
      setActivePoll(null);
      setResults(null);
      fetchPastPolls();
    });
    socket.on("studentList", setStudentList);
    socket.on("sessionClosed", () => {
      setActivePoll(null);
      setResults(null);
      setPastPolls([]);
      setStudentList([]);
    });
    socket.emit("getCurrentPoll");
    fetchPastPolls();
    return () => {
      socket.off("createPoll");
      socket.off("pollResults");
      socket.off("pollEnded");
      socket.off("studentList", setStudentList);
      socket.off("sessionClosed");
    };
    // eslint-disable-next-line
  }, [socket]);

  const fetchPastPolls = async () => {
    try {
      const polls = await getPastPolls();
      setPastPolls(polls);
    } catch (e) {
      setPastPolls([]);
    }
  };

  const handleCreatePoll = (pollData) => {
    setCreating(true);
    socket.emit("createPoll", { ...pollData, teacherName });
  };

  const handleCloseSession = () => {
    socket.emit('closeSession');
  };

  const handleSelectPastPoll = async (pollId) => {
    setSelectedPastPoll(pollId);
    const poll = await getPollById(pollId);
    setPastPollDetails(poll);
  };

  const handleKick = (studentName) => {
    socket.emit('kickStudent', studentName);
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col max-w-4xl mx-auto">
        {/* Top Left Badge */}
      <h3 className="absolute top-4 left-4 text-sm px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-full">
        ✦ Intervue Poll
      </h3>
      {/* Header Section */}
      <div className="text-center mt-20 mb-10">
        <h1 className="text-4xl font-black">Let’s <span className="font-bold">Get Started</span></h1>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>
      </div>

      <div className="flex space-x-4 mb-4">
        <button onClick={() => setTab('current')} className={tab === 'current' ? 'font-bold underline' : ''}>Current Poll</button>
        <button onClick={() => setTab('past')} className={tab === 'past' ? 'font-bold underline' : ''}>Past Polls</button>
      </div>
      {tab === 'current' ? (
        <>
          <div className="mb-4">
            <h4 className="font-bold">Students Joined:</h4>
            <ul>
              {studentList.map(name => (
                <li key={name} className="flex items-center space-x-2">
                  <span>{name}</span>
                  <button
                    onClick={() => handleKick(name)}
                    className="text-red-600 hover:underline"
                  >
                    Kick
                  </button>
                </li>
              ))}
              {studentList.length === 0 && <li className="text-gray-500">No students joined yet.</li>}
            </ul>
          </div>
          {!activePoll && <PollForm onCreatePoll={handleCreatePoll} disabled={!!activePoll || creating} />}
          {activePoll ? (
            <div style={{ margin: "2rem 0" }}>
              <h3>Current Poll: {activePoll.question}</h3>
              <PollResultsChart options={activePoll.options} results={results || {}} correctOption={activePoll.correctOption} />
            </div>
          ) : (
            <div style={{ margin: "2rem 0" }}>No active poll.</div>
          )}
          <button
            onClick={handleCloseSession}
            className="bg-red-600 text-white px-4 py-2 rounded mt-4"
          >
            Close Session
          </button>
        </>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-md">
  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Past Polls</h3>
  <div className="space-y-3">
    {pastPolls.map((poll) => (
      <button
        key={poll._id}
        onClick={() => handleSelectPastPoll(poll._id)}
        className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition duration-200"
      >
        {poll.question}
      </button>
    ))}
  </div>

  {pastPollDetails && (
    <div className="mt-6 p-4 bg-gray-50 border rounded-lg shadow-sm">
      <h4 className="text-lg font-bold mb-3 text-gray-700">
        {pastPollDetails.question}
      </h4>
      <PollResultsChart
        options={pastPollDetails.options}
        results={pastPollDetails.results || {}}
        correctOption={pastPollDetails.correctOption}
      />
    </div>
  )}
</div>

      )}
    </div>

  );
}

export default TeacherDashboard; 