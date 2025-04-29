import { useMap } from 'react-leaflet';

function CustomPopupContent({ cedar, style }) {
  const map = useMap();

  return (
    <div className={style.custom_popup}>
      <button className={style.popup_close} onClick={() => map.closePopup()}>
        <img src="/close-icon.png" alt="Закрыть" />
      </button>
      <div className={style.popup_content}>
        <h3 className={style.popup_title}>Кедр “{cedar.title}”</h3>
        <div className={style.popup_main}>
          <div className={style.popup_left}>
            <p className={style.popup_desc}>
              {cedar.content}
            </p>
          </div>
          <div className={style.popup_photo_block}>
            <img
              src={cedar.picture ? cedar.picture : "/path/to/photo-placeholder.svg"}
              alt="Фотография"
              className={style.popup_photo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomPopupContent;
