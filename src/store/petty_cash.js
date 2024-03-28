import axios_object from "@/plugins/axios_local";
import router from "@/router";
import {
  defineStore
} from "pinia";

import { useUiStore } from "@/store/uiStore";

//this store is enormours and should be repatitioned when time allows
// restructure to composition api when we have time
const uiStore = useUiStore();
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2


export const usePettyCashStore = defineStore("usePettyCashStore", {
  state: () => ({
    vendors: [],

    upcomingBills: [],
    invoicesDue: [],
    accounts: [],
    accountTotals: 0,
    sub_accounts: [],
    account_owners: [],
    account_issues: [],
    account_categories: [],
    bills: [],
    bill: {},
    purchaseOrders: {},

    isAccountReceiptSaving: false,
    clearAccountReceiptForm: false,

    //clear bill forms
    clearForm: false,
    clearNewCategoryForm: false,
    clearBillGroupForm: false,
    clearBillVendorForm: false,


    clearVendorCategoryForm: false,

    //clear account forms
    clearNewAccountForm: false,
    clearNewAccountCategoryForm: false,

    billToRequest: null,
    billsTotal: 0,
    snackbar: false,
    snackbarColor: 'success',
    snackBarMessage: "Snack bar message here",


    isShowNewAccountDialog: false,
    isAccountDialogSaving: false,
    isShowNewAccountIssueDialog: false,

    //vendor 
    isShowNewVendorDialog: false,
    isStoreVendorDialogSaving: false,

    //Account Issue
    isIssueDialogSaving: false,
    accountIssueNotesTotal: 0,

    // Account Receipts 
    accountRecetNotes: [],
    accountRecetNoteTotal: 0,


    isTransfereDialogSaving: false,
    isShowNewCashTransfer: false,



    transfers: [],
    transfers_total: 0,


    //accountCategory
    isShowNewAccountCategoryDialog: false,
    isAccountCategorySaving: false,
    currentDocumentNumber: "",


    isAccountRequestSaving: false,
    isAccountReceiptSaving: false,


    // bill/Item Categories
    isShowNewBillCategoryDialog: false,
    itemCategories: [],
    isBillCategorySaving: false,

    // bill/Item Groups
    isShowNewBillGroupDialog: false,
    itemGroups: [],
    isBillGroupSaving: false,


    //update Request Status
    isRejectDialog: false,
    isUpdateRequestLoading: false,



    accountrequests: [],
    accountrequestsTotal: 0,
    accountRequest: {},


    // vendor categories 
    vendorCategories: [],
    isVendorCategorySaving: false,
    isShowNewVendorCategoryDialog: false,

    //filters
    vendor_id: localStorage.getItem("vendor_id"),
    business_info: JSON.parse(localStorage.getItem("activeBusiness")),

    sequenceQueryParam: {
      business_info: JSON.parse(localStorage.getItem("activeBusiness")),
      vendor_id: localStorage.getItem("vendor_id"),
      prefix: "AIN"
    },

    //subscriptions
    subscriptionBills: [],
    subscriptionTotals: 0,
    accountGroups: []
  }),

  actions: {
    setSnackBack(status, color, message) {
      this.snackbar = status,
        this.snackbarColor = color,
        this.snackBarMessage = message
    },


    fetchVendorCategories(params) {
      axios_object
        .get(`${v1}suppliers/categories`, {
          params
        })
        .then((response) => {
          this.vendorCategories = response.data.data;
        })
        .catch((error) => { });
    },

    saveVendorCategories(params) {
      axios_object
        .post(`${v1}suppliers/categories`,
          params
        )
        .then((response) => {
          this.isVendorCategorySaving = false;
          this.isShowNewVendorCategoryDialog = false;
          uiStore.setSnackBar(true, 'success', 'Vendor Category Saved Successfully')
          this.clearVendorCategoryForm = true,

            this.fetchVendorCategories({
              vendor_id: this.vendor_id
            })
        })
        .catch((error) => { });
    },


    storeAccountReceipt(params) {
      axios_object
        .post(`${v1}petty_cash/create-account-receipt-note`,
          params
        )
        .then((response) => {
          this.isAccountReceiptSaving = false;
          uiStore.setSnackBar(true, 'success', 'Account Receipt Saved Successfully')
          this.clearAccountReceiptForm = true

          router.push('/apps/bills/accounts/arn/list');

        })
        .catch((error) => { }).finally(() => {
          this.isAccountReceiptSaving = false;
        });
    },

    getAccountReceipt(params) {
      axios_object
        .get(`${v1}petty_cash/get-account-receipt-note`,
          { params: params }
        )
        .then((response) => {
          this.accountRecetNotes = response.data.data.data
          this.accountRecetNoteTotal = response.data.data.total
        })
        .catch((error) => { }).finally(() => {

        });
    },

    fetchVendors(params) {
      axios_object
        .get(`${v1}get_all_suppliers_list`, {
          params: params
        })
        .then((response) => {
          this.vendors = response.data.data.data;
        })
        .catch((error) => { });
    },

    saveVendor(params) {
      axios_object
        .post(`${v1}suppliers`, params)
        .then((response) => {
          this.fetchVendors()
          uiStore.setSnackBar(true, 'success', 'Vendor Saved Successfully')
          this.clearBillVendorForm = true,
            this.isShowNewVendorDialog = false;
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        })
        .finally(() => {
          this.isStoreVendorDialogSaving = false;
        });
    },


    //item categories
    getCategories(params) {
      axios_object
        .get(`${v1}vendor/get-item-categories`, {
          prams: params
        })
        .then((response) => {

          this.itemCategories = response.data.data;
        })
        .catch((error) => { });
    },


    createCategories(params) {
      axios_object
        .post(`${v1}vendor/create-item-category`, params)
        .then((response) => {
          uiStore.setSnackBar(true, 'success', 'BIll Category Saved Successfully')
          this.isShowNewBillCategoryDialog = false;
          this.getCategories({});
          this.clearNewCategoryForm = true;
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        }).finally(() => this.isBillCategorySaving = false);

    },
    //end item/categories
    // item groups
    getGroups(params) {
      axios_object
        .get(`${v1}vendor/get-item-groups`, {
          prams: params
        })
        .then((response) => {
          this.itemGroups = response.data.data;
        })
        .catch((error) => { });
    },

    createGroup(params) {
      axios_object
        .post(`${v1}vendor/create-item-group`, params)
        .then((response) => {
          uiStore.setSnackBar(true, 'success', 'BIll Group Saved Successfully')
          this.isShowNewBillGroupDialog = false;
          this.getGroups({});
          this.clearBillGroupForm = true;
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        }).finally(() => this.isBillGroupSaving = false);
    },
    //end item group 


    fetchNumberSequence(params) {
      axios_object
        .get(`${v1}petty_cash/number-sequence`, {
          params: params
        })
        .then((response) => {

          this.currentDocumentNumber = response.data.data;
        })
        .catch((error) => { });
    },


    fetchAccountOwners(params) {
      axios_object
        .get(`${v1}petty_cash/get-account-owners`, {
          params
        })
        .then((response) => {
          this.account_owners = response.data.data;
        })
        .catch((error) => { });
    },

    fetchAccountCategories(params) {
      axios_object
        .get(`${v1}petty_cash/get-main-account-categories`, {
          params: params
        })
        .then((response) => {
          this.account_categories = response.data.data;
        })
        .catch((error) => { });
    },


    fetchAccounts(params) {
      axios_object
        .get(`${v1}petty_cash/get-account-list`, {
          params: params
        })
        .then((response) => {
          this.accounts = response.data.data.data;
          this.accountTotals = response.data.data.total;

        })
        .catch((error) => { });
    },


    async fetchAccount(params) {
      return axios_object
        .get(`${v1}petty_cash/get-account/${params.id}`, {
          params
        })
        .then((response) => {
          console.log(response.data.data);
          return response.data.data
        })
        .catch((error) => {
          throw error
        });
    },

    getAccountRequest(params) {
      axios_object
        .get(`${v1}petty_cash/account-request`, {
          params: params
        })
        .then((response) => {
          this.accountrequests = response.data.data.data;
          this.accountrequestsTotal = response.data.data.total
        })
        .catch((error) => { })
        .finally(() => { });
    },


    getOrderBills(params) {
      axios_object
        .get("/vendors/purchase-orders", {
          params: params
        })
        .then((response) => {
          this.purchaseOrders = response.data.data.data;
        })
        .catch((error) => { })
        .finally(() => { });
    },


    fetchBills(params) {
      axios_object.get(`${v1}vendor/item-list-ajax`, {
        params
      }).then((response) => {
        this.bills = response.data.data.data
        this.billsTotal = response.data.data.total
      })
        .catch((error) => {

        });
    },




    async getAccountRequestById(id) {
      return axios_object.get(`${v1}petty_cash/account-request-by-id/${id}`)
        .then((response) => {
          this.accountRequest = response.data.data;
          return response.data.data
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        })
        .finally(() => {
          this.isAccountRequestSaving = false;
        });
    },


    storeAccountRequest(params) {
      axios_object
        .post(`${v1}petty_cash/account-request`, params)
        .then((response) => {
          uiStore.setSnackBar(true, 'success', 'Request Saved Successfully')
          router.push('/apps/bills/accounts/requests/list')
          this.fetchBills({
            vendor_id: this.vendor_id,
            business_id: this.business_info.id,
            status: 0,
            item_type: 2,
          })
          this.clearForm = true;

        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        })
        .finally(() => {
          this.isAccountRequestSaving = false;
        });
    },

    submitARN(params) {
      axios_object
        .post(`${v1}petty_cash/update-account-receipt-note`, params)
        .then((response) => {
          uiStore.setSnackBar(true, 'success', 'Account Receipt updated successfully')
          this.clearForm = true;
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        })
        .finally(() => {
          this.isAccountRequestSaving = false;
        });
    },




    updateAccountRequest(params, id) {
      axios_object
        .post(`${v1}petty_cash/update-account-request/${id}`, params)
        .then((response) => {
          uiStore.setSnackBar(true, 'success', 'Request Updated Successfully')
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        })
        .finally(() => {
          this.isAccountRequestSaving = false;
        });
    },



    updateRequestStatus(params) {
      axios_object
        .post(`${v1}petty_cash/update-request-status`, params)
        .then((response) => {
          uiStore.setSnackBar(true, 'success', 'Request Successfully')
          this.getAccountRequest({
            vendor_id: this.vendor_id,
            business_id: this.business_info.id,
          });
          this.isRejectDialog = false;
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
          this.isUpdateRequestLoading = false;
        })
        .finally(() => {
          this.isUpdateRequestLoading = false;
        });
    },




    getAccountFroups(params) {
      axios_object.get(`${v1}petty_cash/get-main-account-groups`, {
        params: params
      }).then((response) => {
        this.accountGroups = response.data.data
      })
        .catch((error) => {

        });
    },


    async saveAccountGroup(params) {
      return axios_object
        .post(`${v1}petty_cash/create-main-account-group`, params)
        .then((response) => {
          uiStore.setSnackBar(true, 'success', 'Group Saved Successfully')
          this.getAccountFroups({
            vendor_id: this.vendor_id,
            business_id: this.business_info.id,
          });
          return response;
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
          throw error;
        })
        .finally(() => {

        });
    },


    saveAccountCategory(params) {
      axios_object
        .post(`${v1}petty_cash/create-main-account-category`, params)
        .then((response) => {
          uiStore.setSnackBar(true, 'success', 'Category Saved Successfully')
          this.fetchAccountCategories({
            vendor_id: this.vendor_id,
            business_id: this.business_info.id,
          });
          this.isShowNewAccountCategoryDialog = false;
          this.clearNewAccountCategoryForm = true
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
          this.isAccountCategorySaving;
        })
        .finally(() => {

          this.isAccountCategorySaving = false;
        });
    },

    saveAccount(params) {
      axios_object
        .post(`${v1}petty_cash/create-main-account`, params)
        .then(() => {

          uiStore.setSnackBar(true, 'success', 'Account Saved Successfully')

          this.fetchAccounts({
            vendor_id: this.vendor_id,
            business_id: this.business_info.id,
          });
          this.isShowNewAccountDialog = false;
          this.clearNewAccountForm = true
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
          this.isAccountDialogSaving;
        })
        .finally(() => {
          this.isAccountDialogSaving = false;
        });
    },


    updateAccount(params, id) {

      axios_object
        .post(`${v1}petty_cash/update-main-account/${id}`, params)
        .then(() => {
          uiStore.setSnackBar(true, 'success', 'Account Saved Successfully')
          this.isShowNewAccountDialog = false;
          this.clearNewAccountForm = true
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
          this.isAccountDialogSaving;
        })
        .finally(() => {
          this.isAccountDialogSaving = false;
        });
    },


    getAccountIssueNote(params) {
      axios_object
        .get(`${v1}petty_cash/get-account-issue-notes`, {
          params: params
        })
        .then((response) => {
          this.account_issues = response.data.data.data;
          this.accountIssueNotesTotal = response.data.data.total;
        })
        .catch((error) => { })
        .finally(() => { });
    },

    async getAccountIssueNoteById(id) {
      return await axios_object
        .get(`${v1}petty_cash/get-account-issue-note/${id}`)
        .then((response) => {
          return response.data.data;

        })
        .catch((error) => {
          throw error
        })
        .finally(() => { });
    },




    storeAccountIssueNote(params) {
      axios_object
        .post(`${v1}petty_cash/create-account-issue-note`, params)
        .then(() => {
          uiStore.setSnackBar(true, 'success', 'Issue Note Saved Successfully')
          this.isShowNewAccountIssueDialog = false;
          router.push('/apps/bills/accounts/issues/list')
          this.getAccountIssueNote();
          this.fetchAccounts({
            vendor_id: this.vendor_id,
            business_id: this.business_info.id,
          });
          this.fetchNumberSequence(this.sequenceQueryParam);
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        })
        .finally(() => {
          this.isIssueDialogSaving = false;
        });
    },


    updateAccountIssueNote(params) {
      axios_object
        .post(`${v1}petty_cash/update-account-issue-note/${params.id}`, params)
        .then(() => {
          uiStore.setSnackBar(true, 'success', 'Issue Issue Updated Successfully')
          router.push('/apps/bills/accounts/issues/list')
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        })
        .finally(() => {
          this.isIssueDialogSaving = false;
        });
    },




    fetchVendorItems(params) {
      axios_object
        .get(`${v1}petty_cash/get-vendor-items`, {
          params
        })
        .then((response) => {
          this.upcomingBills = response.data.data.upcoming_services;
          this.invoicesDue = response.data.data.due_invoices;
        })
        .catch((error) => { });
    },


    generateVendorInvoices(params) {
      axios_object
        .get(`${v1}petty_cash/generate-vendor-invoices`, {
          params,
        })
        .then((response) => {
          this.fetchVendorItems({});
        })
        .catch((error) => { });
    },

    async getBill(params) {
      return axios_object
        .get(`${v1}vendor/get-bill/` + params.id)
        .then((response) => {
          this.bill = response.data.data;
          this.bill_detail = response.data.data.bill_details;
          return response.data.data;
        })
        .catch((error) => {
          throw error;
        });
    },

    getAccountTransfers(params) {
      axios_object
        .get(`${v1}petty_cash/get-account-transfer`, {
          params: params
        })
        .then((response) => {

          this.transfers = response.data.data.data;
          this.transfers_total = response.data.data.total;
        })
        .catch((error) => {

        }).finally(() => {

        });
    },



    createNewAccountTransfer(params) {
      axios_object
        .post(`${v1}petty_cash/post-account-transfer`, params)
        .then((response) => {
          uiStore.setSnackBar(true, 'success', 'Transfer Saved Successfully')
          router.push("/apps/bills/accounts/transfers/list")
        })
        .catch((error) => {
          uiStore.setSnackBar(true, 'error', error)
        }).finally(() => {
          this.isTransfereDialogSaving = false;
        });
    },

    getSubscription(params) {
      axios_object
        .get(`${v1}petty_cash/get-bill-subacriptions`, { params: params })
        .then((response) => {
          this.subscriptionBills = response.data.data.data;
          this.subscriptionTotals = response.data.data.total;
        })
        .catch((error) => { })
        .finally(() => { });
    },

    async storeSubscription(params) {
      return axios_object
        .post(`${v1}petty_cash/store-bill-subacription`, params)
        .then((response) => {

          this.getSubscription();
          return response
        })
        .catch((error) => { throw error })
        .finally(() => { });
    },

    async updateSubscription(params) {
      return axios_object
        .post(`${v1}petty_cash/update-bill-subacription/${params.subsription_id}`, params)
        .then((response) => {
          this.getSubscription();
          return response
        })
        .catch((error) => { throw error })
        .finally(() => { });
    },

  },
});
