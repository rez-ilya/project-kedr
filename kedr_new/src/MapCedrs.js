import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import style from "./css/mapcedrs.module.css"

//Rастомная иконка дерева:
const treeIcon = new L.Icon({
  iconUrl: '/tree-icon.png',
  iconSize: [30, 50],
});

const tomskBounds = [
  [56.4847 - 1.8, 84.9482 - 3.0], // юго-западная точка
  [56.4847 + 1.8, 84.9482 + 3.0]  // северо-восточная точка
];

function ClickHandler({ onMapClick }) {
  useMapEvent('click', (e) => {
    if (onMapClick) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

const MapCedars = ({ onMapClick }) => {
  const [cedars, setCedars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/trees/')
    .then(res => {
        console.log(res); //статус ответа
        return res.json();
    })
    .then(data => {
        console.log('Данные с сервера:', data);
        setCedars(data);
    })
      .catch(err => console.error('Ошибка загрузки кедров:', err));
  }, []);

  return (
    <MapContainer
    center={[56.5, 84.97]} // центр карты
      zoom={13}
      minZoom={6}
      maxZoom={18}
      scrollWheelZoom={true}
      className={style.mapcon}
      maxBounds={tomskBounds}
      maxBoundsViscosity={1.0} // 1.0 = нельзя выйти вообще
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {onMapClick && <ClickHandler onMapClick={onMapClick} />}
      {cedars.map((cedar) => (
        <Marker
          key={cedar.id}
          position={[cedar.latitude, cedar.longitude]}
          icon={treeIcon}
        >
          <Popup>
            <h3>{cedar.title}</h3>
            <p>{cedar.content}</p>
            {cedar.picture && <img src={cedar.picture} alt={cedar.title} style={{ width: '100px' }} />}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapCedars;
