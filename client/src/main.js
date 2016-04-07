import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import HomeView from './components/views/Home.vue'

Vue.use(Router);

var router = new Router({
    history: true,
    saveScrollPosition: true
});

router.map({
    '/': {
        component: HomeView
    },
});

router.beforeEach(function () {
    window.scrollTo(0, 0);
});

router.redirect({
    '*': '/'
});

router.start(App, '#app');
