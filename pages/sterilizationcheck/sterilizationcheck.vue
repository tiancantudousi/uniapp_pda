<template>
	<maincomponent style="background-color:#FFFFFF">
		<view slot="content">
			<view class="wash-check-content">
				<view class="wash-check-header">
					<navbarComponent :buttonList="[activesterilizationMachine.dev_name]">
					</navbarComponent>
					<loginInformationComponent></loginInformationComponent>
				</view>
				<view class="wash-item-content flexaround border-bottom" style="padding:20upx;">
					 <img src="../../static/img/timg.jpg" style="flex:none;width:110upx;height:110upx;padding:15upx;" alt="">
					 <view style="flex:1;">
						 <view class="wash-item-top flexaround">
						 	<view class="machine">
						 		{{activesterilizationMachine.dev_name}}
						 	</view>
						 	<view class="state free" >
						 		{{activesterilizationMachine.d_gc}}/{{activesterilizationMachine.t_gc}}
						 	</view>
						 </view>
						 <view class="wash-item-bottom flexaround">
						 	  {{activesterilizationMachine.start_dt}}-{{endDt}}
						 </view>
					 </view>
				</view>
				<view class="flexaround same border-bottom">
					<view>温度(℃):</view>
					<input class="uni-input" type="text" v-model="tempreture" />
				</view>
				<view class="flexaround same border-bottom">
					<view>压力(kPa):</view>
					<input class="uni-input" type="text" v-model="kpa"  /> 
				</view>
				<view class="flexaround same border-bottom">
					<view>持续时间(分):</view>
					<input class="uni-input" type="text" v-model="munite" />
				</view>
				
				<view class="flexaround same border-bottom">
					<view>物理检测</view>
					<view>
						<button  type="default" size="mini" :class="{'standard':ifwlstandard}" @click.stop="wlstandard">合格</button>
						<button  type="default" size="mini" :class="{'unstandard':!ifwlstandard}"  @click.stop="wlunstandard">不合格</button>
					</view>
				</view>
					<view class="flexaround same border-bottom">
					<view>化学检测</view>
					<view>
						<button :class="{'standard':ifhxstandard}" type="default" size="mini" @click.stop="hxstandard">合格</button>
						<button :class="{'unstandard':!ifhxstandard}" type="default" size="mini" @click.stop="hxunstandard">不合格</button>
					</view>
				</view>
				<view class="flexaround same border-bottom" style="margin-bottom:50px;">
					<view>生物检测</view>
					<view>
						<button :class="{'standard':ifswstandard}" type="default" size="mini" @click.stop="swstandard">合格</button>
						<button :class="{'unstandard':ifswunstandard}" type="default" size="mini" @click.stop="swunstandard">不合格</button>
					</view>
				</view>
				<view class="surecheck flexcenter" @click.stop="surecheck">
					确定
				</view>
				<selfDialogComponent v-if="showDialog">
					<view slot="content">
					     确认换锅?
					</view>
					<view slot="footer">
						<button type="default" size="mini"  @click.stop="showDialog=false;remark='';">取消</button>
						<view style="display:inline-block;width:20upx;"></view>
						<button type="primary" size="mini"  @click.stop="surechangepan">确认</button>
					</view>
					 
				</selfDialogComponent>
				
			    <view v-show="showunqualityReson">
					<unqualityReson  @afterMachine="onAfterMachine($event)" @reson="onReson($event)" :machines="machines" :unqualityResons="unqualityResons" @closeUnqualityReson="onCloseUnqualityReson"></unqualityReson>
				</view>
				
			
			</view>

		</view>
	</maincomponent>
