<template>
	<view class="maincontent">
		<view class="status_bar">
		</view>
		<view class="wash-header">
			<navbarComponent @stepClick="onStepClick" :buttonList="['灭菌','统计']" ></navbarComponent>
			<loginInformationComponent></loginInformationComponent>
		</view>
		<view class="wash-content" v-if="activeTabIndex==0">
			<view v-for="(item,index) in washList" :key="index" @click.stop="navigatestate(item,index)">
				 <sterilizationListItem @refreshsterilizationItem="updatesignMachine" :item="item"></sterilizationListItem>
			</view>  
			<loadingMoreComponent v-if="washList.length" :loadingType="loadingType"></loadingMoreComponent>	
			
		</view>
		<cencuscomponent v-if="activeTabIndex==1" :loadingmore="loadingmore"></cencuscomponent>
		<myloading></myloading>
		<selfDialogComponent v-if="showDialog">
			<view slot="content">
			
			</view>
			<view slot="footer">
				<button type="default" size="mini"  @click.stop="showDialog=false;remark='';">取消</button>
				<view style="display:inline-block;width:20upx;"></view>
				<button type="primary" size="mini"  @click.stop="showDialog=false">确认</button>
			</view>
		</selfDialogComponent>
	</view>
</template>
<script>
   import Vue from 'vue';
	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar-base.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";

	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import sterilizationListItem from "../../components/sterilization/sterilization-list-item.vue";
	import cencuscomponent from "../../components/sterilization/cencus.vue";
	

	// import mInput from "../../components/uni-ui/m-input/m-input.vue";
	

	import {
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";

	import selfDialogComponent from "../../components/base/self-dialog.vue";
	import {
		getsterilizationList,getsterilizationdataList,getsterilizationpacklist,getDetailsterilization,getMachines
	} from "../../common/api.js";
	import { myMixin } from "../../common/mixins.js";
	import sterilizationitem from "../../common/global.js";
	// import Bus from "../../common/bus.js";


	export default {
		mixins:[ myMixin ],
		components: {
			maincomponent,
			navbarComponent,
			loginInformationComponent,		
			loadingMoreComponent,
			selfDialogComponent,
			sterilizationListItem,
			cencuscomponent
		},
		data() {
			return {
				activeTabIndex:0,
				washList:[],
				loadingType:2,
				page:1,
				pageSize:20,
				showDialog:false,
				homeHeight:'0',
				TabCur:0,
				loadingmore:false,
				tabList:[{name:'灭菌'},{name:'统计'}]
				// bus:Bus
			}
		},
		computed: {
			...mapGetters(["loginForm"])
		},
		onBackPress(){
			if(this.$store.state.loading){
					this.$store.commit("switch_loading",false);
			}
		},
		onUnload(){
			 this.$bus.off('refreshsterilizationItem');
		},
		onLoad() {
		     this.getsterilizationdataList();
			 this.$bus.on('refreshsterilizationItem',(item)=>{
				 this.updatesignMachine(item)
			 });
		},
		onReachBottom() {
			if(this.activeTabIndex==1){
				this.loadingmore=!this.loadingmore;
			}
		},

		methods: {
			onStepClick(index){
				this.activeTabIndex=index;
			},
		
			updatesignMachine(item){
				const data={"Mj":{"dev_id":item.dev_id},"LoginForm":this.loginForm};
				getDetailsterilization(data).then(res=>{//获取单个灭菌机
					let itemIndex=_.findIndex(this.washList,{dev_id:item.dev_id});
					  console.log(res,"单个灭菌机");
					 if(res.errorCode=="0"){
						 let tempmachine={...res.returnValue.mjjStateList[0],'market':item.market?item.market:'','countdown':''};
						 Vue.set(this.washList,itemIndex,tempmachine);
						 this.set_activesterilizationMachine(JSON.parse(JSON.stringify(tempmachine)));
					 }
					
				})
			},
		     navigatestate(item,index){
				 console.log(item,'首次设置activer');
				 this.set_activesterilizationMachine(JSON.parse(JSON.stringify(item)));
				 this.getMachineDetail(item);			      
			 },
			 navigate(item){
				  switch(item.state_name){
						 case "空闲中":uni.navigateTo({url:'/pages/sterilizationfree/sterilizationfree'});break;
						 case "待检定":uni.navigateTo({url:'/pages/sterilizationcheck/sterilizationcheck?id=1&name=uniapp'});break;
						 case "灭菌中":sterilizationitem.sterilizationitem=item;uni.navigateTo({url:'/pages/sterilizationing/sterilizationing?id=1&name=uniapp'});break;
						 case "准备中":uni.navigateTo({url:'/pages/sterilizationfree/sterilizationfree?id=1&name=uniapp'});break;
				 }
			 },
		      
// 			scrolltoBottom(){
// 				this.page++;
// 			    this.loadingType=2;
// 				// this.getToreclaim();
// 				 console.log("loading more");
// 			},
            getMachineDetail(item){//获取灭菌机包信息
				this.$loading();
				console.log(item,'单个灭菌机信息');
				
				const data={
					"Mj":item,"LoginForm":this.loginForm};
				getsterilizationpacklist(data).then(res=>{
					this.$loading(false);
					this.setdetailsterilization(res.returnValue.mjDtlList);
					this.navigate(item);
					console.log(res,'灭菌机包详情');
				})
			},	
		
			getsterilizationdataList(){//获取灭菌模块list列表
				const data={
					"Mj":{"tmxxList":[]},"LoginForm":this.loginForm
				}
				 this.$loading();
				getsterilizationdataList(data).then(res=>{
					console.log(res,'灭菌数据列表');
					this.$loading(false);
					if(res.errorCode=="0"){
						this.washList=res.returnValue.mjjStateList.map(item=>{
							return Object.assign(item,{'countdown':'','market':''});
						});
					}
				})
			},

		
			
		
// 			setDomHeight() {
// 				let _this = this;
// 				const query = uni.createSelectorQuery();
// 				let view = query.select('.home-content');
// 				view.boundingClientRect(data => {
// 					uni.getSystemInfo({
// 						success: function(res) {
// 							_this.homeHeight = data.height;
// 						}
// 					});
// 				}).exec();
// 
// 			},
			...mapMutations(['setdetailsterilization','set_activesterilizationMachine','set_machines']),
			...mapActions(['fetchSysTime'])
		

		},
		onReady() {
			
		   // this.setDomHeight();
		
			
		}
	}
</script>

<style lang="scss">
	@import "../../common/global.scss";
	
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
	
	.wash-header {
		position: fixed;
		width: 100%;
		z-index: 1000;
		top: var(--status-bar-height);
		left: 0;
	
		.header-right {
			color: white;
	
			img {
				height: 10upx;
				width: 20upx;
				margin-left: 10upx;
			}
		}
	}


	.wash-content {
		width:100%;
		position:absolute;
		top:calc(164upx + var(--status-bar-height));
		left:0;
		// overflow-y: hidden;
		// height: calc(100vh - var(--status-bar-height));
	}


	

		.same {
			padding: 20upx 30upx;
			font-size: 29upx;
			flex: none;
		}
		.home-content {
			flex: 1;
		}

	
	
</style>
