import { createRouter, createWebHistory } from 'vue-router';
import { RouteNames } from '../enums/RouteNames';
import HomeView from '../views/HomeView.vue';
import NoraView from '../views/NoraView.vue';
import SettingsView from '../views/SettingsView.vue';
import HelpView from '../views/HelpView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/home',
      name: RouteNames.home,
      component: HomeView
    },
    {
      path: '/nora',
      name: RouteNames.nora,
      component: NoraView
    },
    {
      path: '/settings',
      name: RouteNames.settings,
      component: SettingsView
    },
    {
      path: '/help',
      name: RouteNames.help,
      component: HelpView
    }
  ]
});

export default router;
