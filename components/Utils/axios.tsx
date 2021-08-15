import axios from "axios";

const serverUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
const instance = axios.create({
  baseURL: serverUrl,
});
instance.interceptors.request.use(
  async function (config) {
    const accessToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export const axiosInterceptor = () => {
  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (errorResponse) => {
      return errorResponse.response.data;
    }
  );
};

const axiosService = {
  get: (endPoint: string, headers = {}) => {
    const config = { params: {}, headers: {} };
    if (!endPoint) {
      throw Error("endPoint is required params");
    } else {
      config.headers = headers;
      return instance.get(endPoint, config);
    }
  },
  post: (endPoint: string, data: any, headers = {}) => {
    if (!(endPoint || !data)) {
      throw Error("endPoint and data are required params");
    }
    return instance.post(endPoint, data, { headers });
  },
  put: (endPoint: string, data: any, headers = {}) => {
    if (!(endPoint || !data)) {
      throw Error("endPoint and data are required params");
    }
    return instance.put(endPoint, data, { headers });
  },
  delete: (endPoint: string, data: any, headers = {}) => {
    if (!endPoint) {
      throw Error("endPoint is required params");
    } else {
      return instance.delete(endPoint, { data: data, headers: headers });
    }
  },
};

export default axiosService;
