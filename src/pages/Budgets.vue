<template>
  <h1>Budgets</h1>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const { user } = useAuth0();
const user_id = user._rawValue.sub
import axios from 'axios'

const baseURl = 'http://localhost:5050/users'

const getAccounts =  () => {
  axios.get(`http://localhost:5050/users/auth0|64d6f58e7ac5db00c69a5e0e/accounts`)
  .then((response) => {
    console.log(response.data)
  })
}

getAccounts()

</script>