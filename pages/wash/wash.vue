<template>
<view class="maincontent">
		<view class="status_bar">
		</view>
		
		<selfDialogComponent v-if="showDialog">
			<view slot="content">
			
			</view>
			<view slot="footer">
				<button type="default" size="mini"  @click.stop="showDialog=false;remark='';">取消</button>
				<view style="display:inline-block;width:20upx;"></view>
				<button type="primary" size="mini"  @click.stop="showDialog=false">确认</button>
			</view>
			 
		</selfDialogComponent>

			<myloading></myloading>
			
			
				<view class="wash-header">
					<navbarComponent @stepClick="onStepClick" :buttonList="['清洗','特殊清洗','统计']"></navbarComponent>
					<loginInformationComponent></loginInformationComponent>
				</view>
			
				<!-- <scroll-view v-if="activeTabIndex==0" scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}"> -->
					<view class="wash-list" v-if="activeTabIndex==0">
						<view v-for="(item,index) in washList" :key="index" @click.stop="navigatestate(item,index)">
						<!-- <view v-for="(item,index) in toReclaimList" v-show="visableIndex<=index&&index<=visableIndex+visablenum" :key="index" :class="{'scrollItem':index==0}"> -->
						     <washListItem @refreshMachine="updatesignMachine" :item="item"></washListItem>
						</view>
						<loadingMoreComponent v-if="washList.length" :loadingType="loadingType"></loadingMoreComponent>
					</view>
					
				<!-- </scroll-view> -->
				<washforeighComponent v-if="activeTabIndex==1"></washforeighComponent>
				<washcencusComponent :loadingmore="loadingmore"  v-if="activeTabIndex==2"></washcencusComponent>
				
		
		
			
	
