import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config';

const ConfirmRegistration = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Подтверждение регистрации...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!uid || !token) {
      setMessage('Неверная ссылка подтверждения');
      return;
    }

    const confirmRegistration = async () => {
      try {
        const response = await fetch(`${config}/api/v1/activate/${uid}/${token}/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        const data = await response.json();
        
        if (response.ok) {
          setMessage(data.detail || 'Регистрация успешно подтверждена!');
          setIsSuccess(true);
          // Автоперенаправление через 3 секунды
          setTimeout(() => navigate('/login'), 3000);
        } else {
          throw new Error(data.detail || 'Ошибка подтверждения');
        }
      } catch (error) {
        setMessage(error.message);
      }
    };

    confirmRegistration();
  }, [uid, token, navigate]);

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      <h2>{message}</h2>
      {isSuccess && <p>Вы будете перенаправлены на страницу входа...</p>}
    </div>
  );
};

export default ConfirmRegistration;
