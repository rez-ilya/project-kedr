import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "../css/regkedr.module.css";
import MapCedars from "../components/MapCedrs";
import ModalRegKedr from "../components/PopUp/ModalRegKedr";
import config from "../config";
const RegisterKedrPage = () => {
    const navigate = useNavigate();
    const textareaRef = useRef(null);
    const [state, setState] = React.useState({
        selectedCoords: null,
        showModal: false,
        showSuccessModal: false,
        description: '',
        promo: '',
        file: null,
        title: '',
        userInfo: null,
        Error: '',
        filePreview: null,
        fileName: '',
        dedication: '',
        img_dedication: [],
        img_previews: [],
        mainPhoto: null,
        mainPhotoName: '',
        dedicationPhotos: []
    });

    React.useEffect(() => {
        fetchUserInfo();
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Очистка URL при размонтировании компонента
    React.useEffect(() => {
        return () => {
            state.img_previews?.forEach(preview => {
                URL.revokeObjectURL(preview.url);
            });
        };
    }, [state.img_previews]);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${config}/api/v1/djoser-auth/users/me/`, {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setState(prev => ({ ...prev, userInfo: data }));
            } else {
                localStorage.removeItem("token");
                setState(prev => ({ ...prev, userInfo: null }));
            }
        } catch (error) {
            console.error("Ошибка загрузки данных пользователя:", error);
            localStorage.removeItem("token");
            setState(prev => ({ ...prev, userInfo: null }));
        }
    };

    const handleMapClick = (coords) => {
        setState(prev => ({ ...prev, selectedCoords: coords, showModal: true }));
    };

    const handleModalSave = () => {
        setState(prev => ({ ...prev, showModal: false }));
    };

    const handleModalCancel = () => {
        setState(prev => ({ ...prev, showModal: false, selectedCoords: null }));
    };

    const handleOverlayClick = () => {
        setState(prev => ({ ...prev, showModal: false }));
    };

    const handleInputChange = (e) => {
        const { id, value, files } = e.target;
        if (id === "description" && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
        if (id === "mainPhoto") {
            const file = files[0];
            if (file) {
                setState(prev => ({ 
                    ...prev, 
                    mainPhoto: file,
                    mainPhotoName: file.name
                }));
            }
        } else if (id === "img_dedication") {
            const selectedFiles = Array.from(files);
            if (selectedFiles.length > 0) {
                const maxFiles = 10;
                const currentFiles = state.dedicationPhotos || [];
                const currentPreviews = state.img_previews || [];

                if (currentFiles.length + selectedFiles.length > maxFiles) {
                    alert(`Можно загрузить не более ${maxFiles} фотографий`);
                    return;
                }

                // Создаём превью для новых файлов
                const newPreviews = selectedFiles.map(file => ({
                    url: URL.createObjectURL(file),
                    name: file.name
                }));

                setState(prev => ({
                    ...prev,
                    dedicationPhotos: [...currentFiles, ...selectedFiles],
                    img_previews: [...currentPreviews, ...newPreviews]
                }));
            }
        } else {
            setState(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleRemovePhoto = (indexToRemove) => {
        setState(prev => {
            // Освобождаем URL превью
            URL.revokeObjectURL(prev.img_previews[indexToRemove].url);
            
            return {
                ...prev,
                dedicationPhotos: prev.dedicationPhotos.filter((_, index) => index !== indexToRemove),
                img_previews: prev.img_previews.filter((_, index) => index !== indexToRemove)
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { selectedCoords, description, mainPhoto, dedicationPhotos, promo } = state;
        
        // Проверка обязательных полей
        if (!selectedCoords) {
            setState(prev => ({ ...prev, Error: "Пожалуйста, выберите место на карте" }));
            return;
        }
        
        if (!description) {
            setState(prev => ({ ...prev, Error: "Пожалуйста, добавьте описание" }));
            return;
        }

        // Проверка промокода, если он указан
        if (promo) {
            try {
                const token = localStorage.getItem("token");
                const promoResponse = await fetch(`${config}/api/v1/promocodes/check/${promo}/`, {
                    method: "GET",
                    headers: token
                        ? { "Authorization": `Token ${token}` }
                        : {},
                });

                if (!promoResponse.ok) {
                    setState(prev => ({ ...prev, Error: "Такого промокода не существует" }));
                    return;
                }
            } catch (error) {
                console.error("Ошибка при проверке промокода:", error);
                setState(prev => ({ ...prev, Error: "Ошибка при проверке промокода" }));
                return;
            }
        }

        const formData = new FormData();
        
        // Добавляем все поля формы в соответствии с моделью
        formData.append("title", state.title || 'Дерево');
        formData.append("content", description);
        formData.append("latitude", selectedCoords[0]);
        formData.append("longitude", selectedCoords[1]);
        formData.append("plant_date", state.date || '');
        formData.append("dedicated_to", state.dedication || '');
        formData.append("promo", promo || '');
        
        // Добавляем титульную фотографию
        if (mainPhoto) {
            formData.append("picture", mainPhoto);
        }

        // Добавляем owner (id пользователя)
        if (state.userInfo && state.userInfo.id) {
            formData.append("owner", state.userInfo.id);
        }

        // Добавляем owner_name (ФИО пользователя)
        if (state.userInfo) {
            const fio = `${state.userInfo.last_name || ''} ${state.userInfo.first_name || ''} ${state.userInfo.surname || ''}`.trim();
            formData.append("owner_name", fio);
        }

        // Для отладки
        console.log('mainPhoto:', mainPhoto);
        console.log('userInfo:', state.userInfo);
        
        // Добавляем фотографии посвящения
        if (dedicationPhotos && dedicationPhotos.length > 0) {
            dedicationPhotos.forEach((photo) => {
                formData.append("images", photo);
            });
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${config}/api/v1/add_tree/`, {
                method: "POST",
                body: formData,
                headers: token
                    ? { "Authorization": `Token ${token}` }
                    : {},
            });

            if (response.ok) {
                setState(prev => ({ ...prev, showSuccessModal: true, Error: '' }));
            } else {
                const data = await response.json();
                console.error('Ошибка при отправке:', data);
                setState(prev => ({ ...prev, Error: "Ошибка при отправке: " + JSON.stringify(data) }));
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            setState(prev => ({ ...prev, Error: "Ошибка сети: " + error }));
        }
    };

    const handleSuccessModalClose = () => {
        setState(prev => ({ ...prev, showSuccessModal: false }));
        navigate('/');
    };

    return (
        <div className={style.page_wrapper}>
            {/* Фиксированная шапка */}
            <div className={style.fixed_header}>
                <button className={style.back_btn} onClick={() => navigate('/')}>
                    <span className={style.backArrow}>←</span>
                    <span className={style.backText}>Вернуться на главную</span>
                </button>
                <div className={style.user_name}>
                    {state.userInfo ? `${state.userInfo.last_name} ${state.userInfo.first_name} ${state.userInfo.surname}` : ''}
                </div>
            </div>
            {/* <div className={style.header_spacer}></div> */}

            {/* Первый экран */}
            <section className={style.hero_section}>
                {/* Фон задаётся через CSS */}
                <div className={style.hero_overlay}></div>
                <div className={style.hero_text_overlay}>
                    <div className={style.memory_label}><span>Дерево</span> – символ вечной памяти</div>
                    <div className={style.hero_title_block}>
                        <div className={style.hero_title}>
                            Зарегистрируйте <span className={style.cedr_word}>кедр</span><br />в 3 шага
                        </div>
                    </div>
                </div>
                <div className={style.hero_trees}></div> {/* Декоративные деревья */}
            </section>

            {/* Второй экран */}
            <section className={style.step_section}>
                <div className={style.step_title_block}>
                    <div className={style.step_title}><span>Шаг 1:</span> Выбери место на карте</div>
                </div>
                <div className={style.map_block}>
                    <MapCedars onMapClick={handleMapClick} selectedCoords={state.selectedCoords} />
                </div>
            </section>

            {/* Третий экран */}
            <form className={style.reg_kedr_form} onSubmit={handleSubmit}>
                <section className={style.step_section}>
                    <div className={style.step_title_block}>
                        <div className={style.step_title}><span>Шаг 2:</span> Добавьте дату посадки и фото</div>
                    </div>
                        <div className={style.form_grid}>
                            <div className={style.form_left}>
                                <label htmlFor="date">Введите дату посадки</label>
                                <input type="date" id="date" 
                                    value={state.date || ''} 
                                    onChange={handleInputChange} 
                                    className={style.input} 
                                    style={{
                                    color: state.date ? '#000' : '#b1b1b1',
                                    WebkitTextFillColor: state.date ? '#000' : '#b1b1b1'
                                    }}/>
                                <label htmlFor="mainPhoto">Добавьте главную фотографию:</label>
                                <label className={style.file_label} htmlFor="mainPhoto">
                                    <div className={style.file_box}>
                                        {state.mainPhotoName ? (
                                            <div className={style.file_name}>
                                                <span className={style.file_icon}>📷</span>
                                                <span className={style.file_text}>{state.mainPhotoName}</span>
                                            </div>
                                        ) : (
                                            <span className={style.file_plus}>+</span>
                                        )}
                                    </div>
                                    <input type="file" id="mainPhoto" onChange={handleInputChange} className={style.file_input} accept="image/*,.svg" />
                                </label>
                                <div className={style.file_hint}>
                                    {state.mainPhoto ? 'Фото загружено' : 'Добавьте файлы формата *.png, *.jpeg, *.jpg, *.svg, *.gif, *.webp'}
                                </div>
                            </div>
                        </div>
                    
                </section>
                {/* Четвёртый экран */}
                <section className={style.step_section}>
                    <div className={style.step_title_block}>
                        <div className={style.step_title}><span>Шаг 3:</span> Оплатите и отправьте заявку</div>
                    </div>
                    <div className={style.form_grid}>
                        <div className={style.form_left}>
                            <div className={style.input_group}>
                                <label htmlFor="title">Введите название кедра</label>
                                <input id="title" value={state.title || ''} onChange={handleInputChange} className={style.input} />
                            </div>
                            <div className={style.input_group}>
                                <label htmlFor="dedication">Введите ФИО человека, которому Вы бы хотели посвятить дерево</label>
                                <input id="dedication" value={state.dedication || ''} onChange={handleInputChange} className={style.input} />
                            </div>
                            <div className={style.input_group}>
                                <label htmlFor="promo">Введите промокод</label>
                                <input id="promo" value={state.promo || ''} onChange={handleInputChange} className={style.input} />
                            </div>
                        </div>
                        <div className={style.form_right}>
                            <label htmlFor="description">Описание</label>
                            <textarea
                                id="description"
                                ref={textareaRef}
                                value={state.description || ''}
                                onChange={handleInputChange}
                                required
                                className={style.textarea}
                                placeholder="Здесь можно добавить биографию или факты из жизни"
                            />
                            <label htmlFor="img_dedication">Добавьте фотографии человека</label>
                            <label className={style.file_label} htmlFor="img_dedication">
                                <div className={style.file_box}>
                                    {state.img_previews && state.img_previews.length > 0 ? (
                                        <div className={style.photo_list}>
                                            {state.img_previews.map((preview, index) => (
                                                <div key={index} className={style.photo_item}>
                                                    <div className={style.photo_preview}>
                                                        <img src={preview.url} alt={preview.name} className={style.photo_thumbnail} />
                                                        <span className={style.photo_name}>{preview.name}</span>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        className={style.remove_photo_btn}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRemovePhoto(index);
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={style.upload_prompt}>
                                            <span className={style.file_plus}>+</span>
                                        </div>
                                    )}
                                </div>
                            </label>
                            <div className={style.file_hint}>
                                Добавьте файлы формата *.png, *.jpeg, *.jpg, *.svg, *.gif, *.webp'
                            </div>
                            <input type="file" id="img_dedication" onChange={handleInputChange} className={style.file_input} accept="image/*,.svg" multiple />
                        </div>
                    </div>
                    {state.Error && <div className={style.error}>{state.Error}</div>}
                    <div className={style.form_footer}>
                        <button type="submit" className={style.submit_btn}>Оплатить и отправить заявку</button>
                    </div>
                </section>
            </form>
            {/* Модальные окна */}
            <ModalRegKedr isOpen={state.showModal} onClose={handleOverlayClick} contentClass={style.modalContent}>
                <p>Вы уверены, что хотите посадить кедр на этом месте?</p>
                <div className={style.modalButtons}>
                    <button onClick={handleModalSave}>Да</button>
                    <button onClick={handleModalCancel}>Отмена</button>
                </div>
            </ModalRegKedr>

            <ModalRegKedr isOpen={state.showSuccessModal} onClose={handleSuccessModalClose} contentClass={style.successModalContent}>
                <h2>Ваша заявка успешно отправлена!</h2>
                <p>Мы обязательно свяжемся с Вами</p>
                <button onClick={handleSuccessModalClose}>Ок</button>
            </ModalRegKedr>
        </div>
    );
};

export default RegisterKedrPage; 