import { currentAppRoute } from '@/helpers/helpers';
import axios_demo from "@/plugins/axios_demo";
import axios_lite from "@/plugins/axios_lite";
import axios_object from "@/plugins/axios_local";

import {
  defineStore
} from "pinia";
import router from "../router/index";
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2

export const useAuthStore = defineStore("useAuthStore", {
  state: () => ({
    button_loading_state: false,
    authentication_error_state: [],
    authentication_success_state: [],
    activebusness: {}
    // authenticated_user: {},
  }),

  getters: {
    // get_authentication_error_state(state) {
    //   return state.authentication_error_state;
    // },
    // get_authentication_success_state(state) {
    //   return state.authentication_success_state;
    // },
    // get_authenticated_user(state) {
    //   return state.authenticated_user;
    // },
  },

  actions: {
    delayed_navigation() {
      setTimeout(() => {
        router.push("/");
      }, 500);
    },



    verifyToken(formData) {
      axios_lite
        .post(`${v1}verify-token`, formData)
        .then((res) => {

          if (res.status === 422) {
            this.authentication_error_state = res.message.data.errors.message;
          }
          if (res.data.status === true) {
            this.authentication_success_state = ["Token Verified successfully"];
            this.authentication_success_state = [],
              
              this.updatePassword(formData)
              
              // router.push("/update-password");
            // setTimeout(() => {
            //   (
            //     this.authentication_success_state = []),
            //     router.push("/login");
            // }, 1000);
          } else {
            this.authentication_error_state = [res.data.errors.message];
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.authentication_error_state =
              error.response.data.errors.message.split(",");
          }
        })
        .finally((state) => {
          this.button_loading_state = false;
        });
    },



    registerUser(formData) {
      
      axios_lite
        .post(`${v2}auth/register`, formData)
        .then((res) => {
          if (res.data.status === 422) {
            this.authentication_error_state = [res.data.errors.message]
          }
          if (res.data.status === true) {
            this.authentication_success_state = ["You registered successfully"];
          
     
            // this.verifyToken({ token: res.data.data.token})

            setTimeout(() => {
              (this.authentication_success_state = []),
                router.push("/update-password");
            }, 2000);
          } else {
            this.authentication_error_state = [res.data.errors.message];
            // console.log(res.data.errors.message);
          }
        })
        .catch((error) => {

          // console.log(error.status);

          // if (error.response.status === 422) {
          //   this.authentication_error_state =
          //     error.response.data.errors.message.split(",");
          // }

        })
        .finally((state) => {
          // console.log(authentication);
          this.button_loading_state = false;
        });
    },






    demoLogin() {

      axios_demo.post(('/login'), {
        phone: '565656565',
        password: '12345678',
        vendor_id: 1
      }).then((response) => {
        console.log(response)

        localStorage.setItem("authToken", response.data.authToken)
        localStorage.setItem("authId", response.data.authId)

      }).finally(() => {
        // this.getDemoProducts();
      });
    },



    fetchDefaultBusiness(params) {
      axios_object.get(`${v2}default-business`, {
        params
      })
        .then((response) => {
          localStorage.setItem(
            "activeBusiness",
            JSON.stringify(response.data.data)
          );

          this.activebusness = JSON.parse(
            localStorage.getItem("activeBusiness")
          );
        })
        .catch((error) => {
          //   console.error(error);
        });
    },
    login_route(formData) {

    },
    async login_user(formData) {

      await axios_lite.post(`${v2}auth/login`, formData)
        .then((res) => {
          if (res.data.status === 422) {
            this.authentication_error_state = [res.data.errors.message]
          }
          if (res.data.status === true) {
            this.authentication_success_state = ["Login successfully"];

            localStorage.setItem("accessToken", res.data.data.access_token);
            localStorage.setItem("vendor_id", res.data.data.vendor_id);
            localStorage.setItem("activeBusiness", JSON.stringify(res.data.data.default_business_id));
            localStorage.setItem("refreshToken", res.data.data.refresh_token);
            localStorage.setItem("expires_in", res.data.data.expires_in);
            localStorage.setItem("business_info", JSON.stringify(res.data.data.business_info));
            localStorage.setItem("userData", JSON.stringify(res.data.data.user_profile));
            this.activebusness = JSON.stringify(res.data.data.default_business_id);

            

            setTimeout(() => {
              this.authentication_success_state = [],
                this.fetchDefaultBusiness();
              router.push(currentAppRoute());
            }, 2000);
          } else {

            this.authentication_error_state = [res.data.errors.message];
          }
        })
        .catch((error) => { })
        .finally((state) => {
          console.log("Finished")
          this.demoLogin()
          this.button_loading_state = false;
          this.fetchDefaultBusiness();
        });
    },

    updatePassword(formData) {
      axios_lite
        .post(`${v1}verify-business`, formData)
        .then((res) => {
          
          if (res.status === 422) {
            this.authentication_error_state = res.message.data.errors.message;
          }
          if (res.data.status === true) {
            this.authentication_success_state = ["Updated successfully"];
            setTimeout(() => {
              (this.authentication_success_state = []), router.push("/login");
            }, 1000);
          } else {
            this.authentication_error_state = [res.data.errors.message];
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.authentication_error_state =
              error.response.data.errors.message.split(",");
          }
        })
        .finally((state) => {
          this.button_loading_state = false;
        });
    },




    get_user: ({
      commit
    }) => {
      axios_object.authenticated_request_instance
        .get(`${v1}get_user`)
        .then((res) => {
          if (res.status === 200) {
            this.update_authenticated_user = res.data;
          } else {
            router.push("/");
          }
        });
    },

    log_out: () => {
      localStorage.clear("accessToken");
      localStorage.clear("refreshToken");
      localStorage.clear("userData");
      localStorage.clear("expires_in");
      localStorage.clear("intededUrl");

    
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      // const access_token = localStorage.getItem("access_token");
      // axios_object.un_authenticated_request_instance.defaults.headers.common[
      //   "Authorization"
      // ] = "Bearer " + access_token;
      // axios_object.un_authenticated_request_instance
      //   .post("log_out")
      //   .then((res) => {
      //     if (res.status === 200) {
      //       localStorage.clear("access_token");
      //       localStorage.clear("refresh_token");
      //       localStorage.clear("expires_in");
      //       this.authenticated_user = {};
      //       this.authentication_success_state = "Logout successfully";
      //       setTimeout(() => {
      //         router.push("/");
      //       }, 2000);
      //     } else {
      //       setTimeout(() => {
      //         router.push("/");
      //       }, 2000);
      //     }
      //   })
      //   .catch((error) => {
      //     if (error.response.status === 401) {
      //       this.authentication_error_state =
      //         "An error occurred please try again later";
      //     }
      //   })
      //   .finally(() => {
      //     this.authentication_error_state = "";
      //     this.authentication_success_state = "";
      //   });
    },
  },
});
