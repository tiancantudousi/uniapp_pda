<template>
	<maincomponent style="background-color:#FFFFFF">
		<template slot="content">
			<view class="washfree-content"  @click="packSelect=false;">
				<myloading></myloading>
				<view class="washfree-header">
					<navbarComponent :buttonList="[activeMachine.dev_name]">
						<view slot="headerRight" >
							<view v-show="selfdetailList.length" class="header-right flexcenter" @click.stop="showpotChange=true">
								换锅
							</view>
						</view>
					</navbarComponent>
					<loginInformationComponent></loginInformationComponent>
				</view>
				<potChange @onClosetemp="showpotChange=false" :washstate="'prepare'" v-if="showpotChange"></potChange>  
				<view class="daytimes same flexaround"> 
				    <view class="samesize">日锅次:{{activeMachine.d_gc}}</view>
					<view class="samesize">总锅次:{{activeMachine.t_gc}}</view>
					<view class="flexcenter wash-input">
					   <selectComponent :placeholder="'请搜索包'" @enter="onpackEnter" :clearValue="clearpack"  @click="showSelect('packSelect')" :listshow="packSelect" @chose="onChoosepack" @input="searchPack" :notshowpleaseSelect="true"  :dataList="packlist" :search="true" :lable="'bmc'"></selectComponent>
					</view>
				</view>
				<view class="select-time flexaround same">
					<view class="samesize">开始时间</view>
					<view class="flexcenter showtime" @click.stop="onShowDatePicker">
						<text>{{selectTime}}</text>
						<img  src="../../static/img/i-down1.png" class="image-down" alt="">
					</view>
				</view>
				<mx-datepicker v-model="showPicker" :init="selectTime" type="datetime" @selected="onSelected" />
			    <view class="program"  v-if="programList.length">
					<view class="program-item" :class="{'activeprogram':index==activeindex}" v-for="(item,index) in programList"   @click.stop="choseprogram(index)" :key="index">
						<view>{{item.aaa103}}</view>
						<view class="bottom-text">{{item.aaa106}}分</view>
					</view>
				</view>
				<view class="split"></view>
			
				<scroll-view v-show="selfdetailList.length" scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}" @scrolltolower="scrolltoBottom">
					<view v-for="(item,index) in selfdetailList" :key="index">
						<scrollListItem @showitemdetail="onShowitemdetail" :item="item"></scrollListItem>
					</view>
					<loadingMoreComponent :loadingType="loadingType"></loadingMoreComponent>
				</scroll-view>
				
				<view class="start-wash flexcenter" v-if="selfdetailList.length&&machineState!='update'" @click.stop="startwash">
					开始清洗({{packTotal}})
				</view>
				<view class="start-wash flexcenter" v-if="machineState=='update'" @click.stop="update">
					确认修改
				</view>
				<view class="washfree-main-noplate" v-if="!selfdetailList.length">
				        <img style="height:211px;width:200px;" src="../../static/img/image-plate.png" alt="">
						<text>请扫描清洗盘条码</text>
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
			</view>
			
		</template>
	</maincomponent>
