import axios from "axios";

const endPoint = "http://localhost:3000";

const apiConfig = (flag = false) => {
  if (localStorage.getItem("accessToken")) {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": flag ? "multipart/form-data" : "application/json",
      },
    };
  }
  return {};
};

export const getApi = (url: string, params?: any) => {
  return axios.get(`${endPoint}${url}`, { params, ...apiConfig() });
};

export const postApi = (url: string, apiData?: any) => {
  return axios.post(`${endPoint}${url}`, apiData, apiConfig());
};

export const putApi = (url: string, apiData: any) => {
  return axios.put(`${endPoint}${url}`, apiData, apiConfig());
};

export const deleteApi = (url: string) => {
  return axios.delete(`${endPoint}${url}`, apiConfig());
};
