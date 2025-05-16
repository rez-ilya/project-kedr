import React, { useState } from "react";
import styles from "../../css/resetpasswordform.module.css";

const ResetPasswordForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Укажите почту");
      return;
    }

    if (!email.includes("@")) {
      setError("Введите корректный email");
      return;
    }

    try {
      setIsLoading(true);
      // Здесь будет логика отправки запроса на восстановление пароля
      setSuccess("Инструкции по восстановлению пароля отправлены на вашу почту");
    } catch (error) {
      setError("Произошла ошибка: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.resetPassword}>
      <header className={styles.resetPassword_header}>
        <p>Укажите почту, на которую придёт письмо с ссылкой на восстановление пароля</p>
      </header>
      <form className={styles.resetPassword_form} onSubmit={handleSubmit}>
        
        <input
          id="email"
          type="email"
          className={styles.resetPassword_input}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setSuccess("");
          }}
          placeholder="Укажите Вашу почту"
        />
        

        <div className={styles.resetPassword_button_container}>
          {isLoading ? (
            <button type="submit" className={styles.resetPassword_button} disabled>
              Отправить
            </button>
          ) : (
            <button type="submit" className={styles.resetPassword_button}>
              Отправить
            </button>
          )}
        </div>
      </form>
      {error && <div className={styles.resetPassword_error}>{error}</div>}
      {success && <div className={styles.resetPassword_success}>{success}</div>}
    </div>
  );
};

export default ResetPasswordForm; 