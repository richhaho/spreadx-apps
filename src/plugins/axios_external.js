import axios from "axios";

const base_api_url = import.meta.env.VITE_QLINE_BASE_URL;
const authIdUpdated = localStorage.getItem("authId");
const authToken = localStorage.getItem("authToken");

const tanafToken = import.meta.env.VITE_AUTH_TOKEN_TANAF;

const axios_demo = axios.create({
  baseURL: "/demo",
  withCredentials: false,
  headers: {
    'authId': authIdUpdated,
    'authAccessToken': tanafToken
  }
});



axios_demo.defaults.headers.post["Accepts"] = "application/json";
axios_demo.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios_demo.defaults.headers.post["Access-Control-Allow-Credentials"] = "true"
axios_demo.defaults.headers.post["Accepts"] = "application/json";

// Add a request interceptor
axios_demo.interceptors.request.use(
  function (config) {

    const authId = localStorage.getItem("authId");
    const updateAuthToken = tanafToken;


    axios_demo.defaults.headers.common["authId"] = authId;
    axios_demo.defaults.headers.common["authAccessToken"] = tanafToken;

    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios_demo.interceptors.response.use(
  function (response) {
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


export default axios_demo;
