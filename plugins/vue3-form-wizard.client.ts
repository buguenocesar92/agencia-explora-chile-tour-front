import { defineNuxtPlugin } from '#app'
import Vue3FormWizard from 'vue3-form-wizard'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3FormWizard)
})