</template>
<script>
	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";
	import MxDatepicker from "../../components/uni-ui/mx-datepicker/mx-datepicker.vue";
	import selectComponent from "../../components/base/search-select.vue";
	import unqualityReson from "../../components/qualitycheck/sterilization-unquality-reson.vue";
    import selfDialogComponent from "../../components/base/self-dialog.vue";


	import {
		mapGetters,
		mapMutations
	} from "vuex";
	import {
		publicSelect,sterilizationcheck,getsterilizationList ,sterilizationchangepan
	} from "../../common/api.js";

	

	import {
		myMixin
	} from "../../common/mixins.js";
	import {
		formatDate
	} from "../../common/tool.js";
	
	
	let reson;
	let afterMachine;


	export default {
		mixins: [myMixin],
		components: {
			maincomponent,
			navbarComponent,
			loginInformationComponent,
			MxDatepicker,
			selectComponent,
			unqualityReson,
			selfDialogComponent

		},
		data() {
			return {
				ifswstandard:false,
				ifswunstandard:false,
				ifwlstandard:true,
				ifhxstandard:true,
				startDt:'',
				endDt:'',
				showunqualityReson:false,
				// selectTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
				showDialog: false,
				homeHeight: '100',
				unqualityResons:[],
				tempreture:'',
				 kpa:'',
				  munite:'',
				machines:[],
				jumpPage:''
			}
		},
		computed: {
			...mapGetters(["loginForm","activesterilizationMachine"])
		},
		onLoad(option){
			this.jumpPage=option.id;
		},
	
		created(){
			console.log(this.activesterilizationMachine,'this.activesterilizationMachine');
			this.startDt = this.activesterilizationMachine.start_dt.substring(11, this.activesterilizationMachine.start_dt.length);
			this.endDt = this.activesterilizationMachine.end_dt.substring(11, this.activesterilizationMachine.end_dt.length);
			this.sterunstandardreson();
			this.getsterilizationList();
		},
		methods: {
			refreshpage(){
				console.log(this.jumpPage,'this.jumpPage');
				if(this.jumpPage=="sterilizationresult"){
					 this.$bus.emit('refreshsterilizationresult');
				}else{
					 this.$bus.emit('refreshsterilizationItem',this.activesterilizationMachine);
				}
				  uni.navigateBack({
						delta: 1
					}); 
			},
			async surechangepan(){//换锅
				 this.showDialog=false;
				 let data=this.checkdata();
				let res=await sterilizationcheck(data);
				  console.log(res,'换锅不合格');
				 this.changepan(data);
				
			},
			surecheck(){
               if((!this.ifwlstandard||!this.ifhxstandard||!this.ifswstandard)&&afterMachine){//换锅
				   this.showDialog=true;
				   return;
			   }
				this.docheck();
			},
			changepan(data){
				Object.assign(data.Mj,{},{
					"aft_d_gc":afterMachine.d_gc,
					"aft_dev_id":afterMachine.dev_id,
					"aft_dev_name":afterMachine.dev_name,
					"aft_t_gc":afterMachine.t_gc});
				
				sterilizationchangepan(data).then(res=>{
					console.log(res,'换锅结果')
					if(res.status=="OK"){
					   this.toast("换锅成功");
					   setTimeout(()=>{
						   	uni.navigateBack({
						   	delta: 1
						   });
					   },200)
					
					}
					if(res.status=="error"){
					  this.toast(res.message);
					 }
				})
			},
			checkdata(){
				let data;
			    data={
					"Mj":{
						"did":this.loginForm.deptId,
						"temp":this.tempreture,
						"pres":this.kpa,
						"jgms":this.activesterilizationMachine.jgms,
						"type":this.activesterilizationMachine.type,
						"plan_time_name":this.activesterilizationMachine.plan_time_name,
						"sb_type":this.activesterilizationMachine.sb_type,
						"state":this.activesterilizationMachine.state,
						"state_name":this.activesterilizationMachine.state_name,
						"cre_uid":this.loginForm.userId,
						"cre_uname":this.loginForm.userName,
						"d_gc":this.activesterilizationMachine.d_gc,
						"dev_id":this.activesterilizationMachine.dev_id,
						"dev_name":this.activesterilizationMachine.dev_name,
						"end_dt":this.activesterilizationMachine.end_dt,
						"id":this.activesterilizationMachine.id,
						"hx_result":this.ifhxstandard?'1':'0',
						"plan_time":this.activesterilizationMachine.plan_time,
						"start_dt":this.activesterilizationMachine.start_dt,
						"time":this.munite,
						"t_gc":this.activesterilizationMachine.t_gc,
						"sw_result":this.ifswstandard?'1':this.ifswunstandard?'0':'',
						"wl_result":this.ifwlstandard?'1':'0'},"LoginForm":this.loginForm
				}
				if(this.ifhxstandard&&this.ifwlstandard&&!this.ifswunstandard){//合格
				    return data;
				}
				else{//不合格
				console.log(reson,'reson');
				    Object.assign(data,{},{result:'0',"bhgyy_id":reson?reson.aaa102:'',"bhgyy_name":reson?reson.aaa103:''});
					return data;
				}
				
				
				
			},
		
			docheck(){
				let data=this.checkdata();
				sterilizationcheck(data).then(res=>{
						console.log(res);
					if(res.status=="OK"){
					   this.toast("检定成功");
					   this.refreshpage();
					    // this.$bus.emit('refreshsterilizationItem',this.activesterilizationMachine);
// 					   setTimeout(()=>{
// 						   	uni.navigateBack({
// 						   	delta: 1
// 						   });
// 					   },200)
					
					}
					if(res.status=="error"){
					  this.toast(res.message);
				     }
				
				})
			},

			onAfterMachine(e){
				afterMachine=e;
			},
			onReson(e){
				reson=e;
			},
			sterunstandardreson(){
				const data={"AA10":{"aaa100":"MJ_BHGYY"},"LoginForm":this.loginForm};
				publicSelect(data).then(res=>{
					console.log(res,'不合格原因');
				  if(res.errorCode=="0"){
					  this.unqualityResons=res.returnValue.AA10List;
				  }
				  if(res.status=="error"){
					  this.toast(res.message);
				  }
				})
			},
			getsterilizationList:_.throttle(function(){//获取多个灭菌机
			    this.$loading();
				const data={"Sbxx":{"did":this.loginForm.deptId,"is_inv":"1","sb_type":"3~4~5"},"LoginForm":this.loginForm};
				
				getsterilizationList(data).then(res=>{
					console.log(res,'灭菌机列表');
					this.$loading(false);
				    if(res.errorCode=="0"){
					   this.machines=res.returnValue.SbxxList;
					}
				})
			},500,{ 'trailing': false }),
			swstandard(){
				this.ifswstandard=!this.ifswstandard;
				this.ifswunstandard=false;
			},
			swunstandard(){
				this.ifswunstandard=!this.ifswunstandard;
				this.ifswstandard=false;
				this.showunqualityReson=true;
			},
			hxstandard(){
				this.ifhxstandard=true;
			},
			hxunstandard(){
				this.ifhxstandard=false;
				this.showunqualityReson=true;
			},
			wlstandard(){
				this.ifwlstandard=true;
			},
			wlunstandard(){
				this.ifwlstandard=false;
				this.showunqualityReson=true;
			},

			onCloseUnqualityReson(e){
				this.showunqualityReson=false;
			},
// 			onSelected(e) {
// 				let month = Number(e.month) < 10 ? ("0" + e.month) : e.month;
// 				let date = Number(e.date) < 10 ? ("0" + e.date) : e.date;
// 				// this.selectTime=month+"/"+date;
// 				this.selectTime = e.value;
// 			},

			scrolltoBottom() {
				this.page++;
				this.loadingType = 2;
			},



		




			setDomHeight() {
				let _this = this;
				const query = uni.createSelectorQuery();
				let view = query.select('.wash-check-main');
				view.boundingClientRect(data => {
					uni.getSystemInfo({
						success: function(res) {
							_this.homeHeight = data.height;
						}
					});
				}).exec();

			}


		},
		onReady() {
			// setTimeout(()=>{this.setDomHeight();},200)
			
		}
	}
