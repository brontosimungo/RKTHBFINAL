const TrainInfo = ({ currentStation, nextStation, schedule }) => {
  return (
    <div className="train-info-container">
      <h2>Commuterline Rangkasbitung - Tanah Abang</h2>
      <div className="train-status">
        <h3>Status Kereta</h3>
        <p>Stasiun Saat Ini: <strong>{currentStation}</strong></p>
        <p>Menuju: <strong>{nextStation}</strong></p>
        <p>Estimasi Kedatangan: <strong>{schedule.eta}</strong></p>
      </div>
      <div className="schedule">
        <h3>Jadwal Berikutnya</h3>
        <ul>
          {schedule.upcoming.map((item, index) => (
            <li key={index}>
              {item.station} - {item.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrainInfo;
