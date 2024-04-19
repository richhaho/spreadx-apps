import axios_koch from '@/plugins/axios_koch';
import axios_lite from '@/plugins/axios_lite';
import { defineStore } from "pinia";
import { ref } from 'vue';
const tanafToken = import.meta.env.VITE_AUTH_TOKEN_TANAF;

const v1 =
  import.meta.env.v1
export const useUiStore = defineStore("useUiStore", () => {
  const qlineUrl = import.meta.env.VITE_API_V1;
  const showCartDetails = ref(false);
  const cartItems = ref(JSON.parse(localStorage.getItem('cart')) ?? []);
  const currentStep = ref(0);
  const snackbar = ref(false);
  const snackbarColor = ref('success');
  const snackBarMessage = ref("Snack bar message here");
  const order_no = ref(localStorage.getItem('order_no') ?? null);
  const orderItems = ref([]);
  const tickets = ref([]);
  const suppliers = ref([]);

  function clearCartItem() {
    localStorage.setItem('cart', JSON.stringify([]))
  }

  function setSnackBar(status, color, message) {
    snackbar.value = status,
    snackbarColor.value = color,
    snackBarMessage.value = message
  }
  
  function updateOrderNo() {
    axios_koch
      .get(`${qlineUrl}document_sequence`, {
        headers: {
          "authId": localStorage.getItem("authId"),
          "authToken": localStorage.getItem("authToken"),
          "Accept": "Application/json",
        },
      })
      .then((response) => {

            const salesOrderObject = response.data.result.find(
                (item) => item.document_name === "sales_order"
            );    
            localStorage.storeItem("order_no", salesOrderObject.prefix+salesOrderObject.running_no);

            order_no.value = salesOrderObject.prefix+salesOrderObject.running_no;
        })
        .catch((error) => {});
    }
    function getOrderItems(supplier_id){
      return axios_lite
      .get(`${qlineUrl}get_store_order`,{ 
        params:{
          supplier_id: supplier_id
        }
      })
      .then((response) => {
        orderItems.value = response.data.orders.flatMap(order => order.order_list);
      })
      .catch((error) => { });
    }
  function getTickets(supplier_id) {
    axios_lite
      .get(`${qlineUrl}get_tickets`, {
        params: {
          supplier_id: supplier_id
        }
      })
      .then((response) => {
        // console.log(response.data.data.data)
        tickets.value = response.data.data;
      })
      .catch((error) => { });
  }

    function getSuppliers(params){
        axios_lite
        .get(`v1/get_suppliers`, {
          params
        })
        .then((response) => {
            suppliers.value = response.data.data;
        })
        .catch((error) => {});
    }
    return {
        showCartDetails,
        cartItems,
        currentStep,
        snackbar,
        snackbarColor,
        snackBarMessage, 
        order_no,
        orderItems,
        tickets,
        suppliers,
        setSnackBar, 
        updateOrderNo,
        getOrderItems,
        getSuppliers,
        getTickets,
        clearCartItem
  };
});

