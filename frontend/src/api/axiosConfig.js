import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Update this to your backend port
  headers: {
    "Content-type": "application/json",
  },
});

export default api;
