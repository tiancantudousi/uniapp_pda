var timer;
var timerperson;
import {getSystemTimenvue} from "./api.js";
export const myMixin={
	data(){
		return {
			statusBarHeight:'24'
		}
	},
	created(){
		
	},
	methods:{
		getsystime(){
			     const storage = weex.requireModule('storage')
				 return new Promise((resolve,reject)=>{
					 	 storage.getItem('loginForm', event => {
					 					let loginForm = JSON.parse(event.data);
					 					getSystemTimenvue({"LoginForm":loginForm}).then(res=>{
					 						resolve(res.returnValue.ServerInfo.systemtime)
					 					})
					      })
				 })
			
		},
		setbarheight(){
			const storage = weex.requireModule('storage')
			storage.getItem('statusBarHeight',event => {
				this.statusBarHeight=event.data;
			})
		},
		getmainContentHeight(){
			const storage = weex.requireModule('storage')
			return new Promise((resolve,reject)=>{
				storage.getItem('mainContentHeight',event => {
					console.log('event.data');
					console.log(event.data);
					resolve(event.data);
				})
			})
			
		},
		linsentBarCode(callback){
			if (weex.isRegisteredModule('MiYing-edittext')) {
			    var modal = weex.requireModule('modal');
				uni.requireNativePlugin('MiYing-edittext').dostart();
				const globalEvent = weex.requireModule('globalEvent')
				 globalEvent.addEventListener("onScanBarCode", e => {
					 modal.toast({message:e.datat});
					 callback(e.datat)
					 // uni.postMessage({key:'onScanBarCode',value:e.datat});  
				 });
			}
		},
		searchDeptsthrottle(value,dataSource){
			console.log('mixns');
			clearInterval(timer);
			return new Promise((resolve,reject)=>{
				timer=setTimeout(()=>{
					let dataList=dataSource.slice();
					 if(value){
									dataList = dataSource.filter((item) => {
										let reg = new RegExp(value, "i");  
										return reg.test(item.de_alph) || reg.test(item.de_deptname);
									})
								}			
					dataList= dataList.length > 15 ? dataList.splice(0, 15) : dataList;
								resolve(dataList);
				},500)
			}) 
		
		},
		searchthrottle(value,dataSource,key1,key2){
			clearInterval(timerperson);
			return new Promise((resolve,reject)=>{
				timerperson=setTimeout(()=>{
					let dataList=dataSource.slice();
					 if(value){
									dataList = dataSource.filter((item) => {
										let reg = new RegExp(value, "i");
										  if(key2){
											  return reg.test(item[key1]) || reg.test(item[key2]);
										  }else{
											   return reg.test(item[key1]);
										  }
										
									})
								}			
					dataList= dataList.length > 15 ? dataList.splice(0, 15) : dataList;
								resolve(dataList);
				},300)
			}) 
		
		}

	}
}

