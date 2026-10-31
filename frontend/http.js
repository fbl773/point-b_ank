// Centralized Axios Configuration
// You can change your IP here if needed.
// Note: 127.0.0.1 refers to `localhost`
import axios from "axios";

// To be able to import var
export const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

const http = axios.create({
	baseURL: baseURL,
	withCredentials: true,
});

http.interceptors.request.use(config => {
	config.headers.Authorization =`Bearer ${localStorage.getItem("token") || "NONE"}`;
	return config;
})


export const http_custom = (custom_headers) => {
	custom_headers["Authorization"] = `Bearer ${localStorage.getItem("token") || "NONE"}`
	console.log("HEADERS: ", custom_headers["Authorization"]);
	return axios.create({
		headers: custom_headers,
		baseURL: baseURL,
		withCredentials: true
	});
}

export default http;
