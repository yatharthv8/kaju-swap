import { createRouter, createWebHistory } from "vue-router";
import Swap from "../views/Swap.vue";
import Pool from "../views/Pool.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
