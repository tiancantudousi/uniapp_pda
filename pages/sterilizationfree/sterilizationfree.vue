<template>
	<maincomponent style="background-color:#FFFFFF">
		<view slot="content">
			<view class="washfree-content">
				<view class="washfree-header">
					<navbarComponent :buttonList="[activesterilizationMachine.dev_name]">
						<template slot="headerRight" v-if="selfdetailList.length">
							<view class="header-right flexcenter" style="background-color: red;" v-if="selfdetailList.length" @click.stop="showpotChange=true">
								换锅
							</view>
						</template>
					</navbarComponent>
					<loginInformationComponent></loginInformationComponent>
				</view>
				<potChange @onClosetemp="showpotChange=false" :washstate="'prepare'" v-if="showpotChange"></potChange>  
				<view class="daytimes same flexaround"> 
				    <view class="samesize">日锅次:{{activesterilizationMachine.d_gc}}</view>
					<view class="samesize">总锅次:{{activesterilizationMachine.t_gc}}</view>
					<view class="samesize" v-if="activesterilizationMachine.type=='1'">BD</view>
					<view class="flexcenter wash-input">
					     	<input class="uni-input" type="text" v-model="tmid" confirm-type="search" @confirm="onSearch()" placeholder="请录入包条码" />
					</view>
				</view>
			<!-- 	<view class="select-time flexaround same">
					<view class="samesize">开始时间</view>
					<view class="flexcenter showtime" @click.stop="onShowDatePicker">
						<text>{{selectTime}}</text>
						<img  src="../../static/img/i-down1.png" class="image-down" alt="">
					</view>
				</view> -->
				<!-- <mx-datepicker v-model="showPicker" :init="selectTime" type="datetime" @selected="onSelected" /> -->
			    <view class="program" v-if="programList.length">
					<view class="program-item" :class="{'activeprogram':index==activeindex}" v-for="(item,index) in programList"   @click.stop="choseprogram(index)" :key="index">
						<view>{{item.aaa103}}</view>
						<view class="bottom-text">{{item.aaa106}}分</view>
					</view>
				</view>
				<view class="split"></view>
				<view>
					<scrollListItem :item="{'bmc':'包名称','tmid':'条码号','cre_dt':'时间'}"></scrollListItem>
				</view>
			
				<scroll-view v-show="selfdetailList.length" scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}" @scrolltolower="scrolltoBottom">
					<view v-for="(item,index) in selfdetailList" :key="index">
						<scrollListItem :item="item"></scrollListItem>
					</view>
					<loadingMoreComponent :loadingType="loadingType"></loadingMoreComponent>
				</scroll-view>
				
				<view class="start-wash flexcenter" v-if="machineState!='update'" @click.stop="startsterilization">
					开始灭菌({{selfdetailList.length}})
				</view>
				<view class="start-wash flexcenter" v-if="machineState=='update'" @click.stop="update">
					确认修改
				</view>
	<!-- 			<view class="washfree-main-noplate" v-if="!selfdetailList.length">
				        <img src="../../static/img/image-plate.png" alt="">
						<text>请扫描清洗盘条码</text>
				</view>		 -->
				<selfDialogComponent v-if="showDialog">
					<view slot="content">
						{{cancletmid}}
					</view>
					<view slot="footer">
						<button type="default" size="mini"  @click.stop="showDialog=false;remark='';">取消</button>
						<view style="display:inline-block;width:20upx;"></view>
						<button type="primary" size="mini"  @click.stop="docancletmid()">确认</button>
					</view>
				</selfDialogComponent>
			</view>
			
		</view>
	</maincomponent>
