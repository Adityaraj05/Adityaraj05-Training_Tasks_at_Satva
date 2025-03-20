import axios, { AxiosRequestConfig } from "axios";

// const endPoint = process.env.REACT_APP_API_ENDPOINT || "";
const endPoint: string = import.meta.env.VITE_APP_URL;


const apiConfig = (isFormData: boolean = false): AxiosRequestConfig => ({
    headers: {
        Authorization: localStorage.getItem("BearerToken")
            ? `Bearer ${localStorage.getItem("BearerToken")}`
            : "",
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
});

const apiService = {
    get: <T>(url: string, params: object = {}): Promise<T> =>
        axios.get<T>(`${endPoint}${url}`, { params, ...apiConfig() }).then((res) => res.data),

    post: <T>(url: string, data: object, isFormData: boolean = false): Promise<T> =>
        axios.post<T>(`${endPoint}${url}`, data, apiConfig(isFormData)).then((res) => res.data),

    put: <T>(url: string, data: object, isFormData: boolean = false): Promise<T> =>
        axios.put<T>(`${endPoint}${url}`, data, apiConfig(isFormData)).then((res) => res.data),

    delete: <T>(url: string): Promise<T> =>
        axios.delete<T>(`${endPoint}${url}`, apiConfig()).then((res) => res.data),
};

export default apiService;
