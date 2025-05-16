import { useMap } from 'react-leaflet';

function CustomPopupContent({ cedar, style }) {
  const map = useMap();

  return (
    <div className={style.custom_popup}>
      <button className={style.popup_close} onClick={() => map.closePopup()}>
          <img src="/close-icon.png" alt="Закрыть" />
      </button>
      {/* Header */}
      <div className={style.popup_header}>
        <h3 className={style.popup_title}>Кедр «{cedar.title}»</h3>
      </div>
      {/* Main */}
      <div className={style.popup_content}>
        <div className={style.popup_info_block}>
          <p className={style.popup_registered}><span className={style.popup_label}>Кем зарегистрирован:</span> {cedar.registeredBy || '—'}</p>
          <p className={style.popup_dedicated}><span className={style.popup_label}>Кому посвящён:</span> {cedar.dedicatedTo || '—'}</p>
          <span className={style.popup_desc_label}>Описание:</span>
        </div>
        <div className={style.popup_main_flex}>
          <div
            className={
              cedar.picture
                ? style.popup_left_desc
                : `${style.popup_left_desc} ${style.popup_full_width}`
            }
          >
            <p className={style.popup_desc}>{cedar.description || cedar.content}</p>
          </div>
          {cedar.picture && (
            <div className={style.popup_right_photo}>
              <img src={cedar.picture} alt="Фотография" className={style.popup_photo} />
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className={style.popup_footer}>
        <div className={style.popup_footer_left}>
          Дата регистрации: {cedar.registrationDate || '—'}
        </div>
        <div className={style.popup_footer_right}>
          Дата посадки: {cedar.plantingDate || '—'}
        </div>
      </div>
    </div>
  );
}

export default CustomPopupContent;
