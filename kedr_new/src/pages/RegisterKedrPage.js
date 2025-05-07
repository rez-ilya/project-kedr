import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../css/regkedr.module.css";
import MapCedars from "../components/MapCedrs";
import ModalRegKedr from "../components/PopUp/ModalRegKedr";

const RegisterKedrPage = () => {
    const navigate = useNavigate();
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
    });

    React.useEffect(() => {
        fetchUserInfo();
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/djoser-auth/users/me/", {
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
        if (id === "add_img") {
            const file = files[0];
            if (file) {
                setState(prev => ({ 
                    ...prev, 
                    file: file,
                    fileName: file.name
                }));
            }
        } else {
            setState(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { selectedCoords, description, file, promo } = state;
        
        // Проверка обязательных полей
        if (!selectedCoords) {
            setState(prev => ({ ...prev, Error: "Пожалуйста, выберите место на карте" }));
            return;
        }
        
        if (!description) {
            setState(prev => ({ ...prev, Error: "Пожалуйста, добавьте описание" }));
            return;
        }

        // if (!promo) {
        //     setState(prev => ({ ...prev, Error: "Пожалуйста, введите промокод" }));
        //     return;
        // }

        // Проверка промокода
        if (promo) {
            try {
                const token = localStorage.getItem("token");
                const promoResponse = await fetch(`http://localhost:8000/api/v1/promocodes/check/${promo}/`, {
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
        formData.append("content", description);
        formData.append("latitude", selectedCoords[0]);
        formData.append("longitude", selectedCoords[1]);
        if (file) formData.append("picture", file);
        formData.append("promo", promo);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/v1/trees/", {
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
                setState(prev => ({ ...prev, Error: "Ошибка при отправке: " + JSON.stringify(data) }));
            }
        } catch (error) {
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
                <button className={style.back_btn} onClick={() => navigate('/')}>🠔 Вернуться на главную</button>
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
                            Зарегистрируйте <span className={style.cedr_word}>кедр</span><br />в 2 шага
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
            <section className={style.step_section}>
                <div className={style.step_title_block}>
                    <div className={style.step_title}><span>Шаг 2:</span> Добавьте описание и фото</div>
                </div>
                <form className={style.reg_kedr_form} onSubmit={handleSubmit}>
                    <div className={style.form_grid}>
                        <div className={style.form_left}>
                            <label htmlFor="description">Описание</label>
                            <textarea id="description" value={state.description || ''} onChange={handleInputChange} required className={style.textarea} />
                            <label htmlFor="promo">Введите промокод</label>
                            <input id="promo" value={state.promo || ''} onChange={handleInputChange} className={style.input} />
                        </div>
                        <div className={style.form_right}>
                            <label className={style.file_label} htmlFor="add_img">
                                <div className={style.file_box}>
                                    {state.fileName ? (
                                        <div className={style.file_name}>
                                            <span className={style.file_icon}>📷</span>
                                            <span className={style.file_text}>{state.fileName}</span>
                                        </div>
                                    ) : (
                                        <span className={style.file_plus}>+</span>
                                    )}
                                </div>
                                <input type="file" id="add_img" onChange={handleInputChange} className={style.file_input} accept="image/*,.svg" />
                            </label>
                            <div className={style.file_hint}>
                                {state.file ? 'Фото загружено' : 'Добавьте файлы формата *.png, *.jpeg, *.jpg, *.svg, *.gif, *.webp'}
                            </div>
                        </div>
                    </div>
                    {state.Error && <div className={style.error}>{state.Error}</div>}
                    <div className={style.form_footer}>
                        <button type="submit" className={style.submit_btn}>Оплатить и отправить заявку</button>
                    </div>
                </form>
            </section>

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