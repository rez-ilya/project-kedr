// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { useEffect, useState } from 'react';

// // Можно создать кастомный иконку дерева:
// const treeIcon = new L.Icon({
//   iconUrl: '/tree-icon.png', // заменишь на свою иконку
//   iconSize: [30, 30],
// });

// const MapCedars = () => {
//   const [cedars, setCedars] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:8000/api/v1/trees/')
//     .then(res => {
//         console.log(res); // Проверьте статус ответа
//         return res.json();
//     })
//     .then(data => {
//         console.log('Данные с сервера:', data); // Что приходит на самом деле?
//         setCedars(data);
//     })
//       .catch(err => console.error('Ошибка загрузки кедров:', err));
//   }, []);

//   return (
//     <MapContainer
//       center={[56.5, 84.97]} // Центр Томска
//       zoom={8}
//       style={{ height: '70vh', width: '100%' }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {cedars.map((cedar) => (
//         <Marker
//           key={cedar.id}
//           position={[cedar.latitude, cedar.longitude]}
//           icon={treeIcon}
//         >
//           <Popup>
//             <h3>{cedar.name}</h3>
//             <p>{cedar.description}</p>
//             {cedar.image && <img src={cedar.image} alt={cedar.name} style={{ width: '100px' }} />}
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default MapCedars;
