import React, { useState } from "react";
import style from "../css/regform.module.css"

const RegForm = (props) => {
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        check_password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Отправляемые данные:", formData);
        
        if (formData.password !== formData.check_password) {
          alert("Пароли не совпадают");
          return;
        }
      
        try {
          const response = await fetch('http://localhost:8000/api/v1/user/register/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.username,
              first_name: formData.first_name,
              last_name: formData.last_name,
              surname: formData.surname,
              email: formData.email,
              phone_number: formData.phone_number,
              password: formData.password,
            }),
          });
          
          const data = await response.json();
          // if (!response.ok) throw new Error(data.error || 'Ошибка регистрации');
          // alert('Регистрация успешна!');
          console.log("Статус ответа:", response.status);
          console.log("Ответ сервера:", data);


        } catch (error) {
          alert(error.message);
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
                <p>Регистрация</p>
                <label htmlFor="username">Логин</label>
                <input id="username" value={formData.username} onChange={handleChange} className={style.input} />
                <label htmlFor="first_name">Имя</label>
                <input id="first_name" value={formData.first_name} onChange={handleChange} className={style.input} />

                <label htmlFor="last_name">Фамилия</label>
                <input id="last_name" value={formData.last_name} onChange={handleChange} className={style.input} />

                <label htmlFor="email">Почта</label>
                <input id="email" value={formData.email} onChange={handleChange} className={style.input} />

                <label htmlFor="phone_number">Телефон</label>
                <input id="phone_number" value={formData.phone_number} onChange={handleChange} className={style.input} />

                <label htmlFor="password">Пароль</label>
                <input id="password" type="password" value={formData.password} onChange={handleChange} className={style.input} />

                <label htmlFor="check_password">Повторите пароль</label>
                <input id="check_password" type="password" value={formData.check_password} onChange={handleChange} className={style.input} />

                <footer className={style.footer}>
                    <button type="submit" className={style.button}>Зарегистрироваться</button>
                </footer>
            </form>
        </div>
    );
};

export default RegForm;
