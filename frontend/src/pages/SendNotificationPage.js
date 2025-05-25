import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const SendNotificationPage = () => {
  const { token } = useContext(AuthContext);
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const fetchParents = async () => {
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const onlyParents = res.data.filter((u) => u.role === "parent");
    setParents(onlyParents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParent || !message) return alert("Заповніть усі поля");

    try {
      await axios.post(
        "http://localhost:5000/api/notifications",
        { to: selectedParent, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Повідомлення надіслано успішно!");
      setMessage("");
      setSelectedParent("");
    } catch (error) {
      alert("Не вдалося надіслати повідомлення");
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Надіслати повідомлення батькам</h2>
      <form onSubmit={handleSubmit}>
        <label>Оберіть батька:</label>
        <br />
        <select
          value={selectedParent}
          onChange={(e) => setSelectedParent(e.target.value)}
          required
        >
          <option value="">-- Виберіть --</option>
          {parents.map((p) => (
            <option key={p._id} value={p._id}>
              {p.email}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "1rem" }}>
          <label>Повідомлення:</label>
          <br />
          <textarea
            rows="4"
            style={{ width: "100%" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Надіслати
        </button>
      </form>

      {success && (
        <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>
      )}
    </div>
  );
};

export default SendNotificationPage;
