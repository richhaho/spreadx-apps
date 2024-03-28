import axios from "axios";

const base_api_url =
    import.meta.env.VITE_BASE_PROXY_KEY;
const tanafToken = import.meta.env.VITE_AUTH_TOKEN_TANAF;
const authToken = localStorage.getItem("authToken")
const authId = localStorage.getItem("authId")

const axios_demo = axios.create({
    baseURL: "/demo",
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': "*",
        // 'authId': authId,
        'authAccessToken': tanafToken
    }
});



// axios_demo.defaults.headers.post["Accepts"] = "application/json";
// axios_demo.defaults.headers.post["Content-Type"] = "multipart/form-data";
// axios_demo.defaults.headers.post["Access-Control-Allow-Credentials"] = "true"
// axios_demo.defaults.headers.post["Accepts"] = "application/json";
// axios_demo.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
// axios_demo.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
// axios_object.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

// Add a request interceptor
axios_demo.interceptors.request.use(
    function (config) {

        const authToken2 = tanafToken
        // const authId2 = localStorage.getItem("authId")
        // console.log(axios_demo.headers)
        // axios_demo.headers.post["authId"] = authId2;
        // axios_demo.headers.post["authToken"] = authToken2;

        // axios_demo.headers["authId"] = authId2;
        axios_demo.defaults.headers["authAccessToken"] = authToken2;
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// // Add a response interceptor
// axios_demo.interceptors.response.use(
//     function (response) {
//         // console.dir(`InterceptResponseddddd ${response}`);
//         return response;
//     },
//     function (error) {

//         return Promise.reject(error);
//     }
// );


export default axios_demo;
