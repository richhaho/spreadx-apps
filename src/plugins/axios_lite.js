import axios from "axios";

const base_api_url =
  import.meta.env.VITE_BASE_URL || "https://dev.spread.ae/lite/api";
const access_token = localStorage.getItem("accessToken");

const axios_lite = axios.create({
  baseURL: "/lite", //  "/lite"
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': "*"
  }
});



axios_lite.defaults.headers.post["Accepts"] = "application/json";
axios_lite.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios_lite.defaults.headers.post["Access-Control-Allow-Credentials"] = "true"
axios_lite.defaults.headers.post["Accepts"] = "application/json";
axios_lite.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios_lite.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
// axios_object.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

// Add a request interceptor
axios_lite.interceptors.request.use(
  function (config) {
    const access_token = localStorage.getItem("accessToken");

    axios_lite.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios_lite.interceptors.response.use(
  function (response) {
    const access_token = localStorage.getItem("accessToken");

    axios_lite.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    // console.dir(`InterceptResponseddddd ${response}`);
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // const errorCode = error.response.status;
    // console.log(access_token);
    // if (errorCode === 401) {
    //   localStorage.clear("accessToken");
    //   localStorage.clear("userData");
    //   router.push("/login");
    // }
    // console.log(`Errorddddd ${JSON.stringify(error.response)}`);
    return Promise.reject(error);
  }
);


export default axios_lite;
