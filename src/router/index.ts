import { createRouter, createWebHistory } from "vue-router";

// Import your views (page components)
import Home from "../views/Home.vue";

// Define routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(), // Uses HTML5 history mode
  routes,
});

export default router;
