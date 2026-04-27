import { createApp } from 'vue';
import router from './router';
import './styles/tokens.css';
import './styles/base.css';
import App from './App.vue';

createApp(App).use(router).mount('#app');
