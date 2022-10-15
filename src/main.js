import { createApp, defineAsyncComponent } from "vue";

import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";

import "./assets/styles.css";

import VueSimpleAlert from "vue3-simple-alert-next";

import BaseGear from "./components/UI/BaseGear.vue";
import WalletConnectButton from "./components/UI/WalletConnectButton.vue";
const BaseSpinner = defineAsyncComponent(() =>
  import("./components/UI/BaseSpinner.vue")
);
const ShowAccDetails = defineAsyncComponent(() =>
  import("./components/UI/ShowAccDetails.vue")
);

const app = createApp(App);

app.use(router);
app.use(store);

app.use(VueSimpleAlert);

app.component("wallet-connect-button", WalletConnectButton);
app.component("show-acc-details", ShowAccDetails);
app.component("base-spinner", BaseSpinner);
app.component("base-gear", BaseGear);

app.mount("#app");