</template>
<script>
	let timer;
	import Vue from 'vue';
	import potChange from "../../components/qualitycheck/sterilization-pot-change.vue";
		

	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";

	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import scrollListItem from "../../components/sterilization/scroll-item.vue";
	import MxDatepicker from "../../components/uni-ui/mx-datepicker/mx-datepicker.vue";
	// import Bus from "../../common/bus.js";
	import {clone} from "../../common/clone.js";

	// import mInput from "../../components/uni-ui/m-input/m-input.vue";
	

	import {
		mapGetters,
		mapMutations
	} from "vuex";

	import selfDialogComponent from "../../components/base/self-dialog.vue";
	import {
		docancletmid,
		inputbarcode,
		publicSelect,
		searchPack,
		addpack,
		startsterilization,
		getSystemTime,
		updatesterilization
	} from "../../common/api.js";
	import { myMixin } from "../../common/mixins.js";
	import {formatDate} from "../../common/tool.js";


	export default {
		mixins:[ myMixin ],
		components: {
			maincomponent,
			navbarComponent,
			loginInformationComponent,		
			loadingMoreComponent,
			selfDialogComponent,
			scrollListItem,
			MxDatepicker,
			potChange

		},
		data() {
			return {
				// selectTime:formatDate(new Date(),"yyyy-MM-dd"),
				// showPicker:false,
				loadingType:2,
				page:1,
				pageSize:20,
				showDialog:false,
				homeHeight:'100',
				programList:[],
				selfdetailList:[],
				activeindex:-1,
				machineState:'',
				updateProId:'',
				showpotChange:false,
				tmid:'',
				cancletmid:''
			}
		},
		computed: {
			...mapGetters(["loginForm","detailsterilization","activesterilizationMachine","sysTemTime"])
		},
		onBackPress(){
			if(this.$store.state.loading){
					this.$store.commit("switch_loading",false);
			}
		},
		onUnload(){
			 this.$bus.off('onBarCode');
		},
		onLoad(option) {
			console.log(option.id);
			 // this.setsystime();
			  if(option.id=="update"){
					  this.machineState=option.id;
					 
					  // this.selectTime=this.getsystime();
					  console.log(this.activesterilizationMachine,'修改');
					  this.updateProId=this.activesterilizationMachine.proc_id;
			  }
			  this.getsterilizationProgram();
			  this.selfdetailList=clone(this.detailsterilization);
			  this.$bus.on('onBarCode', (e) => {
			  	this.entertmid(e.data);
			  });
		},

		methods: {
	
			onSearch(){
				if(this.tmid==''){
					this.toast("包条码不能为空");
					return;
				}
		        this.entertmid(this.tmid);
			},
			entertmid(e){
				let reg=new RegExp('^(TM|tm)');
				if(reg.test(e)){//包扫码
					this.tmid = e.slice(2,e.length);
				}
				this.inputbarcode();
			},
			inputbarcode(){
				const data={"MjDtl":{"d_gc":this.activesterilizationMachine.d_gc,"dev_id":this.activesterilizationMachine.dev_id,"t_gc":this.activesterilizationMachine.t_gc,"tmid":this.tmid},"LoginForm":this.loginForm};
				inputbarcode(data).then(res=>{
					console.log(res,'录入条码');
					if(res.errorCode=="0"){
						this.toast('条码录入成功');
						let temppack=res.returnValue.MjDtlList.map(element=>{
							return {tmid:element.tmid,bmc:element.bmc,'cre_dt':element.cre_dt}
						})
						this.selfdetailList=temppack.concat(this.selfdetailList);
						this.tmid='';
					}
					if(res.status=="error"){
						this.toast(res.message);
					}
					if(res.status=="warn"){
						console.log(res);
						this.showDialog=true;
						this.cancletmid=res.message;
					}
				
			
				});
			},
			docancletmid(){
				this.showDialog=false;
				const data={"MjDtl":{"cre_uid":this.loginForm.userId,"cre_uname":this.loginForm.userName,"tmid":this.tmid},"LoginForm":this.loginForm};
				docancletmid(data).then(res=>{
					console.log(res,'撤销条码');
					if(res.errorCode=="0"){
						this.toast('撤销成功');
						this.selfdetailList=this.selfdetailList.filter(item=>{
							return item.tmid!=this.tmid;
							this.tmid='';
						})
					}
				})
			},
	
// 			async setsystime(){
// 				const datatime={"LoginForm":this.loginForm};
// 				let time=await getSystemTime(datatime);
// 				this.selectTime=time.returnValue.ServerInfo.systemtime;
// 			},
			async update(){//修改
			console.log(this.programList[this.activeindex]);
				const datatime={"LoginForm":this.loginForm};
				let time=await getSystemTime(datatime);
                let sys=time.returnValue.ServerInfo.systemtime;
				let jgms=this.countjgms(sys,this.activesterilizationMachine.start_dt,this.activesterilizationMachine.plan_time);
				const data={"Mj":
				{"did":this.loginForm.deptId,
				"jgms":jgms,
				"cre_dt":formatDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
				"type":this.activesterilizationMachine.type,
				"sb_type":this.activesterilizationMachine.sb_type,
				"state":this.activesterilizationMachine.state,
				"state_name":this.activesterilizationMachine.state_name,
				"d_gc":this.activesterilizationMachine.d_gc,
				"dev_id":this.activesterilizationMachine.dev_id,
				"dev_name":this.activesterilizationMachine.dev_name,
				"end_dt":this.activesterilizationMachine.end_dt,
				"id":this.activesterilizationMachine.id,
				"cre_uid":this.loginForm.userId,
				"cre_uname":this.loginForm.userName,
				"plan_time":this.programList[this.activeindex].aaa106,
				"proc_id":this.programList[this.activeindex].aaa102,
				"proc_name":this.programList[this.activeindex].aaa103,
				"start_dt":this.activesterilizationMachine.start_dt,
				"t_gc":this.activesterilizationMachine.t_gc},"LoginForm":this.loginForm};
				updatesterilization(data).then(res=>{
					if(res.errorCode=="0"){
				       console.log('update')
						Object.assign(res.returnValue.Mj,{},{market:"update","countdown":''})
						this.$bus.emit('refreshsterilizationItem',res.returnValue.Mj);
					
						uni.navigateBack({
							delta: 2
						});
						
					}
					if(res.status=="error"){
						this.toast(res.message);
					}
				});
				
			},
			countjgms(sys,start,plan){
				start = start.replace(new RegExp("-","gm"),"/");
				sys=sys.replace(new RegExp("-","gm"),"/");
				let leftTime =Number(plan)*60*1000-((new Date(sys)).getTime()-(new Date(start)).getTime()); //得到毫秒数
				return Math.floor(leftTime/1000);
			},
			choseprogram(index){
				this.activeindex=index;
			},
			startsterilization(){
				console.log(this.activesterilizationMachine);
				if(this.activeindex==-1){
					this.toast("请选择灭菌程序");
					return;
				}
				if(this.activesterilizationMachine.type!='1'&&this.selfdetailList.length==0){
					this.toast("请录入包条码");
					return;
				}
				const data={"Mj":{
					"is_inv":"1",
					"did":this.loginForm.dev_id,
					"sb_type":this.activesterilizationMachine.sb_type,
					"state":this.activesterilizationMachine.state,
					"state_name":this.activesterilizationMachine.state_name,
					"d_gc":this.activesterilizationMachine.d_gc,
					"dev_id":this.activesterilizationMachine.dev_id,
					"dev_name":this.activesterilizationMachine.dev_name,
					"plan_time":this.programList[this.activeindex].aaa106,
					"proc_id":this.programList[this.activeindex].aaa102,
					"proc_name":this.programList[this.activeindex].aaa103,
					"type":this.activesterilizationMachine.type,
					"t_gc":this.activesterilizationMachine.t_gc},"LoginForm":this.loginForm};
					startsterilization(data).then(res=>{
						console.log(res,'开始灭菌');
						if(res.errorCode=="0"){
							this.$bus.emit('refreshsterilizationItem',this.activesterilizationMachine);
							uni.navigateBack({
								delta: 1
							});
						}
					})
			},

			getsterilizationProgram(){
				const data={"AA10":{"aaa100":"MJCX"},"LoginForm":this.loginForm};
				publicSelect(data).then(res=>{
					console.log(res,'灭菌程序')
					 if(res.errorCode=="0"){					
						this.programList=res.returnValue.AA10List;
								  if(this.machineState=="update"){
									 this.activeindex=_.findIndex(this.programList,{aaa102:this.updateProId})
									 console.log(this.activeindex,this.programList);
								  }
					}
				})
			},

			scrolltoBottom(){
				this.page++;
			    this.loadingType=2;
			},
			

		
			
		
			setDomHeight() {
				let _this = this;
				const query = uni.createSelectorQuery();
				let view = query.select('.home-content');
				view.boundingClientRect(data => {
					_this.homeHeight = data.height;
				}).exec();

			},
			...mapMutations(['set_activesterilizationMachine']),
			
		

		},
	
		onReady() {
		 
		  	  setTimeout(()=>{this.setDomHeight()},500);
		 
		}
	}
