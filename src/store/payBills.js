import axios_object from "@/plugins/axios_local";
import { defineStore } from "pinia";
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2
export const usePayBillStore = defineStore("usePayBillStore", {

  state: () => {
    return {
      billPaymentList :[],
    }
  },

  actions: {
    fetchVendorDues(params) {
      return axios_object.get("/petty_cash/get-vendor-items", { params });
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
    getBillPayments(params) {
      axios_object
        .get(`${v1}/petty_cash/get-account-issue-notes`, params)
        .then((response) => {
          this.billPaymentList = response.data.data;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    },
  },
});