</view>
</template>
<script>
   import Vue from 'vue';
	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar-base.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";

	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import washListItem from "../../components/wash/wash-list-item.vue";
	import washforeighComponent from "../../components/wash/washforeign.vue";
	import washcencusComponent from "../../components/wash/washcensus.vue"
	

	// import mInput from "../../components/uni-ui/m-input/m-input.vue";
	

	import {
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";

	import selfDialogComponent from "../../components/base/self-dialog.vue";
	import {
		getWashList,getMachineDetail,updatesignMachine,getMachines
	} from "../../common/api.js";
	import { myMixin } from "../../common/mixins.js";
	import washingitem from "../../common/global.js";
	let timer;
	// import Bus from "../../common/bus.js";


	export default {
		mixins:[ myMixin ],
		components: {
			maincomponent,
			navbarComponent,
			loginInformationComponent,		
			loadingMoreComponent,
			selfDialogComponent,
			washListItem,
			washforeighComponent,
			washcencusComponent
		},
		data() {
			return {
				washList:[],
				loadingType:2,
				page:1,
				pageSize:20,
				showDialog:false,
				homeHeight:'0',
				activeTabIndex:0,
				loadingmore:false
				// bus:Bus
			}
		},
		computed: {
			...mapGetters(["loginForm"])
		},
		onReachBottom() {
			if(this.activeTabIndex==2){
				this.loadingmore=!this.loadingmore;
			}
		},
		onBackPress(){
			if(this.$store.state.loading){
					this.$store.commit("switch_loading",false);
			}
		},
		onLoad() {
			console.log('onLoad');
		     this.getWashList();
			  this.$bus.on('refreshItem',(item)=>{
				 this.updatesignMachine(item)
			 });
			 this.getMachines();
			 this.onemuinterefresh();
		},
		onUnload(){
			console.log('onUnload');
			clearInterval(timer);
		},

		methods: {
			onemuinterefresh(){
				timer=setInterval(()=>{
					this.getWashList();
				},60000)
			},
			onStepClick(index){
				this.activeTabIndex=index;
				console.log(index,'index');
			},
			getMachines(){
				const data={"Sbxx":{"did":this.loginForm.deptId,"is_inv":"1","sb_type":"1~2~9"},"LoginForm":this.loginForm};
				getMachines(data).then(res=>{
					console.log(res,"清洗机");
					if (res.errorCode == "0") {
						this.set_machines(res.returnValue.SbxxList);
// 						this.machines=res.returnValue.SbxxList.filter(item=>{
// 							return item.id!=this.activeMachine.dev_id;
// 						});
					}
					
				})
			},
// 			onRefreshMachine(item){
// 				this.updatesignMachine()
// 			},
			updatesignMachine(item){
				const data={"Qx":{"d_gc":item.d_gc,"dev_id":item.dev_id,"dev_name":item.dev_name,"t_gc":item.t_gc},"LoginForm":this.loginForm};
				updatesignMachine(data).then(res=>{
					let itemIndex=_.findIndex(this.washList,{dev_id:item.dev_id});
					 if(res.errorCode=="0"){
						 // this.washList[itemIndex]=res.returnValue.qxjStateList[0];
						 Vue.set(this.washList,itemIndex,Object.assign(res.returnValue.qxjStateList[0],{'countdown':''}));
						 // this.set_activeMachine({...res.returnValue.qxjStateList[0],'countdown':''});
					 }
					
				})
			},
		     navigatestate(item,index){
				 this.set_activeMachine(JSON.parse(JSON.stringify(item)));
				 this.getMachineDetail(item);			      
			 },
			 navigate(item){
				  switch(item.state_name){
						 case "空闲中":uni.navigateTo({url:'/pages/washfree/washfree?id=1&name=uniapp'});break;
						 case "待检定":uni.navigateTo({url:'/pages/washcheck/washcheck?id=1&name=uniapp'});break;
						 case "清洗中":washingitem.item=item;uni.navigateTo({url:'/pages/washing/washing?id=1&name=uniapp'});break;
						 case "准备中":uni.navigateTo({url:'/pages/washfree/washfree?id=1&name=uniapp'});break;
				 }
			 },
		      
// 			scrolltoBottom(){
// 				this.page++;
// 			    this.loadingType=2;
// 				// this.getToreclaim();
// 				 console.log("loading more");
// 			},
            getMachineDetail(item){
				this.$loading();
				const data={"Qx":{"d_gc":item.d_gc,"dev_id":item.dev_id,"dev_name":item.dev_name,"t_gc":item.t_gc},"LoginForm":this.loginForm};
				getMachineDetail(data).then(res=>{
					this.$loading(false);
					this.setdetailList(res.returnValue.qxDtlList);
					this.navigate(item);
					console.log(res,'detail');
				})
			},	
			getWashList:_.throttle(function(){//获取清洗机列表
			    this.$loading();
				const data={"Qx":{},"LoginForm":this.loginForm};
				this.fetchSysTime();//获取系统时间			
				getWashList(data).then(res=>{
					console.log(JSON.stringify(res));
					this.$loading(false);
				    if(res.errorCode=="0"){
						this.washList=res.returnValue.qxjStateList.map(item=>{
							return Object.assign(item,{'countdown':''});
						});
// 						this.loadingType=res.returnValue.rows<this.pageSize?2:0;
// 						this.todayReclaimNum=
// 						let resReclaimList=res.returnValue.rows.map(item=>{
// 							return {bmc:item.bmc,tmid:item.tmid,checked:item.checked,hstype_name:item.hstype_name,qx_num:item.qx_num}
// 						})
// 						this.toReclaimList=this.toReclaimList.concat(resReclaimList);
					}
				})
			},500,{ 'trailing': false }),

		
			
		
			setDomHeight() {
				let _this = this;
				const query = uni.createSelectorQuery();
				let view = query.select('.home-content');
				view.boundingClientRect(data => {
					uni.getSystemInfo({
						success: function(res) {
							_this.homeHeight = data.height;
						}
					});
				}).exec();

			},
			...mapMutations(['setdetailList','set_activeMachine','set_machines']),
			...mapActions(['fetchSysTime'])
		

		},
// 		mounted(){
// 			setTimeout(()=>{
// 				this.setDomHeight();
// 			},200);
// 		},
		onReady() {
// 			setTimeout(()=>{
// 				this.setDomHeight();
// 			},200);
		}
	}
</script>

<style lang="scss">
	@import "../../common/global.scss";


// 	.wash-content {
// 		width:100%;
// 		position:absolute;
// 		top:var(--status-bar-height);
// 		left:0;
// 	}
    .maincontent {
		height: 100vh;
		width: 100vw;
		padding: 0;
		margin: 0;
		position: relative;
	}
	.status_bar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		height: var(--status-bar-height);
		width: 100%;
		background-color: #000000;
	}
	.wash-list{
		position:absolute;
		left:0;
		width:100%;
		top:calc(154upx + var(--status-bar-height));
	}
	.wash-header {
		position:fixed;
		top:var(--status-bar-height);
		left:0;
		width:100%;
		z-index:1000;
		.header-right {
			color: white;
			img {
				height: 10upx;
				width: 20upx;
				margin-left: 10upx;
			}
		}
	}


	
// 	.wash-content {	
// 		display: flex;
// 		flex-direction: column;
// 		.same {
// 			padding: 20upx 30upx;
// 			font-size: 29upx;
// 			flex: none;
// 		}
// 		.home-content {
// 			flex: 1;
// 		}
// 
// 	
// 	}
</style>
