import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupList.css';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState('');

  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Помилка завантаження груп", err);
    }
  };

  const handleCreate = async () => {
    if (!newGroup.trim()) return alert("Введіть назву групи");
    try {
      await axios.post(
        'http://localhost:5000/api/groups',
        { name: newGroup },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewGroup('');
      fetchGroups();
    } catch (err) {
      alert("Помилка створення ❌");
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="group-list-container">
      <h2>Список груп</h2>
      <div className="group-form">
        <input
          type="text"
          placeholder="Нова група"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
        />
        <button onClick={handleCreate}>Створити</button>
      </div>
      <ul className="group-list">
        {groups.map((group) => (
          <li key={group._id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
