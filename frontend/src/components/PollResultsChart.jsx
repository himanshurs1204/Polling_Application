import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale);

function PollResultsChart({ options, results, correctOption }) {
  const data = {
    labels: options,
    datasets: [
      {
        label: 'Votes',
        data: options.map(opt => results[opt] || 0),
        backgroundColor: options.map(opt =>
          correctOption && opt === correctOption ? '#34d399' : '#90caf9'
        ),
      },
    ],
  };

  const totalVotes = options.reduce((sum, opt) => sum + (results[opt] || 0), 0);

  return (
    <div style={{ maxWidth: 400 }}>
      <Bar data={data} options={{
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, precision: 0 } },
      }} />
      <div style={{ marginTop: '1rem' }}>Total votes: {totalVotes}</div>
      {correctOption && (
        <div className="mt-2 text-green-700 font-semibold">
          Correct answer: {correctOption}
        </div>
      )}
    </div>
  );
}

export default PollResultsChart; 