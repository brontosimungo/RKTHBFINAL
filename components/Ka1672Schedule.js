import { useState, useEffect } from 'react';

const Ka1672Schedule = ({ onTrainSelect }) => {
  const [schedule, setSchedule] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const response = await fetch('/api/train-position');
        const data = await response.json();
        setSchedule(data.schedule);
        
        // Jika ada segmen aktif, beritahu parent component
        if (data.currentStop) {
          onTrainSelect({
            position: data.position,
            currentStop: data.currentStop,
            nextStop: data.nextStop,
            progress: data.progress
          });
        }
      } catch (error) {
        console.error('Error loading schedule:', error);
      }
    };

    loadSchedule();

    // Update waktu setiap menit
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      loadSchedule();
    }, 60000);

    return () => clearInterval(interval);
  }, [onTrainSelect]);

  if (!schedule) return <div className="loading">Memuat jadwal...</div>;

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  return (
    <div className="ka-schedule">
      <h3>KA {schedule.nomor_ka} - {schedule.nama_ka}</h3>
      <p className="route-info">Lintas Pelayanan: {schedule.lintas_pelayanan}</p>
      
      <div className="schedule-table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Stasiun</th>
              <th>Datang</th>
              <th>Berangkat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {schedule.rute.map((stop, index) => {
              const isActive = isStopActive(stop, currentMinutes, schedule.rute[index + 1]);
              const isPast = isStopInPast(stop, currentMinutes);
              
              return (
                <tr 
                  key={index} 
                  className={`${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                  onClick={() => handleStopClick(stop)}
                >
                  <td>{index + 1}</td>
                  <td>
                    <span className="station-code">{stop.kode}</span>
                    <span className="station-name">{stop.stasiun}</span>
                    {stop.keterangan && <span className="station-note"> ({stop.keterangan})</span>}
                  </td>
                  <td>{stop.datang || '-'}</td>
                  <td>{stop.berangkat || '-'}</td>
                  <td>
                    {isActive && <span className="status active-status">Sedang Berjalan</span>}
                    {isPast && <span className="status past-status">Telah Lewat</span>}
                    {!isActive && !isPast && <span className="status upcoming-status">Akan Datang</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  function isStopActive(stop, currentMinutes, nextStop) {
    if (!stop.berangkat && !stop.datang) return false;
    
    const startTime = stop.berangkat ? convertToMinutes(stop.berangkat) : convertToMinutes(stop.datang);
    const endTime = nextStop?.datang ? convertToMinutes(nextStop.datang) : nextStop?.berangkat ? convertToMinutes(nextStop.berangkat) : startTime;
    
    return currentMinutes >= startTime && currentMinutes <= endTime;
  }

  function isStopInPast(stop, currentMinutes) {
    if (!stop.berangkat && !stop.datang) return false;
    
    const endTime = stop.berangkat ? convertToMinutes(stop.berangkat) : convertToMinutes(stop.datang);
    return currentMinutes > endTime;
  }

  function convertToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function handleStopClick(stop) {
    // Implementasi ketika stasiun diklik (jika diperlukan)
    console.log('Stasiun dipilih:', stop);
  }
};

export default Ka1672Schedule;
