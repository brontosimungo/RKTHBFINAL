// Fungsi konversi "HH:MM:SS" ke menit
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return null;
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 60 + minutes + (seconds || 0) / 60;
}

// Fungsi interpolasi koordinat
function interpolateBetweenCoords(coord1, coord2, ratio) {
  const lat = coord1[1] + (coord2[1] - coord1[1]) * ratio;
  const lng = coord1[0] + (coord2[0] - coord1[0]) * ratio;
  return [lng, lat];
}

// Fungsi format waktu "HH:MM:SS" jadi "HH:MM"
function formatTimeHHMM(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  return `${h}:${m}`;
}

// Fungsi utama untuk menghitung posisi semua kereta
export function interpolateAllPositions(currentMinutes, jadwalKA) {
  const positions = {};

  Object.entries(jadwalKA).forEach(([kaId, rute]) => {
    for (let i = 0; i < rute.length - 1; i++) {
      const curr = rute[i];
      const next = rute[i + 1];

      const dep = timeStringToMinutes(curr.waktuBerangkat);
      const arr = timeStringToMinutes(next.waktuTiba);

      if (dep !== null && arr !== null && currentMinutes >= dep && currentMinutes <= arr) {
        const ratio = (currentMinutes - dep) / (arr - dep);
        const interpolated = interpolateBetweenCoords(curr.koordinat, next.koordinat, ratio);

        positions[kaId] = {
          koordinat: interpolated,
          currentStop: curr,
          nextStop: next
        };
        return;
      }
    }

    // Jika waktu sekarang 10 menit sebelum berangkat dari stasiun awal
    const firstStop = rute[0];
    const lastStop = rute[rute.length - 1];
    const firstDep = timeStringToMinutes(firstStop.waktuBerangkat);
    const lastArr = timeStringToMinutes(lastStop.waktuTiba);

    if (currentMinutes >= firstDep - 10 && currentMinutes < firstDep) {
      positions[kaId] = {
        koordinat: firstStop.koordinat,
        currentStop: null,
        nextStop: firstStop,
        departureTime: formatTimeHHMM(firstStop.waktuBerangkat)
      };
    }

    // Jika kereta sudah selesai (melebihi waktu tiba terakhir), tidak ditampilkan
  });

  return positions;
}
