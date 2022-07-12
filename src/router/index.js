import { createRouter, createWebHistory } from "vue-router";
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
  history: createWebHistory("/kaju-swap/"),
  routes,
});

export default router;
