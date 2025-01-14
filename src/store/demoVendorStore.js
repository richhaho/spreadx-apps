import axios_lite from '@/plugins/axios_lite';
import router from "../router/index";
const qlineUrl = import.meta.env.VITE_API_V1
const authAccessToken = import.meta.env.VITE_AUTH_TOKEN_TANAF

export const useDemoVendorStore = defineStore("useDemoVendorStore", {
  state: () => ({
    products: ref([]),
    orders: ref([]),
    delivery_slots: ref([]),
    promotions: ref([]),
    account_receipt_note: ref([]),
    isAccountReceiptSaving : ref(false),
    newOffer: ref(''),
    category: ref(''),
    brand: ref(''),
    price: ref(0),
    payment_methods: ref([]),
    customer: ref({})
  }),

  getters: {

  },

  actions: {
    delayed_navigation() {
      setTimeout(() => {
        router.push("/");
      }, 500);
    },
    getPaymentMethods(){
      axios_lite.get('v2/payment-methods').then((response) => {
        this.payment_methods = response.data.data;
      });
    },
    storeOrder(business_id, payload){
      /* payload format
      {
        "customer_name": "bot#65f2e1f2234a5",
        "customer_email": "seyedaliakbar577@gmail.com",
        "address": "dsds",
        "notes": null,
        "product_id": "5226,5225,5223",
        "qty": "1,1,1",
        "price": "57,57,115",
        "batch_no": ",,",
        "unit": "63,63,63",
        "supplier_id": "XhabUF4C",
        "delivery_slot_id": 0,
        "business_id": "52"
        }
      */
        
      axios_lite.post('v1/store_order?business_id=' + business_id, payload).then((response) => {
        const order = response.data.order;
        localStorage.setItem("orderDetail", JSON.stringify(order));
      });
    },
    fetchOrders(business_id, supplier_id = '3GTAbmAx'){
      axios_lite.get('v1/get_store_order?business_id=' + business_id + '&supplier_id=' + supplier_id).then((response) => {
        this.orders = response.data.orders;
      });
    },
    fetchDeliverySlot(supplier_id = '3GTAbmAx'){
      axios_lite.get('v1/delivery_spots?supplier_id=' + supplier_id).then((response) => {
        this.delivery_slots = response.data.data;
      });
    },
    getCustomer(supplier_id = '3GTAbmAx'){
      axios_lite.get('v1/view_customer?supplier_id=' + supplier_id).then((response) => {
        this.customer =  response.data.message[0]
      });
    },
    fetchAllProducts(business_id){
      axios_lite.get('v1/get_vendors_products?business_id=' + business_id + '&supplier_id=OP8vVIvL').then((response) => {
        this.products = response.data.products;
      });
    },
    fetchProducts(business_id, supplier_id){
      axios_lite.get('v1/get_vendors_products?business_id=' + business_id + '&supplier_id=' + supplier_id).then((response) => {
        this.products = response.data.products;
   
      });
      // axios_koch
      //   .get(`${qlineUrl}get_product_list` ,{
      //       params:{
      //       "vendor_id": localStorage.getItem('supplier_id'),
      //       }
      //   })
      //   .then((res) => {
      //     if (res.data.status === 422) {
      //       this.authentication_error_state = [res.data.errors.message]
      //     }
          
      //     if (res.data.status === true) {
      //       this.products = res.data;
      //     } else {
      //       this.authentication_error_state = [res.data.errors.message];
      //     }
      //   })
      //   .catch((error) => {});
    },
    
    login_user(formData) {
      axios_demo
        .post(`${qlineUrl}generate-access-token`, {
            'auth_id': "3",
        })
        .then((res) => {
            localStorage.removeItem("authId");  
            localStorage.removeItem("authToken");  
            if (res.data.status === 422) {
                this.authentication_error_state = [res.data.errors.message]
            }
            if (res.data.status === true) {
                localStorage.setItem("authId", res.data.authId);
                localStorage.setItem("authToken", res.data.authToken);
                setTimeout(() => {
                    this.fetchProducts();  
                  }, 2000);
            } else {
                this.authentication_error_state = [res.data.errors.message];
            }
        })  
        .catch((error) => {})
    },
    setNewOffer(value){
      this.newOffer = value; 
    },
    setNewCategory(value){
      this.category = value; 
    },
    setNewPrice(value){
      this.price = value; 
    },
    setNewbrand(value){
      this.brand = value; 
    },
    getPromotions(supplier_id){
      axios_lite.get('v1/get_promotions',{
        params: {
          supplier_id: supplier_id
        }
      }).then((response) => {
        this.promotions = response.data;
      });
    }
    

  },
});
