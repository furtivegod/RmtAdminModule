import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api";

class UserService {
  getInitialData(type) {
    return axios.get(`${API_URL}/initial/${type}`, { headers: authHeader() });
  }

  addUser(data) {
    return axios.put(API_URL + "/addUser", data, { headers: authHeader() });
  }

  deleteUser(data) {
    return axios.delete(API_URL + `/deleteUser/${data.type}/${data.name}`, { headers: authHeader() });
  }

  updateAccess(data) {
    return axios.post(API_URL + "/updateAccess", data, { headers: authHeader() })
  }

  getUserBoard() {
    return axios.get(API_URL + "user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
}

export default new UserService();
