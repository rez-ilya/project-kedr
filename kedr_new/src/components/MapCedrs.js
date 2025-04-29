import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import style from "../css/mapcedrs.module.css"
import '../css/popup_leaflet.css';
import CustomPopupContent from './PopUp/CustomPopupContent';

//Кастомные иконки деревьев:
const defaultTreeIcon = new L.Icon({
  iconUrl: '/tree-icon.png',
  iconSize: [30, 50],
});

const userTreeIcon = new L.Icon({
  iconUrl: '/tree-icon-red.png', // Убедитесь, что у вас есть такая иконка
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
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Получаем информацию о текущем пользователе
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/api/v1/djoser-auth/users/me/", {
        headers: {
          "Authorization": `Token ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => {
        setCurrentUserId(data.id);
      })
      .catch(err => console.error('Ошибка загрузки данных пользователя:', err));
    }

    // Получаем список кедров
    fetch('http://localhost:8000/api/v1/trees/')
    .then(res => res.json())
    .then(data => {
      console.log('Данные с сервера:', data);
      setCedars(data);
    })
    .catch(err => console.error('Ошибка загрузки кедров:', err));
  }, []);

  return (
    <MapContainer
      center={[56.5, 84.97]}
      zoom={13}
      minZoom={6}
      maxZoom={18}
      scrollWheelZoom={true}
      className={style.mapcon}
      maxBounds={tomskBounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {onMapClick && <ClickHandler onMapClick={onMapClick} />}
      {cedars.map((cedar) => (
        <Marker
          key={cedar.id}
          position={[cedar.latitude, cedar.longitude]}
          icon={cedar.owner && cedar.owner.id === currentUserId ? userTreeIcon : defaultTreeIcon}
        >
          <Popup closeButton={false}>
            <CustomPopupContent cedar={cedar} style={style} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapCedars;
