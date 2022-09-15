import { createRouter, createWebHashHistory } from "vue-router";
import Swap from "../views/Swap.vue";
import Pool from "../views/Pool.vue";
import AddLiquidity from "../views/AddLiquidity.vue";
import RemoveLiquidity from "../views/RemoveLiquidity.vue";
import About from "../views/About.vue";
import Home from "../views/Home.vue";
import PageNotFound from "../views/PageNotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/swap",
    name: "Swap",
    component: Swap,
  },
  {
    path: "/pool",
    name: "Pool",
    component: Pool,
  },
  {
    path: "/addLiquidity",
    name: "AddLiquidity",
    component: AddLiquidity,
  },
  {
    path: "/removeLiquidity",
    name: "RemoveLiquidity",
    component: RemoveLiquidity,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/:notFound(.*)",
    name: "PageNotFound",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory("/kaju-swap/"),
  routes,
});

// const { ethereum } = window;

// let connected = false;
// let installed = false;

// function isMetaMaskInstalled() {
//   return Boolean(ethereum && ethereum.isMetaMask);
// }

// async function isMetaMaskConnected() {
//   const accounts = await ethereum.request({ method: "eth_accounts" });
//   return accounts && accounts.length > 0;
// }

// async function initialise() {
//   connected = await isMetaMaskConnected();
//   installed = isMetaMaskInstalled();
//   console.log(connected, installed);
// }

// ethereum.on("accountsChanged", async () => {
//   initialise();
// });

// router.beforeEach(async (_, _2, next) => {
//   const accounts = await ethereum.request({ method: "eth_accounts" });
//   if (accounts && accounts.length > 0) {
//     console.log("user is connected");
//   } else {
//     console.log("user not connected");
//   }
//   initialise();
//   next();
// });

export default router;
