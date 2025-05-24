import React, { useState, useEffect } from "react";
import style from "../../css/regform.module.css"
import config from "../../config";
const RegForm = (props) => {
    const [formData, setFormData] = useState({
        surname: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        check_password: "",
        consent: false
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleOpenPolicy = (e) => {
        e.preventDefault();
        window.open('/ПОЛОЖЕНИЕ.pdf', '_blank');
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.id]: value });
        setError("");
        setSuccess("");

        // Контроль цвета текста для поля даты
        if (e.target.type === 'date') {
            e.target.style.color = value ? '#000' : '#b1b1b1';
            e.target.style.webkitTextFillColor = value ? '#000' : '#b1b1b1';
        }
    };

    // Добавляем эффект для установки начального цвета
    useEffect(() => {
        const dateInput = document.getElementById('birth_date');
        if (dateInput) {
            dateInput.style.color = formData.birth_date ? '#000' : '#b1b1b1';
            dateInput.style.webkitTextFillColor = formData.birth_date ? '#000' : '#b1b1b1';
        }
    }, [formData.birth_date]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^\+?[\d\s-()]+$/;
        return re.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Проверка обязательных полей
        if (!formData.first_name || !formData.last_name || !formData.surname || !formData.password || !formData.check_password) {
            setError("Пожалуйста, заполните все обязательные поля");
            return;
        }

        // Проверка согласия на обработку данных
        if (!formData.consent) {
            setError("Необходимо дать согласие на обработку персональных данных");
            return;
        }

        // Проверка: хотя бы email или телефон
        if (!formData.email && !formData.phone_number) {
            setError("Укажите хотя бы почту или телефон");
            return;
        }

        // Проверка корректности email
        if (formData.email && !validateEmail(formData.email)) {
            setError("Введите корректный email");
            return;
        }

        // Проверка корректности телефона
        if (formData.phone_number && !validatePhone(formData.phone_number)) {
            setError("Введите корректный номер телефона");
            return;
        }

        // Проверка пароля
        if (formData.password !== formData.check_password) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            const response = await fetch(`${config}/api/v1/user/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    surname: formData.surname,
                    email: formData.email || null,
                    phone_number: formData.phone_number || null,
                    password: formData.password,
                }),
            });

            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (response.ok) {
                    setSuccess("Регистрация успешна! Проверьте email для подтверждения.");
                    console.log('Ссылка для подтверждения (dev):', 
                        `${window.location.origin}/confirm-registration/${data.uid}/${data.token}`);
                } else {
                    setError('Ошибка регистрации: ' + (data.error || JSON.stringify(data)));
                }
            } catch (e) {
                setError("Ошибка: сервер вернул не JSON. Ответ: " + text);
            }
        } catch (error) {
            setError("Ошибка сети: " + error);
        }
    };

    return (
        <div className={style.container}>
            {/* <header className={style.header}>
                <button className={style.backButton} onClick={props.switchToLogin}>
                    ← Назад
                </button>
            </header> */}
            <form className={style.form} onSubmit={handleSubmit}>
                <header className={style.title}>Регистрация</header>
                
                <div className={style.form_container}>
                    <div className={style.form_container_row}>
                        <label htmlFor="first_name">Имя*</label>
                        <input id="first_name" placeholder="Введите имя" value={formData.first_name} onChange={handleChange} className={style.input} />

                        <label htmlFor="last_name">Фамилия*</label>
                        <input id="last_name" placeholder="Введите фамилию" value={formData.last_name} onChange={handleChange} className={style.input} />

                        <label htmlFor="surname">Отчество*</label>
                        <input id="surname" placeholder="Введите отчество" value={formData.surname} onChange={handleChange} className={style.input} />

                        <label htmlFor="password">Пароль*</label>
                        <input id="password" placeholder="Придумайте пароль" type="password" value={formData.password} onChange={handleChange} className={style.input} />
                    </div>
                    <div className={style.form_container_row}>
                        <label htmlFor="phone_number">Телефон*</label>
                        <input id="phone_number" placeholder="+7 (xxx) xxx xx-xx" value={formData.phone_number} onChange={handleChange} className={style.input} />

                        <label htmlFor="email">Почта*</label>
                        <input id="email" placeholder="Введите почту через @" type="email" value={formData.email} onChange={handleChange} className={style.input} />

                        <label htmlFor="birth_date">Дата рождения*</label>
                        <input 
                            id="birth_date" 
                            type="date" 
                            value={formData.birth_date} 
                            onChange={handleChange} 
                            className={style.input}
                            style={{
                                color: formData.birth_date ? '#000' : '#b1b1b1',
                                WebkitTextFillColor: formData.birth_date ? '#000' : '#b1b1b1'
                            }}
                        />

                        <label htmlFor="check_password">Повторите пароль*</label>
                        <input id="check_password" placeholder="Повторите пароль" type="password" value={formData.check_password} onChange={handleChange} className={style.input} />
                    </div>
                </div>
                {error && <div className={style.error}>{error}</div>}
                {success && <div className={style.success}>{success}</div>}
                <p className={style.required}>
                    *Поля обязательные для заполнения
                </p>
                <div className={style.consent}>
                    <input
                        type="checkbox"
                        id="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                    />
                    <label htmlFor="consent">
                        Даю согласие на <span className={style.greenText} onClick={handleOpenPolicy} style={{cursor: 'pointer'}}>обработку персональных данных</span> и принимаю условия <span href="#" className={style.greenText} onClick={handleOpenPolicy}>"Политики конфиденциальности"</span>
                    </label>
                </div>
                <footer className={style.footer}>
                    <button type="submit" className={style.button}>Зарегистрироваться</button>
                </footer>
            </form>
        </div>
    );
};

export default RegForm;