</template>
<script>
	let timer;
	import Vue from 'vue';
	import potChange from "../../components/qualitycheck/pot-change.vue";
		

	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";

	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import scrollListItem from "../../components/wash/scroll-item.vue";
	import MxDatepicker from "../../components/uni-ui/mx-datepicker/mx-datepicker.vue";
	import selectComponent from "../../components/base/search-select.vue";
	// import Bus from "../../common/bus.js";
	import {clone} from "../../common/clone.js";

	// import mInput from "../../components/uni-ui/m-input/m-input.vue";
	

	import {
		mapGetters,
		mapMutations
	} from "vuex";

	import selfDialogComponent from "../../components/base/self-dialog.vue";
	import {
		publicSelect,
		searchPack,
		addpack,
		startwash,
		getSystemTime,
		update
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
			selectComponent,
			potChange

		},
		data() {
			return {
				selectTime:formatDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
				showPicker:false,
				qualityList:[1,2,3,4,5,6,7,8,9,10,11,12,13],
				loadingType:2,
				page:1,
				pageSize:20,
				showDialog:false,
				stateList:[{hstype_name:'123'}],
				homeHeight:'100',
				programList:[],
				packlist:[],
				selfdetailList:[],
				packTotal:0,
				activeindex:-1,
				machineState:'',
				updateProId:'',
				showpotChange:false,
				packSelect:false,
				clearpack:false
				// bus:Bus
			}
		},
		computed: {
			...mapGetters(["loginForm","detailList","activeMachine","sysTemTime"])
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
			  if(option.id=="update"){
							  this.machineState=option.id;
							  // this.selectTime=this.getsystime();
							  this.updateProId=this.activeMachine.proc_id;
			  }
			  this.getwashProgram();
			  this.selfdetailList=clone(this.detailList);
			  this.countpackTotal();
			  this.setsystime();
			  this.$bus.on('onBarCode', (e) => {
			  	this.judgeScanType(e.data);
			  });
		},
		
	

		methods: {
			onShowitemdetail(){
				
			},
			onpackEnter(packvalue){
				setTimeout(()=>{
					console.log(this.packlist,'this.packlist');
					let tempitem=this.packlist.find(item=>{
						return item.bmc==packvalue
					})
					if(tempitem){
						this.onChoosepack(tempitem);
					}else{
						this.clearpack=!this.clearpack;
						this.toast('该包不存在或已失效');
					}
					
				},500);
			},
			
				/*清洗enter事件功能区域*/
			judgeScanType(data){
				let reg=new RegExp('^(BB|bb)');
				if(reg.test(data)){//包扫码
					let bid = data.slice(2,data.length);
					this.onChoosepack({bid:bid});
				}		
			},
			showSelect(name){
				if(name!="packSelect"){
					this.packSelect=false;
				}
				
				setTimeout(()=>{
					this[name]=!this[name];
				},20)
			},
		
			
		
			async setsystime(){
					const datatime={"LoginForm":this.loginForm};
					let time=await getSystemTime(datatime);
					this.selectTime=time.returnValue.ServerInfo.systemtime;
			},

			async update(){

				const datatime={"LoginForm":this.loginForm};
				let time=await getSystemTime(datatime);
                let sys=time.returnValue.ServerInfo.systemtime;
				let jgms=this.countjgms(sys,this.activeMachine.start_dt,this.activeMachine.plan_time);
				const data={"Qx":
				
				{"did":this.loginForm.deptId,
				"jgms":jgms,
				"sb_type":this.activeMachine.sb_type,
				"state":this.activeMachine.state,
				"state_name":this.activeMachine.state_name,
				"d_gc":this.activeMachine.d_gc,
				"dev_id":this.activeMachine.dev_id,
				"dev_name":this.activeMachine.dev_name,
				"end_dt":this.activeMachine.end_dt,
				"id":this.activeMachine.id,
				"mod_uid":this.loginForm.userId,
				"mod_uname":this.loginForm.userName,
				"plan_time":this.programList[this.activeindex].aaa106,
				"proc_id":this.programList[this.activeindex].aaa102,
				"proc_name":this.programList[this.activeindex].aaa103,
				"start_dt":this.selectTime,
				"t_gc":this.activeMachine.t_gc},"LoginForm":this.loginForm};
				update(data).then(res=>{
					if(res.errorCode=="0"){
						console.log(res.returnValue);
						this.$bus.emit('refreshItem',this.activeMachine);
						uni.navigateBack({
							delta: 2
						});
						
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
			startwash(){
				console.log(this.activeMachine);
				if(this.activeindex==-1){
					this.toast("请选择清洗程序");
					return;
				}
				const data={"Qx":{
					"did":this.loginForm.dev_id,
					"sb_type":this.activeMachine.sb_type,
					"state":this.activeMachine.state,
					"state_name":this.activeMachine.state_name,
					"d_gc":this.activeMachine.d_gc,
					"dev_id":this.activeMachine.dev_id,
					"dev_name":this.activeMachine.dev_name,
					"plan_time":this.programList[this.activeindex].aaa106,
					"proc_id":this.programList[this.activeindex].aaa102,
					"proc_name":this.programList[this.activeindex].aaa103,
					"start_dt":this.selectTime,
					"t_gc":this.activeMachine.t_gc},"LoginForm":this.loginForm};
					startwash(data).then(res=>{
						console.log(res,"开始清洗");
						if(res.errorCode=="0"){
							this.$bus.emit('refreshItem',this.activeMachine);
							uni.navigateBack({
								delta: 1
							});
						}
					})
			},
			countpackTotal(){//计算包总数
				this.packTotal=0;
				this.selfdetailList.forEach(item=>{
					this.packTotal+=item.b_num;
				})
			},
			onChoosepack(item){
			
			
				this.packSelect=false;
				let pack=this.setbNum(item.bid);
				this.$loading();
				const data={"Hsqxdy":{"b_num":pack.b_num,"isChecked":false,"bid":item.bid,"qx_d_gc":this.activeMachine.d_gc,"qx_dev_id":this.activeMachine.dev_id,"qx_dev_name":this.activeMachine.dev_name,"qx_t_gc":this.activeMachine.t_gc},"LoginForm":this.loginForm};
			    addpack(data).then(res=>{
					console.log(res,'添加包');
						this.$loading(false);
					
					if(res.errorCode=="0"){
						
						if(pack.index==null){
							let temppack=res.returnValue.hsqxdyList.map(element=>{
								return {bid:element.bid,bmc:element.bmc,checked:element.checked,py_code:'',b_num:1}
							})
							this.selfdetailList.unshift(temppack[0]);
						}else{
							this.selfdetailList[pack.index].b_num=pack.b_num;
						}
						 this.countpackTotal();
						
						
					}
					if(res.status=="error"){
						this.toast(res.message);
					}
				
				})
			},
			setbNum(bid){
				let ifpack=_.find(this.selfdetailList,{bid:bid});
				let index=null;
				console.log(ifpack);
				if(ifpack&&ifpack.basket_name){//不能给带清洗盘的添加包
					ifpack=null;
				}else{
					index=_.findIndex(this.selfdetailList,ifpack);
				}
				return ifpack?{b_num:ifpack.b_num+1,index:index}:{b_num:1,index:null};
			},
			searchPack(e){
				clearInterval(timer);
				this.packSelect=true;
				timer=setTimeout(()=>{
					const data={"Bpzgl":{"py_code":e},"PageReq":{"page":"1","rows":"10"},"LoginForm":this.loginForm};
					searchPack(data).then(res=>{
						console.log(res,'搜索包');
						 if(res.errorCode=="0"){
							this.packlist=res.returnValue.rows;
							 // Vue.set(this.washList,itemIndex,res.returnValue.qxjStateList[0]);
						}
					})
				},300)
				
			},
			getwashProgram(){
				const data={"AA10":{"aaa100":"QXCX"},"LoginForm":this.loginForm};
				publicSelect(data).then(res=>{
					console.log(res,'清洗程序')
					 if(res.errorCode=="0"){					
						this.programList=res.returnValue.AA10List;
								  if(this.machineState=="update"){
									 this.activeindex=_.findIndex(this.programList,{aaa102:this.updateProId})
									 console.log(this.activeindex);
								  }
					}
				})
			},
			onSelected(e){
				let month=Number(e.month)<10?("0"+e.month):e.month;
				let date=Number(e.date)<10?("0"+e.date):e.date;
				// this.selectTime=month+"/"+date;
				this.selectTime=e.value;
			},
			onShowDatePicker(){//显示
                this.showPicker = true;
				console.log('11');
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
			...mapMutations(['setdetailList']),
			
		

		},
	
		onReady() {
		   if(this.detailList.length){
		  	  setTimeout(()=>{this.setDomHeight()},500);
		  }
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../common/global.scss";

	/* #ifdef APP-PLUS */
	.washfree-content {
		width:100%;
		position:absolute;
		top:var(--status-bar-height);
		left:0;
		overflow-y: hidden;
		height: calc(100vh - var(--status-bar-height));
	}
	/*  #endif  */
	/* #ifdef H5 */
	.washfree-content {
		height:100vh;
	}
	/*  #endif  */
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
			flex:none;
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
			overflow: hidden;
			text{
				margin-top:50upx;
				font-size: 33upx;
				color: #A5A5A5;
			}
		}
		.home-content {
			flex: 1;
			
		}
		.start-wash{
			flex:none;
			background: #0080FF;
			font-size: 38upx;
			color: #FFFFFF;
			height:100px;
		}
		.image-down{
			flex:none;
			width:30upx;
			height:15upx;
			margin-left:10upx;
		}
		.select-state{
			display:flex;
			align-items: center;
			border-bottom:1upx solid $bordercolor;
		
			.chose{
				    margin-left:10upx;
					font-size: 29upx;
			}
		}

		.washfree-header {
			height:154upx;
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