</script>

<style lang="scss">
	@import "../../common/global.scss";

	/* #ifdef APP-PLUS */
	.wash-check-content {
		width: 100%;
		position: absolute;
		top: var(--status-bar-height);
		left: 0;
		overflow-y: hidden;
		height: calc(100vh - var(--status-bar-height));
	}
	/*  #endif  */
	/* #ifdef H5 */
	.wash-check-content {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		overflow-y: hidden;
		height: 100vh;
	}
	/*  #endif  */
	.wash-check-content {
		display: flex;
		flex-direction: column;
	


// 		.program-detail {
// 			display: flex;
// 			align-items: center;
// 			padding: 20upx;
// 			.program-detail-time{
// 				margin:0 15upx;
// 				font-size: 33upx;
// 				color: #666666;
// 			}
// 			.program-text{
// 				margin:0 15upx;
// 				font-size: 29upx;
// 				color: #A5A5A5;
// 			}
// 		}
// 


		.same {
			padding: 20upx 30upx;
			font-size: 35upx;
			flex: none;
			&>input{
				flex:1;
				padding-left:10upx;
			}
		}
		.standard{
			// background-color: #0080FF;
			background-color: #2B9939;
			margin-right:5upx;
			color: white;
		}
		.unstandard{    
			margin-left:5upx;
			background-color: #FA6865;
			color: white;
		}
		.surecheck{
			box-sizing: border-box;
			height:90upx;
			font-size:45upx;
			color:white;
			background-color: #0080FF;
			position:absolute;
			bottom:0;
			left:0;
			padding:40upx;
			width:100%;
		}
		
		
// 		.start-wash {
// 			border-top: 1upx solid $bordercolor;
// 			background: #0080FF;
// 			font-size: 38upx;
// 			color: #FFFFFF;
// 			height: 100px;
// 			flex:none;
// 		
// 			view {
// 				width: 50%;
// 				height: 100%;
// 				line-height: 100px;
// 				text-align: center;
// 			}
// 		
// 			view:first-child {
// 				border-right: 1upx solid $bordercolor;
// 				background: #FA6865;
// 				box-shadow: 0 0 0 0 #E5E5E5;
// 			}
// 		
// 			view:last-child {
// 				background-color: #0080FF;
// 			}
// 		
// 		}

		.wash-check-main {
			flex: 1;

		
		}


		.wash-check-header {
			flex: none;

			.header-right {
				color: white;

				img {
					height: 10upx;
					width: 20upx;
					margin-left: 10upx;
				}
			}
		}
	}
</style>
