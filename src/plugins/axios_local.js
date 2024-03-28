import axios from "axios";
import { ref } from "vue";
const base_api_url = import.meta.env.VITE_BASE_PROXY_KEY;
const appMode = import.meta.env.VITE_APP_MODE
const business_info = ref(localStorage.getItem("activeBusiness"));
const vendor_id = ref(localStorage.getItem("vendor_id"));

const axios_object = axios.create({
  baseURL: "/api",
  // baseURL: appMode === "local" ? "http://localhost/api/spreadbills" : "/api",
  // withCredentials: false,
  params: localStorage.getItem("activeBusiness") !== "undefined" ? { business_id: JSON.parse(localStorage.getItem("activeBusiness"))? JSON.parse(localStorage.getItem("activeBusiness")).id: 0 } : {},
});

const access_token = localStorage.getItem("accessToken");

axios_object.defaults.headers.post["Accepts"] = "application/json";
axios_object.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios_object.defaults.headers.post["Access-Control-Allow-Credentials"] = "true"
axios_object.defaults.headers.post["Accepts"] = "application/json";
axios_object.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios_object.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
// axios_object.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

// Add a request interceptor
axios_object.interceptors.request.use(
  function (config) {
    const access_token = localStorage.getItem("accessToken");

    axios_object.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    // config.params['business_id'] = business_info.value.id;

    // Do something before request is sent  
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios_object.interceptors.response.use(
  function (response) {


    // console.dir(`InterceptResponse ${JSON.stringify(response)}`);


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



export default axios_object;
