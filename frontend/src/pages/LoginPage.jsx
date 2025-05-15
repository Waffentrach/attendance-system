import React, { useState } from 'react';
import axios from 'axios';
import InputField from '../components/InputField';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      alert('Успішний вхід');
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Помилка входу');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Вхід</h2>
      <form onSubmit={handleLogin}>
        <InputField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <InputField label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default LoginPage;
