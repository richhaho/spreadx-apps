import axios_lite from "@/plugins/axios_lite";
import {
  setupLayouts
} from "virtual:generated-layouts";
const v2 =
  import.meta.env.VITE_API_V2

const v1 =
  import.meta.env.VITE_API_V1
import {
  createRouter,
  createWebHistory
} from "vue-router";
import routes from "~pages";
import {
  isUserLoggedIn
} from "./utils";
const router = createRouter({
  props: true,
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [...setupLayouts(routes)],
});

const isAuthenticated = false;
function guestLogin(url){
  axios_lite.post(`${v2}auth/login`, {
    email: "guest@gmail.com",
    username: "guest",
    phone: 12345678,
    password: 12345678,
    type: "guest"
  })
  .then((res) => {
    if (res.data.status === true && !localStorage.getItem('userData')) {
      localStorage.setItem("accessToken", res.data.data.access_token);
      localStorage.setItem("vendor_id", res.data.data.vendor_id);
      localStorage.setItem("activeBusiness", JSON.stringify(res.data.data.default_business_id));
      localStorage.setItem("refreshToken", res.data.data.refresh_token);
      localStorage.setItem("expires_in", res.data.data.expires_in);
      localStorage.setItem("business_info", JSON.stringify(res.data.data.business_info));
      
      localStorage.setItem("userData", JSON.stringify(res.data.data.user_profile));

      // const serverUserAbilities = res.data.data.user_profile.roles[0].permissions.map((ability) => {
      //   return {
      //     action: ability.name,
      //     subject: ability.subject
      //   }
      // })
      console.log(55)
      console.log("1=>"+url)


      // ability.update(serverUserAbilities)
      // localStorage.setItem('userAbilities', JSON.stringify(serverUserAbilities))

      // check if user needs to be atached to a vendor
      // ====get the intended url
      // ====check the supplier part in the intented url
      // ====if true atach this customer to the supplier in the db
      // ====proceed to the intended url
      // ====if false proceed to home

      const intendedUrl = url;

      if (intendedUrl) {
        if (intendedUrl == "/" || intendedUrl == null){
          router.push("/");
        }else {
          const intededUrlComponents = intendedUrl.split('/');
          const supplierComponent = intededUrlComponents[2];
          if (supplierComponent === 'suppliers') {
            
            const supplierId = intededUrlComponents[3];
            const userToken = intendedUrl.split('token=')[1] //to.query.token;
            console.log(userToken);
            verifyCustomer(supplierId, userToken, "/apps/suppliers/" + supplierId + "/products")
            // send the atachement here
          } else {
            router.push("/apps/suppliers/" + supplierId + "/products");
          }
        }
      } else {

        if (intendedUrl) {
          router.push(intendedUrl)
        } else {

          router.push("/");
        }
      }


    } else if (res.data.status == true && localStorage.getItem('userData')) {
      const intendedUrl = localStorage.getItem('intededUrl')
      if (intendedUrl) {
        router.push(intendedUrl)
      } else {
        router.push("/");
      }

    }
  })
  .catch((error) => { })
  .finally((state) => {
  });
}
function verifyCustomer(supplierId, code, intendedUrl) {
  // router.push("/"); //comment this line and uncomment the block bellow after the implementation
  axios_lite.get(`${v1}verify_customer`, {
    params: {
      supplier_id: supplierId,
      code: code,
    },
    headers: {
      accessToken: localStorage.getItem("accessToken"),
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  })
  .then((res) => {
    if (res.data.status == false) {
      router.push("/");
    }
    if (res.data.status === true) {
      localStorage.setItem('intededUrl', null)
      router.push('/apps/suppliers/' + res.data.supplier_id + '/products');
    }
  }).catch((error) => {
    router.push("/");
  })
}
router.beforeEach(async (to, from) => {
  const isAuthenticated = isUserLoggedIn();
  const supplier_id = to.params.supplier_id || null;
  if (supplier_id) {
    unAuthenticatedRoutes.push(`/apps/suppliers/${supplier_id}/products`);
  }
  const unAuthenticatedRoutes = [
    "login",
    "verify",
    "account_verification",
    "password_otp",
    "two_factor",
    "reset_password",
    "register",
    "update-password",
    "forgot-password",
  ];
  

  const isUthenticatable = !unAuthenticatedRoutes.includes(to.name);






  if (isUthenticatable) {


    if (
      // make sure the user is authenticated
      !isAuthenticated &&
      // ❗️ Avoid an infinite redirect
      to.name !== "login"
    ) {
      if (
        to.fullPath.startsWith("/apps/suppliers/") &&
        to.fullPath.includes("/products")
      ) {
        localStorage.setItem('intededUrl', to.fullPath);
        guestLogin(to.fullPath);
        return {
          name: `/apps/suppliers/${supplier_id}/products`
        };
      } else {
        // redirect the user to the login page and set the inteded url here

        const invalidIntededUrls = [
          "/login",
          "/verify",
          "/password_otp",
          "/two_factor",
          "/reset_password",
          "/register",
          "/account_verification",
          "/update-password",
          "/forgot-password",
        ]

        if (!invalidIntededUrls.includes(to.fullPath)) {
          localStorage.setItem('intededUrl', to.fullPath);

          // const intendedUrl = localStorage.getItem('intededUrl');
          // if (intendedUrl) {
          //   const intededUrlComponents = intendedUrl.split('/');
          //   const supplierComponent = intededUrlComponents[2];
          //   // if (supplierComponent === 'suppliers') {
          //   //   const supplierId = intededUrlComponents[3];
          //   //   const userToken = intendedUrl.split('token=')[1] //to.query.token;
          //   //   // send the atachement here
          //   // }
          // }
        }
        return {
          name: "login"
        };
      }
    } else {
      if (to.name === "login" && isAuthenticated) {

        return {
          name: "index"
        };
      }
    }
  } else {
    if (isAuthenticated && to.name !== "login") {
      
      
      const intendedUrl = localStorage.getItem('intededUrl')
      if (intendedUrl) {
        router.push(intendedUrl)
      } else {
        router.push(to.fullPath);
      }
      
      
      
      
    }
    if (to.name === "login" && isAuthenticated) {

      if (
        to.fullPath.startsWith("/apps/suppliers/") &&
        to.fullPath.includes("/products")
      ) {
        localStorage.setItem('intededUrl', to.fullPath);
        guestLogin(to.fullPath);
        return {
          name: `/apps/suppliers/${supplier_id}/products`
        };
      } else {
        const intendedUrl = localStorage.getItem('intededUrl')
        if (intendedUrl) {
          router.push(intendedUrl)
        } else {
          return {
            name: "index"
          };
        }
      }
    }
  }
});

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router;
