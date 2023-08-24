import { defineStore } from 'pinia'
import axios from "axios"
import { darkTheme, lightTheme, useOsTheme } from 'naive-ui'

const baseURL = import.meta.env.VITE_BASE_URL;

export default defineStore("user", {
  state: () => { return {
      theme: 'system',
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
      uniqueTransactionAliases: [],
      uniqueTransactionAccounts: [],
      uniqueTransactionTypes: [],
      transactionFilters: {
        category: [],
        account: [],
        type: [],
      },
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
    sortCategories() {
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
    async addAccount(data) {
      const accountBody = {
        user: this.user.sub,
        name: data.name,
        type: data.type,
      }

      try {
        const accountResponse = await axios.post(`${baseURL}/accounts`, accountBody)
        let newAccount = {...accountResponse.data, balance: 0};
  
        if (data.balance !== 0) {
          const transactionBody = {
            user: this.user.sub,
            account: newAccount._id,
            amount: data.balance,
            description: 'Opening Balance',
          }
          const res = await axios.post(`${baseURL}/transactions`, transactionBody)
          const newTransaction = res.data;
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
    async editAccount(data) {
      const accountBody = {
        name: data.name,
        type: data.type,
      }

      try {
        const accountResponse = await axios.patch(`${baseURL}/accounts/${data._id}`, accountBody)
        const index = this.accounts.findIndex(account => account._id === data._id)
        this.accounts[index] = accountResponse.data;
        this.setAccountNestedData();
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async deleteAccount(id) {
      try {
        await axios.delete(`${baseURL}/accounts/${id}`);
        const index = this.accounts.findIndex(account => account._id === id)
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
    async addEvent(data) {
      try {
        const eventResponse = await axios.post(`${baseURL}/events`, data)
        this.events.push(eventResponse.data);
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async editEvent(data, id) {
      try {
        const eventResponse = await axios.patch(`${baseURL}/events/${id}`, data)
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
    },
    async fetchTransactions() {
      try {
        const res = await axios.get(`${baseURL}/transactions?user=${this.user.sub}`);
        this.transactions = res.data;
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async addTransaction(data) {
      data.user = this.user.sub;
      try {
        const res = await axios.post(`${baseURL}/transactions`, data)
        this.transactions.push(res.data);
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async editTransaction(data) {
      const index = this.transactions.findIndex(v => v._id === data._id)
      const requestBody = {}

      Object.keys(data).forEach(key => {
        if (data[key] !== this.transactions[index][key]) {
          requestBody[key] = data[key];
        }
      })

      try {
        const res = await axios.patch(`${baseURL}/transactions/${data._id}`, requestBody)
        this.transactions[index] = res.data;
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async deleteTransaction(id) {
      try {
        await axios.delete(`${baseURL}/transactions/${id}`);
        const index = this.transactions.findIndex(v => v._id === id)
        this.transactions.splice(index, 1)
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    createTransactionFilters() {
      const getOptionForAlias = (alias) => {
        const category = this.sortedCategories.find((category) => category.alias === alias);
        return { label: category.name, value: alias };
      }
      
      const getOptionForAccount = (id) => {
        const account = this.accounts.find(acc => acc._id === id);
        return { label: account.name, value: id };
      }
      
      const getOptionForType = (type) => {
        const capitalizedType = (type) => type.charAt(0).toUpperCase() + type.slice(1);
        return { label: capitalizedType(type), value: type };
      }

      const getUniqueValues = (key) => {
        return [...new Set(this.transactions.map((v) => v[key]))];
      }

      for (let filter in this.transactionFilters) {
        const uniqueValues = getUniqueValues(filter);
        const filterOptions = uniqueValues.map((value) => {
          switch (filter) {
            case 'category':
              return getOptionForAlias(value);
            case 'account':
              return getOptionForAccount(value);
            case 'type':
              return getOptionForType(value);
          }
        })
        this.transactionFilters[filter] = filterOptions;
      }
    }
  },
})