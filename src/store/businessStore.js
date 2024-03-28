import axios_lite from "@/plugins/axios_lite";
import axios_object from "@/plugins/axios_local";
import { defineStore } from "pinia";
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2
export const useBusinessStore = defineStore("useBusinessStore", {
  state: () => ({
    isDialogSaving: false,
    isShowEditCompanyDialog: false,
    bisinesses: [],
    divsions: [],
    locations: [],
    activebusness: {},
  }),

  actions: {
    // Fetch Business data
    fetchBusinesses(params) {
      axios_lite
        .get(`${v1}businesses`, {
          params
        })
        .then((response) => {
          this.bisinesses = response.data.data;
        })
        .catch((error) => {
          //   console.error(error);
        });
    },
    fetchDivisions(params) {
      axios_lite
        .get(`${v1}list_division`, {
          params
        })
        .then((response) => {
          this.divsions = response.data;
        })
        .catch((error) => {
          //   console.error(error);
        });
    },
    fetchLocations(params) {
      axios_lite
        .get(`${v1}list_location`, {
          params
        })
        .then((response) => {
          this.locations = response.data;
        })
        .catch((error) => {
          //   console.error(error);
        });
    },

    fetchDefaultBusiness(params) {
      axios_object
        .get(`${v1}default-business`, {
          params
        })
        .then((response) => {
          localStorage.setItem("activeBusiness", JSON.stringify(response.data.data));
          this.activebusness = response.data.data;
        })
        .catch((error) => {
          //   console.error(error);
        });
    },

    createNewBusiness(formData) {
      axios_lite
        .post(`${v1}business`, formData)
        .then((response) => {
          this.bisinesses = response.data.data.data;
        })
        .catch((error) => {
          //   console.error(error);
        })
        .finally(() => {
          this.fetchDefaultBusiness({});
          this.fetchBusinesses({});
          this.isDialogSaving = false;
        });
    },
    createNewDivision(formData) {
      axios_lite
        .post(`${v1}store_new_division`, formData)
        .then((response) => {
          this.divsions = response.data.data;
        })
        .catch((error) => {
          //   console.error(error);
        })
        .finally(() => {
          this.fetchDivisions({});
          this.isDialogSaving = false;
        });
    },
    createNewLocation(formData) {
      axios_lite
        .post(`${v1}branches`, formData)
        .then((response) => {
          this.locations = response.data.data;
        })
        .catch((error) => {
          //   console.error(error);
        })
        .finally(() => {
          this.fetchDivisions({});
          this.isDialogSaving = false;
        });
    },
    updateBusiness(formData) {
      axios_lite
        .post(`${v1}update_business`, formData)
        .then((response) => {
          this.bisinesses = response.data.data.data;
        })
        .catch((error) => {
          //   console.error(error);
        })
        .finally(() => {
          this.fetchDefaultBusiness({});
          this.fetchBusinesses({});
          this.isShowEditCompanyDialog = false;
          this.isDialogSaving = false;
        });
    },
    updateDivision(formData) {
      axios_lite
        .post(`${v1}/update_division`, formData)
        .then((response) => {
          this.divsions = response.data.data;
        })
        .catch((error) => {
          //   console.error(error);
        })
        .finally(() => {
          this.fetchDivisions({});
          this.isShowEditCompanyDialog = false;
          this.isDialogSaving = false;
        });
    },
    updateLocation(formData) {
      axios_lite
        .post(`${v1}/update_location`, formData)
        .then((response) => {
          this.locations = response.data.data;
        })
        .catch((error) => {
          //   console.error(error);
        })
        .finally(() => {
          this.fetchDivisions({});
          this.isShowEditCompanyDialog = false;
          this.isDialogSaving = false;
        });
    },

    setDefaultBusiness(formData) {
      axios_object
        .post(`${v1}business/set-default`, formData)
        .then((response) => {
          
        })
        .catch((error) => {
          //   console.error(error);
        })
        .finally(() => {
          this.fetchDefaultBusiness({});
          this.fetchBusinesses({});
          this.isDialogSaving = false;
        });
    },

  },
});
