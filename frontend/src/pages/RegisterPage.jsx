import React, { useState } from 'react';
import axios from 'axios';
import InputField from '../components/InputField';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'parent' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Реєстрація успішна!');
      console.log(res.data);
    } catch (err) {
      alert('Помилка реєстрації');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Реєстрація</h2>
      <form onSubmit={handleSubmit}>
        <InputField label="Ім’я" type="text" value={form.name} onChange={handleChange} name="name" />
        <InputField label="Email" type="email" value={form.email} onChange={handleChange} name="email" />
        <InputField label="Пароль" type="password" value={form.password} onChange={handleChange} name="password" />
        <label>Роль:</label><br />
        <select name="role" value={form.role} onChange={handleChange} style={{ marginBottom: '1rem' }}>
          <option value="admin">Адміністратор</option>
          <option value="teacher">Вихователь</option>
          <option value="parent">Батько/Мати</option>
        </select><br />
        <button type="submit">Зареєструватися</button>
      </form>
    </div>
  );
};

export default RegisterPage;
