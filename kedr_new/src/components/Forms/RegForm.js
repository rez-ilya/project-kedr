import React, { useState } from "react";
import style from "../../css/regform.module.css"

const RegForm = (props) => {
    const [formData, setFormData] = useState({
        surname: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        check_password: "",
        // username: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка обязательных полей
        if (!formData.first_name || !formData.last_name || !formData.surname || !formData.password || !formData.check_password) {
            alert("Пожалуйста, заполните все обязательные поля.");
            return;
        }

        // Проверка: хотя бы email или телефон
        if (!formData.email && !formData.phone_number) {
            alert("Укажите хотя бы почту или телефон.");
            return;
        }

        // Проверка пароля
        if (formData.password !== formData.check_password) {
            alert("Пароли не совпадают");
            return;
        }

        // username можно сделать равным email или телефону (или сгенерировать)
        // let username = formData.email ? formData.email : formData.phone_number;
        // if (!username) username = formData.phone_number;

        try {
            const response = await fetch('http://localhost:8000/api/v1/user/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // username: username,
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
                    alert('Регистрация успешна!');
                    // Можно сделать переход на логин или очистку формы
                    props.switchToLogin();
                } else {
                    alert('Ошибка регистрации: ' + (data.error || JSON.stringify(data)));
                }
            } catch (e) {
                alert("Ошибка: сервер вернул не JSON. Ответ: " + text);
            }
        } catch (error) {
            alert("Ошибка сети: " + error);
        }
    };

    return (
        <div className={style.container}>
            <header className={style.header}>
                <button className={style.backButton} onClick={props.switchToLogin}>
                    ← Назад
                </button>
            </header>
            <form className={style.form} onSubmit={handleSubmit}>
                <p className={style.title}>Регистрация</p>
                <label htmlFor="first_name">Имя*</label>
                <input id="first_name" value={formData.first_name} onChange={handleChange} className={style.input} required />

                <label htmlFor="last_name">Фамилия*</label>
                <input id="last_name" value={formData.last_name} onChange={handleChange} className={style.input} required />

                <label htmlFor="surname">Отчество*</label>
                <input id="surname" value={formData.surname} onChange={handleChange} className={style.input} required />

                <label htmlFor="email">Почта</label>
                <input id="email" type="email" value={formData.email} onChange={handleChange} className={style.input} />

                <label htmlFor="phone_number">Телефон</label>
                <input id="phone_number" value={formData.phone_number} onChange={handleChange} className={style.input} />

                <label htmlFor="password">Пароль*</label>
                <input id="password" type="password" value={formData.password} onChange={handleChange} className={style.input} required />

                <label htmlFor="check_password">Повторите пароль*</label>
                <input id="check_password" type="password" value={formData.check_password} onChange={handleChange} className={style.input} required />
                <p className={style.required}>
                    * — Поля обязательные для заполнения
                    </p>
                <footer className={style.footer}>
                    <button type="submit" className={style.button}>Зарегистрироваться</button>
                </footer>
                
            </form>
        </div>
    );
};

export default RegForm;
