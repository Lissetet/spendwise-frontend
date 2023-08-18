import { defineStore } from 'pinia'
import axios from "axios"

const baseURL = import.meta.env.VITE_BASE_URL;

export const useUserStore = defineStore("user", {
  state: () => ({
    error: null,
    user: null,
    loading: true,
    categories: [],
    parentCategories: [],
    userSubCategories: [],
    accounts: [],
    transactions: [],
  }),
  // getters: {
  //   getUser(state){
  //     return state.user
  //   }
  // },
  actions: {
    setUser(user) {
      this.user = user;
    },
    async fetchCategories() {
      try {
        const res = await axios.get(`${baseURL}/categories?user=all`);
        this.categories = res.data
        this.parentCategories = res.data.filter(category => category.parent === 'root')
        const res2 = await axios.get(`${baseURL}/categories?user=${this.user.sub}`);
        this.userSubCategories = res2.data
      } catch (error) {
        this.error = error;
      }
    },
    async addSubCategory(category) {
      try {
        const res = await axios.post(`${baseURL}/categories`, category);
        this.userSubCategories.push(res.data)
      } catch (error) {
        this.error = error;
      }
    }
  },
})