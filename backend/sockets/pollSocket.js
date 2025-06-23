import Poll from '../models/Poll.js';
import Response from '../models/Response.js';

let activePoll = null;
let responses = [];
let pollTimer = null;
let activeStudents = [];
let studentSockets = {}; // studentName -> socketId

export default function pollSocket(io) {
  io.on('connection', (socket) => {
    // Send current poll if active
    if (activePoll) {
      socket.emit('createPoll', activePoll);
      socket.emit('pollResults', getResults());
    }

    socket.on('createPoll', async (pollData) => {
      const poll = new Poll({ ...pollData, isActive: true, teacherName: pollData.teacherName });
      await poll.save();
      activePoll = poll;
      responses = [];
      activeStudents = [];
      studentSockets = {};
      io.emit('createPoll', poll);
      startPollTimer(io, poll);
    });

    socket.on('joinPoll', ({ studentName }) => {
      if (!activePoll) return;
      if (!activeStudents.includes(studentName)) {
        activeStudents.push(studentName);
      }
      studentSockets[studentName] = socket.id;
      io.emit('studentList', activeStudents);
    });

    socket.on('disconnect', () => {
      const name = Object.keys(studentSockets).find(key => studentSockets[key] === socket.id);
      if (name) {
        activeStudents = activeStudents.filter(n => n !== name);
        delete studentSockets[name];
        io.emit('studentList', activeStudents);
      }
    });

    socket.on('kickStudent', (studentName) => {
      const sid = studentSockets[studentName];
      if (sid) {
        io.to(sid).emit('kicked');
        io.sockets.sockets.get(sid)?.disconnect(true);
        activeStudents = activeStudents.filter(n => n !== studentName);
        delete studentSockets[studentName];
        io.emit('studentList', activeStudents);
      }
    });

    socket.on('submitAnswer', async ({ pollId, studentName, selectedOption }) => {
      if (!activePoll || activePoll._id.toString() !== pollId) return;
      if (responses.find(r => r.studentName === studentName)) return;
      const response = new Response({ pollId, studentName, selectedOption });
      await response.save();
      responses.push({ studentName, selectedOption });
      io.emit('pollResults', getResults());
      if (activeStudents.length > 0 && responses.length === activeStudents.length) {
        endPoll(io);
      }
    });

    socket.on('getCurrentPoll', () => {
      if (activePoll) {
        socket.emit('createPoll', activePoll);
        socket.emit('pollResults', getResults());
      }
    });

    socket.on('closeSession', async () => {
      await Poll.deleteMany({});
      await Response.deleteMany({});
      activePoll = null;
      responses = [];
      activeStudents = [];
      studentSockets = {};
      if (pollTimer) clearTimeout(pollTimer);
      io.emit('sessionClosed');
    });
  });
}

function getResults() {
  if (!activePoll) return {};
  const counts = {};
  for (const opt of activePoll.options) counts[opt] = 0;
  for (const r of responses) counts[r.selectedOption]++;
  return counts;
}

function startPollTimer(io, poll) {
  if (pollTimer) clearTimeout(pollTimer);
  pollTimer = setTimeout(() => {
    endPoll(io);
  }, (poll.timeLimit || 60) * 1000);
}

async function endPoll(io) {
  if (!activePoll) return;
  activePoll.isActive = false;
  await activePoll.save();
  const submitted = responses.map(r => r.studentName);
  const notSubmitted = activeStudents.filter(name => !submitted.includes(name));
  io.emit('pollEnded', {
    pollId: activePoll._id,
    results: getResults(),
    submitted,
    notSubmitted,
  });
  activePoll = null;
  responses = [];
  activeStudents = [];
  studentSockets = {};
  if (pollTimer) clearTimeout(pollTimer);
} 