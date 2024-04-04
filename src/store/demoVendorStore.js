import axios_lite from '@/plugins/axios_lite';
import router from "../router/index";
const qlineUrl = import.meta.env.VITE_API_V1
const authAccessToken = import.meta.env.VITE_AUTH_TOKEN_TANAF

export const useDemoVendorStore = defineStore("useDemoVendorStore", {
  state: () => ({
    products: ref([]),
    promotions: ref([]),
    account_receipt_note: ref([]),
    isAccountReceiptSaving : ref(false),
    newOffer: ref(''),
    category: ref(''),
    brand: ref(''),
    price: ref(0),
  }),

  getters: {

  },

  actions: {
    delayed_navigation() {
      setTimeout(() => {
        router.push("/");
      }, 500);
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
