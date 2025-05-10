import React, { useEffect, useState } from 'react';
import style from '../css/mycedarspage.module.css';
import { useNavigate } from 'react-router-dom';

function MyCedarsPage() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [cedars, setCedars] = useState([]);
  const [openCedarId, setOpenCedarId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Получаем id пользователя
    fetch('http://localhost:8000/api/v1/djoser-auth/users/me/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setCurrentUserId(data.id));
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetch('http://localhost:8000/api/v1/trees/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setCedars(data.filter(cedar => cedar.owner.id === currentUserId)));
    }
  }, [currentUserId]);

  return (
    <div>
      <div className={style.root}>
        <div className={style.header}>
            <button className={style.back_btn} onClick={() => navigate('/')}>
              <span className={style.backArrow}>←</span>
              <span className={style.backText}>Вернуться на главную</span>
            </button>
            <div className={style.headerTitleBlock}>
              <span className={style.headerTitle}>Мои деревья</span>
            </div>
        </div>
        <div className={style.cedarsList}>
          {cedars.map(cedar => (
            <div key={cedar.id}>
              <div
                className={style.cedarItem}
                onClick={() => setOpenCedarId(openCedarId === cedar.id ? null : cedar.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className={openCedarId === cedar.id ? `${style.cedarCheck} ${style.cedarCheckOpen}` : style.cedarCheck}>❯</span>
                <span className={style.cedarName}>Кедр “{cedar.title}”</span>
              </div>
              {openCedarId === cedar.id && (
                <div className={style.cedarInfoBlock}>
                  <div className={style.cedarDescription}>{cedar.content}</div>
                  <div className={style.cedarPhoto}>
                    {cedar.picture ? (
                      <img src={cedar.picture} alt="Фото кедра" />
                    ) : (
                      <div className={style.cedarPhotoPlaceholder}>Фото не загружено</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyCedarsPage; 