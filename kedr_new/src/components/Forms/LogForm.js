import React, { useState } from "react";
import style from "../../css/logform.module.css";

const LogForm = ({ switchToRegister, onLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Проверка: что введено
    if (!login) {
      setError("Укажите почту или телефон");
      return;
    }

    // Проверка пароля
    if (!password) {
      setError("Введите пароль");
      return;
    }

    // Определяем, что введено: email или телефон
    let isEmail = login.includes("@");
    let isPhone = /^\+?[\d\s-]+$/.test(login);

    if (!isEmail && !isPhone) {
      setError("Введите корректный email или телефон");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/djoser-auth/token/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: login,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.auth_token);
        onLogin?.();
        alert("Успешный вход!");
        // Обновляем страницу
        window.location.reload();
      } else {
        setError(data.detail || "Ошибка входа");
      }
    } catch (error) {
      setError("Ошибка сети: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <header className={style.header}>
          <p>Вход в личный кабинет</p>
      </header>
      <form className={style.form} onSubmit={handleSubmit}>
        
        <label htmlFor="login">Почта или телефон*</label>
        <input
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className={style.input}
          placeholder="Введите email или телефон"
        />

        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={style.input}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        
      <div className={style.button_con}>
        {isLoading ? (
          <button type="submit" className={style.button} disabled>
            Войти
          </button>
        ) : (
          <button type="submit" className={style.button}>
            Войти
          </button>
        )}
      </div>
      </form>
      
      <footer className={style.footer}>
        <p onClick={switchToRegister} className={style.reg_button}>
          Забыли пароль?
        </p>
        <p onClick={switchToRegister} className={style.reg_button}>
          Нет аккаунта? Зарегистрироваться
        </p>
      </footer>
    </div>
  );
};

export default LogForm;
