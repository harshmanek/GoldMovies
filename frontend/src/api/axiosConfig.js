import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090", // Update this to your backend port
  headers: {
    "Content-type": "application/json",
  },
});

export default api;
