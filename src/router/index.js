import { createRouter, createWebHistory } from "vue-router";
import Swap from "../views/Swap.vue";
import Pool from "../views/Pool.vue";
import AddLiquidity from "../views/AddLiquidity.vue";
import RemoveLiquidity from "../views/RemoveLiquidity.vue";

const routes = [
  {
    path: "/swap",
    name: "Swap",
    component: Swap,
    alias: "/",
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
