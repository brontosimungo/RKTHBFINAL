import { useEffect, useRef } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';

const StationMarker = ({ map, station, isActive, isNext }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !station) return;

    // Buat custom icon berdasarkan status stasiun
    const getStationIcon = () => {
      let className = 'station-marker';
      if (isActive) className += ' active-station';
      if (isNext) className += ' next-station';

      return L.divIcon({
        html: `
          <div class="${className}">
            <div class="station-code">${station.properties.code}</div>
            <div class="station-name">${station.properties.name}</div>
          </div>
        `,
        className: 'custom-station-icon',
        iconSize: [60, 40],
        iconAnchor: [30, 40],
        popupAnchor: [0, -40]
      });
    };

    // Buat marker stasiun
    markerRef.current = L.marker(
      [station.geometry.coordinates[1], station.geometry.coordinates[0]],
      { 
        icon: getStationIcon(),
        zIndexOffset: isActive ? 1000 : 500
      }
    ).addTo(map);

    // Tambahkan popup dengan info stasiun
    markerRef.current.bindPopup(`
      <div class="station-popup">
        <h4>${station.properties.name}</h4>
        <p>Kode: ${station.properties.code}</p>
        ${station.properties.note ? `<p class="station-note">${station.properties.note}</p>` : ''}
      </div>
    `);

    // Buka popup jika stasiun aktif
    if (isActive) {
      markerRef.current.openPopup();
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, station, isActive, isNext]);

  return null;
};

StationMarker.propTypes = {
  map: PropTypes.object,
  station: PropTypes.shape({
    properties: PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      note: PropTypes.string
    }).isRequired,
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
    }).isRequired
  }),
  isActive: PropTypes.bool,
  isNext: PropTypes.bool
};

export default StationMarker;
