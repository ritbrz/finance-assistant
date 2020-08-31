import Vue from 'vue'
import Router from 'vue-router'

import FundDetail from '@/components/fund/FundDetail.vue';
Vue.use(Router);
 
const routes = [
    {
        path: '/',
        redirect: '/fund/detail/110011'
    },
    {
        path: '/fund/detail/:fundId',
        name: 'FundDetail',
        component: FundDetail,
    }
]
 
const router = new Router({
    mode: 'hash',
    routes
});
 
export default router;