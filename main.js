import Vue from 'vue'
import App from './App'

// import store from './store'
// import * as _ from './common/lodash.min.js';
// Vue.use(_);
// import VueBus from 'vue-bus';
// Vue.use(VueBus);
// import myloading from './components/loading/loading.vue'
// Vue.component('myloading',myloading) 

Vue.config.productionTip = false



// function switch_loading(tf){
// 	if(tf){
// 		store.commit("switch_loading",tf)
// 	}else{
// 		store.commit("switch_loading")
// 	}
// }
// Vue.prototype.$loading = switch_loading;
// Vue.prototype.$store = store;
App.mpType = 'app';
// import toast from './components/global.vue';


// Vue.prototype.toast = toast.toast;
const app = new Vue({
   
    ...App
})
app.$mount()
