import React, { useState } from "react";
import style from "../css/logform.module.css";

const LogForm = ({ switchToRegister, onLogin }) => {
  const [username, setUsername] = useState(""); // Важно: имя поля именно username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Важно для передачи куки (сессии)
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Неверный логин или пароль");
      }

      // Если всё ок
      onLogin?.(); // вызвать функцию, если передана (например, обновить состояние в App)
      console.log("Успешный вход");

    } catch (error) {
      console.error("Ошибка входа:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <label htmlFor="username">Логин</label>
        <input
          id="username"
          className={style.input}
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          id="password"
          className={style.input}
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className={style.error}>{error}</p>}

        <button type="submit" className={style.button}>
          Войти
        </button>
      </form>

      <footer className={style.footer}>
        <p onClick={switchToRegister} className={style.reg_button}>
          Нет аккаунта? Зарегистрироваться
        </p>
      </footer>
    </div>
  );
};

export default LogForm;
