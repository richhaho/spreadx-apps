import axios from "axios";

const base_api_url =
    import.meta.env.VITE_BASE_PROXY_KEY;
const kochToken = import.meta.env.VITE_AUTH_TOKEN_KOCH;
const authToken = localStorage.getItem("authToken")
const authId = localStorage.getItem("authId")

const axios_koch = axios.create({
    baseURL: "/koch",
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': "*",
        // 'authId': authId,
        'authAccessToken': kochToken
    }
});



// axios_koch.defaults.headers.post["Accepts"] = "application/json";
// axios_koch.defaults.headers.post["Content-Type"] = "multipart/form-data";
// axios_koch.defaults.headers.post["Access-Control-Allow-Credentials"] = "true"
// axios_koch.defaults.headers.post["Accepts"] = "application/json";
// axios_koch.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
// axios_koch.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
// axios_object.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

// Add a request interceptor
axios_koch.interceptors.request.use(
    function (config) {

        const authToken2 = kochToken
        // const authId2 = localStorage.getItem("authId")
        // console.log(axios_koch.headers)
        // axios_koch.headers.post["authId"] = authId2;
        // axios_koch.headers.post["authToken"] = authToken2;

        // axios_koch.headers["authId"] = authId2;
        axios_koch.defaults.headers["authAccessToken"] = authToken2;
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// // Add a response interceptor
// axios_koch.interceptors.response.use(
//     function (response) {
//         // console.dir(`InterceptResponseddddd ${response}`);
//         return response;
//     },
//     function (error) {

//         return Promise.reject(error);
//     }
// );


export default axios_koch;
