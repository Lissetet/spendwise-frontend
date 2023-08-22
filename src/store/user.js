import { defineStore } from 'pinia'
import axios from "axios"

const baseURL = import.meta.env.VITE_BASE_URL;

export default defineStore("user", {
  state: () => { return {
      isDark: false,
      themePreference: null,
      user: null,
      loading: true,
      categories: [],
      parentCategories: [],
      subcategories: [],
      userSubcategories: [],
      sortedCategories: [],
      accounts: [],
      accountTypes: {},
      accountTotalValues: {
        cash: 0,
        debt: 0,
        investments: 0,
        property: 0,
      },
      accountNestedData: [],
      transactions: [],
      events: [],
  }},
  persist: true,
  getters: {
    getUser(state){
      return state.user
    },
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    setIsDark(isDark) {
      this.isDark = isDark;
    },
    setThemePreference(themePreference) {
      this.themePreference = themePreference;
    },
    async fetchCategories() {
      try {
        const categoriesResponse = await axios.get(`${baseURL}/categories?user=all`);
        this.categories = categoriesResponse.data
        this.parentCategories = this.categories.filter(category => category.parent === 'root')
        this.subcategories = this.categories.filter(category => category.parent !== 'root')
        const subcategoriesResponse = await axios.get(`${baseURL}/categories?user=${this.user.sub}`);
        this.userSubcategories = subcategoriesResponse.data
        this.sortCategories();
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async sortCategories() {
      this.sortedCategories = [];
      this.parentCategories.forEach(parent => {
        this.sortedCategories.push(parent);
        const children = this.subcategories.filter(subcategory => subcategory.parent === parent.alias)
        this.sortedCategories.push(...children);
        const userChildren = this.userSubcategories.filter(subcategory => subcategory.parent === parent.alias)
        this.sortedCategories.push(...userChildren);
      })
    },
    async addSubcategory(category) {
      try {
        const res = await axios.post(`${baseURL}/categories`, category);
        this.userSubcategories.push(res.data)
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async editSubcategory(body, id) {
      try {
        const res = await axios.patch(`${baseURL}/categories/${id}`, body);
        const index = this.userSubcategories.findIndex(subcategory => subcategory._id === id)
        this.userSubcategories[index] = res.data
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async deleteSubcategory(id) {
      try {
        await axios.delete(`${baseURL}/categories/${id}`);
        const index = this.userSubcategories.findIndex(subcategory => subcategory._id === id)
        this.userSubcategories.splice(index, 1)
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async fetchAccounts() {
      try {
        const res = await axios.get(`${baseURL}/accounts?user=${this.user.sub}`);
        this.accounts = res.data;
        this.setAccountNestedData();
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    setAccountNestedData() {
      const types = {
        cash: ['cash', 'checking', 'savings'],
        debt: ['credit', 'loan'],
        investments: ['investment'],
        property: ['property'],
      };
      const allTypes = Object.values(types).flatMap(category => category);

      allTypes.forEach((name, index) => {
        const children = this.accounts.filter(account => account.type === name);
        const balance = children.reduce((acc, account) => acc + account.balance, 0);

        this.accountTypes[name] = { name, children, balance };
        this.accountNestedData[index] = { name, balance, children };
      });

      const getAccountsSum = (keys) => {
        return keys.reduce((acc, key) => acc + this.accountTypes[key].balance, 0);
      }

      for (let type in types) {
        this.accountTotalValues[type] = getAccountsSum(types[type]);
      }

      const isCash = (account) => types.cash.includes(account.type);
      this.accountTypes.allCash.children = this.accounts.filter(({type}) => isCash({type}));
    },
    async addAccount(accountData) {
      const accountBody = {
        user: this.user.sub,
        name: accountData.name,
        type: accountData.type,
      }

      try {
        const accountResponse = await axios.post(`${baseURL}/accounts`, accountBody)
        let newAccount = {...accountResponse.data, balance: 0};
  
        if (accountData.balance !== 0) {
          const transactionBody = {
            user: this.user.sub,
            account: newAccount._id,
            amount: accountData.balance,
            description: 'Opening Balance',
          }
          const transactionResponse = await axios.post(`${baseURL}/transactions`, transactionBody)
          const newTransaction = transactionResponse.data;
          newAccount.balance = newTransaction.amount;
          
          this.transactions.push(newTransaction);
        }
        this.accounts.push(newAccount);
        this.setAccountNestedData();
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async editAccount(accountData) {
      const accountBody = {
        name: accountData.name,
        type: accountData.type,
      }

      try {
        const accountResponse = await axios.patch(`${baseURL}/accounts/${accountData._id}`, accountBody)
        const index = this.accounts.findIndex(account => account._id === accountData._id)
        this.accounts[index] = accountResponse.data;
        this.setAccountNestedData();
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async deleteAccount(accountId) {
      try {
        await axios.delete(`${baseURL}/accounts/${accountId}`);
        const index = this.accounts.findIndex(account => account._id === accountId)
        this.accounts.splice(index, 1)
        this.setAccountNestedData();
      } catch (error) {
        alert(error)
        console.log(error)
      }
    }, 
    async fetchEvents() {
      try {
        const res = await axios.get(`${baseURL}/events?user=${this.user.sub}`);
        this.events = res.data;
      } catch (error) {
        alert(error)
        console.log(error)
      }
    }, 
    async addEvent(eventData) {
      try {
        const eventResponse = await axios.post(`${baseURL}/events`, eventData)
        this.events.push(eventResponse.data);
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async editEvent(eventData, id) {
      try {
        const eventResponse = await axios.patch(`${baseURL}/events/${id}`, eventData)
        const index = this.events.findIndex(event => event._id === id)
        this.events[index] = eventResponse.data;
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async deleteEvent(id) {
      try {
        await axios.delete(`${baseURL}/events/${id}`);
        const index = this.events.findIndex(event => event._id === id)
        this.events.splice(index, 1)
      } catch (error) {
        alert(error)
        console.log(error)
      }
    }
  },
})