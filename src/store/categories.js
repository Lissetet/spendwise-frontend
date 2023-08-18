import { defineStore } from 'pinia'
import axios from "axios"
import { useMessage, useDialog } from 'naive-ui';

const baseURL = import.meta.env.VITE_BASE_URL;
const message = useMessage();
const dialog = useDialog();

export const useCategoriesStore = defineStore("category", {
    state: () => ({
        categories: [],
        parentCategories: [],
        userSubCategories: [],
        error: null,
    }),
    getters: {
      getCategories(state){
          return state.categories
        }
    },
    actions: {
      async fetchCategories() {
        try {
          const res = await axios.get(`${baseURL}/categories`);
          this.categories = res.data
          this.parentCategories = res.data.filter(category => category.parent === 'root')
          const res2 = await axios.get(`${baseURL}/categories?user=${localStorage.getItem('user')}`);
          
        } catch (error) {
          this.error = error;
        }
      }
    },
})
