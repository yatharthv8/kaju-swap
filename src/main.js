import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";

import "./assets/styles.css";

import WalletConnectButton from "./components/UI/WalletConnectButton.vue";

const app = createApp(App);

app.use(router);
app.use(store);

app.component("wallet-connect-button", WalletConnectButton);

app.mount("#app");
