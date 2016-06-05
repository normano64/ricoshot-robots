<template>
    <svg class="icon robot" :style="{ left: robot.x * 32 + 7 + 'px', top: robot.y * 32 - 4 + 'px', fill: color.light, color: color.dark }">
        <use xlink:href="/static/sprite.svg#icon-robot" class="inner"/>
        <use xlink:href="/static/sprite.svg#icon-robot-marked" v-if="marked"/>
    </svg>
</template>

<script>
    import store from '../../store';

    export default {
        name: 'robotPartial',
        props: ['robot', 'marked'],
        data() {
            return {
                color: { light: '#000', dark: '#000' }
            }
        },
        methods: {
            colorRobot() {
                switch(this.robot.color) {
                    case 'red':
                        return { light: '#f44336', dark: '#b71c1c' };
                    case 'blue':
                        return { light: '#2196f3', dark: '#0d47a1' };
                    case 'green':
                        return { light: '#4caf50', dark: '#1b5e20' };
                    case 'yellow':
                        return { light: '#ffeb3b', dark: '#f57f17' };
                    default:
                        return null;
                }
            }
        },
        attached() {
            this.color = this.colorRobot();
        }
    }
</script>

<style lang="sass">
    @import "variables";
    @import 'mixin';

    .icon.robot {
        position:absolute;
        width:24px;
        height:32px;
        cursor:pointer;
        transition:all .3s ease;
    }
</style>
