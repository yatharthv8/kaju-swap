import { createRouter, createWebHistory } from "vue-router";
import Swap from "../views/Swap.vue";

const routes = [
  {
    path: "/swap",
    name: "Swap",
    component: Swap,
    alias: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
