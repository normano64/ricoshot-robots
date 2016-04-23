import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import HomeView from './components/views/Home.vue';
import RoomView from './components/views/Room.vue';
import Api from './api.js';

Vue.use(Router);

var router = new Router({
    history: true,
    saveScrollPosition: true
});

router.map({
    '/': {
        component: HomeView
    },
    '/room/:uuid': {
        component: RoomView
    }
});

router.beforeEach(function () {
    window.scrollTo(0, 0);
});

router.redirect({
    '*': '/'
});

router.start(App, 'body > div');
