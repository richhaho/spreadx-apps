// eslint-disable import/order
import "@/@iconify/icons-bundle";
import App from "@/App.vue";
import ability from '@/plugins/casl/ability';
import i18n from "@/plugins/i18n";
import layoutsPlugin from "@/plugins/layouts";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
import router from "@/router";
import { abilitiesPlugin } from '@casl/vue';
import "@core/scss/template/index.scss";
import "@styles/styles.scss";
import "flag-icons/css/flag-icons.min.css";
import { createPinia } from "pinia";
import { createVPhoneInput } from "v-phone-input";
import "v-phone-input/dist/v-phone-input.css";
import { createApp } from "vue";
import { PhoneInput } from '@lbgm/phone-number-input';

import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

// register as global component

loadFonts();

// Create vue app
const app = createApp(App);
const vPhoneInput = createVPhoneInput({
  countryIconMode: "svg",
  displayFormat: 'national',
  
  // enableSearchingCountry: true,
});

app.component('PhoneInput', PhoneInput);
app.component('vue-phone-number-input', VuePhoneNumberInput);
// Use plugins
app.use(vuetify);
app.use(createPinia());
app.use(router);

app.use(layoutsPlugin);
app.use(i18n);
app.use(vPhoneInput);
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})

// Mount vue app
app.mount("#app");