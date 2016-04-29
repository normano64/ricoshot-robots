import Vue from 'vue';
import Router from 'vue-router';
import { textToColor, colorLightness } from './filters'
import app from './components/app.vue';
import homeView from './components/views/home.vue';
import roomView from './components/views/room.vue';

Vue.filter('textToColor', textToColor)
Vue.filter('colorLightness', colorLightness)

Vue.use(Router);

var router = new Router({
    history: true,
    saveScrollPosition: true
});

router.map({
    '/': {
        component: homeView
    },
    '/room/:uuid': {
        component: roomView
    }
});

router.beforeEach(function () {
    window.scrollTo(0, 0);
});

router.redirect({
    '*': '/'
});

router.start(app, 'body > div');
