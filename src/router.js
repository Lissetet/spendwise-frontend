import { createRouter, createWebHistory } from 'vue-router';

import Overview from './pages/Overview.vue';
import Transactions from './pages/Transactions.vue';
import Accounts from './pages/Accounts.vue';
import Events from './pages/Events.vue';
import Budgets from './pages/Budgets.vue';
import Categories from './pages/Categories.vue';
import NetWorth from './pages/NetWorth.vue';
import Settings from './pages/Settings.vue';
import Contact from './pages/Contact.vue';
import Profile from './pages/Profile.vue';
import { createAuthGuard } from "@auth0/auth0-vue";

const getProtectedRoute = (path, component) => {
  return {
    path,
    component,
    beforeEnter: createAuthGuard(app)
  }
}

const getRoute = (path, component) =>  { 
  return { path, component }
}


const routes = [
  getRoute('/', Overview),
  getProtectedRoute('/overview', Overview),
  getProtectedRoute('/accounts', Accounts),
  getProtectedRoute('/transactions', Transactions),
  getProtectedRoute('/events', Events),
  getProtectedRoute('/budgets', Budgets),
  getProtectedRoute('/categories', Categories),
  getProtectedRoute('/net-worth', NetWorth),
  getProtectedRoute('/settings', Settings),
  getProtectedRoute('/contact', Contact),
  getProtectedRoute('/profile', Profile),
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
