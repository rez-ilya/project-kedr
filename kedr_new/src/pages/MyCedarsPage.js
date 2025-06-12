import React, { useEffect, useState} from 'react';
import style from '../css/mycedarspage.module.css';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import mapStyle from '../css/mapcedrs.module.css';

function MyCedarsPage() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [cedars, setCedars] = useState([]);
  const [openCedarId, setOpenCedarId] = useState(null);
  const [currentPhotos, setCurrentPhotos] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем id пользователя
    fetch(`${config}/api/v1/djoser-auth/users/me/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setCurrentUserId(data.id));
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetch(`${config}/api/v1/trees/`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setCedars(data.filter(cedar => cedar.owner === currentUserId)));
    }
  }, [currentUserId]);

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  // Функция для получения всех фото кедра
  const getCedarPhotos = (cedar) => {
    const photos = [];
    if (cedar.picture) photos.push({ url: cedar.picture, id: 'main' });
    if (cedar.images && cedar.images.length > 0) {
      cedar.images.forEach(img => photos.push({ url: img.image, id: img.id }));
    }
    return photos;
  };

  // Функции навигации (исправленные)
  const goPrev = (cedarId, photos) => {
    setCurrentPhotos(prev => {
      const current = prev[cedarId] || 0; // Если нет значения, используем 0
      return {
        ...prev,
        [cedarId]: (current - 1 + photos.length) % photos.length
      };
    });
  };

  const goNext = (cedarId, photos) => {
    setCurrentPhotos(prev => { console.log(currentPhotos);
      const current = prev[cedarId] || 0; // Если нет значения, используем 0
      return {
        ...prev,
        [cedarId]: (current + 1) % photos.length
      };
    });
  };

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
          {cedars.map(cedar => {
            const photos = getCedarPhotos(cedar);
            const currentPhoto = currentPhotos[cedar.id] || 0; // По умолчанию 0
            
            return (
              <div key={cedar.id}>
                <div
                  className={style.cedarItem}
                  onClick={() => setOpenCedarId(openCedarId === cedar.id ? null : cedar.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={openCedarId === cedar.id ? `${style.cedarCheck} ${style.cedarCheckOpen}` : style.cedarCheck}>❯</span>
                  <span className={style.cedarName}>Кедр "{cedar.title}"</span>
                </div>
                {openCedarId === cedar.id && (
                  <div className={style.cedarInfoBlock}>
                    <div className={style.popup_main_flex}>
                      <div className={style.popup_left_desc}>
                        <div className={mapStyle.popup_info_block}>
                          <p className={mapStyle.popup_registered}>
                            <span className={mapStyle.popup_label}>Кем зарегистрирован:</span> 
                            {cedar.owner_name || '—'}
                          </p>
                          <p className={mapStyle.popup_dedicated}>
                            <span className={mapStyle.popup_label}>Кому посвящён:</span> 
                            {cedar.dedicated_to || '—'}
                          </p>
                          <span className={mapStyle.popup_desc_label}>Описание:</span>
                        </div>
                        <p className={mapStyle.popup_desc}>{cedar.content}</p>
                      </div>
                      
                      {photos.length > 0 && (
                        <div className={mapStyle.photo_gallery_block}>
                          <div className={mapStyle.photo_gallery_imgwrap}>
                            <img
                              src={photos[currentPhoto].url}
                              alt={`Фотография ${currentPhoto + 1}`}
                              className={mapStyle.photo_gallery_img}
                              onError={e => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-image.png';
                              }}
                            />
                          </div>
                          <div className={mapStyle.photo_gallery_nav}>
                            <button
                              className={mapStyle.photo_gallery_arrow}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                goPrev(cedar.id, photos);
                              }}
                              disabled={photos.length < 2}
                            >
                              <span>&#x276E;</span>
                            </button>
                            <span className={mapStyle.photo_gallery_counter}>
                              {currentPhoto + 1}/{photos.length}
                            </span>
                            <button
                              className={mapStyle.photo_gallery_arrow}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                goNext(cedar.id, photos);
                              }}
                              disabled={photos.length < 2}
                            >
                              <span>&#x276F;</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={style.popup_footer}>
                      <div className={mapStyle.popup_footer_left}>
                        Дата регистрации: {formatDate(cedar.creation_date)}
                      </div>
                      <div className={mapStyle.popup_footer_right}>
                        Дата посадки: {formatDate(cedar.plant_date)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyCedarsPage; 