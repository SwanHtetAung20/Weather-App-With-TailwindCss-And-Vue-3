import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "primeicons/primeicons.css";

import "./assets/tailwild.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
