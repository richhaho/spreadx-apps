import axios_object from "@/plugins/axios_local";
import { defineStore } from "pinia";
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2
export const usePayBillStore = defineStore("usePayBillStore", {
  actions: {
    fetchVendorDues(params) {
      return axios_object.get(`${v1}/petty_cash/get-vendor-items`, { params });
    },

    createBillPayment(params) {
      axios_object
        .post(`${v1}/petty_cash/create-account-issue-note`, params)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    },
  },
});