</script>

<style lang="scss">
	@import "../../common/global.scss";


	.washfree-content {
		width:100%;
		position:absolute;
		top:var(--status-bar-height);
		left:0;
		overflow-y: hidden;
		height: calc(100vh - var(--status-bar-height));
	}


	.washfree-content {	
		display: flex;
		flex-direction: column;
		
		.split{
			background: #F3F3F3;
			height:11upx;
			flex:none;
		}
		.program{
			display:flex;
			justify-content: space-around;
			flex-wrap: wrap;
			padding: 20upx 30upx;
			.activeprogram{
				color:white;
				background-color: #0080FF;
				.bottom-text{
					color:white!important;
				}
			}
			.program-item{
				display:flex;
				text-align: center;
				flex-direction: column;
				justify-content: center;
				width:28%;
				margin:10upx;
				border: 1upx solid #0080FF;
				border-radius: 8upx;
				height:92upx;
				padding:10upx 0;
				.bottom-text{

					font-size: 25upx;
					color: #A5A5A5;

				}
			}
			.program-item.active{
				border: 1upx solid #D2D2D2; 
				color:#D2D2D2;
			}
			
		}
		.select-time{
			border-bottom:1upx solid $bordercolor;
			.showtime{
				text{
					color: #333333;
				}
			}
			img{
				width:21upx;
				height:10upx;
				margin-left:20upx;
			}
		}
		.samesize{
			font-size:33upx;
			color:#A5A5A5;
		}
		.daytimes{
			border-bottom:1upx solid $bordercolor;
			.wash-input{
				width:50%;
			}
			img{
				width:29upx;
				height:29upx;
				margin-left:15upx;
			}
		}
// 		.showtime{
// 			
// 			font-size: 29upx;
// 			color: #666666;
// 			
// 		}
		.same {
			padding: 20upx 30upx;
			font-size: 29upx;
			flex: none;
		}
		.washfree-main-noplate{
			display:flex;
			flex:1;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			img{
				width:400upx;
				height:422upx;
			}
			text{
				margin-top:50upx;
				font-size: 33upx;
				color: #A5A5A5;
			}
		}
		.home-content {
			margin-bottom:100px;
			flex: 1;
		}
		.start-wash{
			position:fixed;
			left:0;
			width:100%;
			bottom:0;
			flex:none;
			background: #0080FF;
			font-size: 38upx;
			color: #FFFFFF;
			height:100px;
		}
		.select-state{
			display:flex;
			align-items: center;
			border-bottom:1upx solid $bordercolor;
			.image-down{
				flex:none;
				width:30upx;
				height:15upx;
				margin-left:10upx;
			}
			.chose{
				    margin-left:10upx;
					font-size: 29upx;
			}
		}

		.washfree-header {
			flex:none;
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
