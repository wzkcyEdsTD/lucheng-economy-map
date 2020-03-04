/**
 * vue-cli router config
 * add by eds 2019/7/6
 */
import Vue from "vue";
import Router from "vue-router";
// pages modules
import Build from "./components/building/Building.vue";
import Canvass from "./components/canvass/Canvass.vue";
import Economy from "./components/economy/Economy.vue";
import Land from "./components/land/Land.vue";
import Demo from "./components/building/echart-mapbox/demo.vue";
// import Mapbox from "./components/building/mapbox/mapbox/mapbox.vue";
Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
export default new Router({
  mode: "hash",
  routes:
    window.env == "outside"
      ? [
        {
          path: "/",
          name: "canvass",
          component: Canvass
        }
      ]
      : [
          {
            path: "/",
            name: "economy",
            component: Economy
          },
          {
            path: "/canvass",
            name: "canvass",
            component: Canvass
          },
          {
            path: "/build",
            name: "build",
            component: Build
          },
          {
            path: "/land",
            name: "land",
            component: Land
          },
          // {
          //   path: "/demo",
          //   name: "demo",
          //   component: Demo
          // },
          // {
          //   path: "/mapbox",
          //   name: "mapbox",
          //   component: Mapbox
          // }
        ]
});
