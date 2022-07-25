import { createApp, defineAsyncComponent } from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";

import "./assets/styles.css";

import BaseGear from "./components/UI/BaseGear.vue";
import WalletConnectButton from "./components/UI/WalletConnectButton.vue";
const BaseSpinner = defineAsyncComponent(() =>
  import("./components/UI/BaseSpinner.vue")
);

const app = createApp(App);

app.use(router);
app.use(store);

app.component("wallet-connect-button", WalletConnectButton);
app.component("base-spinner", BaseSpinner);
app.component("base-gear", BaseGear);

app.mount("#app");
