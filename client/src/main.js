import Vue from 'vue';
import App from './App.vue';
import Croppa from 'vue-croppa';

Vue.use(Croppa);

new Vue(App).$mount('#app');