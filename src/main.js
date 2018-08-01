/**
 * Created by Administrator on 2018/8/1.
 */
import Vue from 'vue'

Vue.config.silent = true
import App from './App.vue'

new Vue({
	el: '#app',
	components: { App },
	template: '<App/>'
});
