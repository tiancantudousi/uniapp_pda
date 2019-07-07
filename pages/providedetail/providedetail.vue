<template>
	<view class="maincontent">
		<view class="status_bar"></view>
		<myloading></myloading>
<!-- 		<groundingDetailComponent v-if="togglegrounding" @closeDetail="togglegrounding=false" :tmid="chosePack.choseTmid"
		 :bmc="chosePack.bmc"></groundingDetailComponent> -->

		<view class="grounding-header">
			<navbarComponent @stepClick="onStepClick" :buttonList="[item.deptname]"></navbarComponent>
			<loginInformationComponent></loginInformationComponent>
		</view>
		<!-- <mx-datepicker v-model="showPicker" :init="selectTime" type="date" @selected="onSelected" /> -->
		<!-- 		 <cencusComponent v-if="activeTabIndex==2" :loadingmore="loadingmore"></cencusComponent>
		 <changeshelvesComponent v-if="activeTabIndex==1"></changeshelvesComponent> -->

		<view class="provide-content">
			<view class="provide-top">
				<view class="flexaround samestyle border-bottom">
					
					
					<view class="showtime" style="flex:1;">
						{{item.sl_dt}}
					</view>
					<input class="uni-input" style="flex:1;"  type="text" v-model="tmid" confirm-type="search" @confirm="providepass()" placeholder="请录入包条码" />

				</view>
	

			</view>




			
			<view class="provide-list">
					<view v-for="(item,index) in provideList" :key="index">
					<!-- <view v-for="(item,index) in togroundingList" v-show="visableIndex<=index&&index<=visableIndex+visablenum" :key="index" :class="{'scrollItem':index==0}"> -->
					<provideListItemComponent   :item="item"></provideListItemComponent>
				</view>
				<loadingMoreComponent v-if="provideList.length" :loadingType="loadingType"></loadingMoreComponent>
			</view>
			
	<!-- 		<view class="sure-changeshelves flexcenter" @click.stop="surechangeshelves">
				确认发放(1)
			</view> -->
			 
			






			<view class="xydialig" v-if="showDialog" @click.stop="">
				<view class="xydialig-title">
					<text class="btm">包条码:</text>
					<text class="bid">{{tmid}}</text>
				</view>
				<veiw class="tip">已发放,是否撤销!</veiw>
				<view class="xydialig-content" style="text-align: center;padding-top:50upx;">
					<button type="default" size="mini" @click="showDialog=false">否</button>
					<button type="primary" size="mini" @click="cancleff">是</button>
				</view>
			</view>
		</view>

	</view>
	</view>
</template>
<script>
	import navbarComponent from "../../components/nav-bar/nav-bar-base.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";
	import provideListItemComponent from "../../components/provide/provide-detail-item.vue";
	
	import loadingMoreComponent from "../../components/base/uni-load-more.vue";


	import MxDatepicker from "../../components/uni-ui/mx-datepicker/mx-datepicker.vue";


	// import mInput from "../../components/uni-ui/m-input/m-input.vue";


	import {
		mapGetters,
		mapMutations
	} from "vuex";
	import selectComponent from "../../components/grounding/search-select.vue";

	import {
getprovideDetail,providepass,cancleff

	} from "../../common/api.js";
	import {
		myMixin
	} from "../../common/mixins.js";
	import {
		formatDate
	} from "../../common/tool.js";

	let page = 1;
	let pageSize = 20;
	let dataSource=uni.getStorageSync('deptlist');





	export default {
		mixins: [myMixin],
		components: {
			navbarComponent,
			loginInformationComponent,
			provideListItemComponent,
			selectComponent,
			loadingMoreComponent,
			MxDatepicker
			// mInput

		},
		data() {
			return {
				item:'',
				startTime:formatDate(new Date(), "yyyy-MM-dd"),
				endTime:formatDate(new Date(), "yyyy-MM-dd"),
				activeTabIndex: 0,
				dept:'',
				toggleList:false,
				currentDept:'',
				dataList:[],
				showPicker: false,
				selectTime: formatDate(new Date(), "yyyy-MM-dd"),
				timestate: '',
				provideList:[{hstype_name:'已过期'},2,3,4,5,6,7,8,9,12,21,21,2,2,2,2,2,2,2,2,2,2,2,2],
				showdetail:false,
				tmid:'',
				loadingType: 2,
				showDialog:false
			}
		},
		computed: {
			...mapGetters(["loginForm"])
		},
		onReachBottom() {
			if (this.activeTabIndex == 2) {
				this.loadingmore = !this.loadingmore;
			}
		},
// 		onUnload() {
// 			this.$bus.off('onBarCode');
// 		},
		onBackPress() {
			if (this.$store.state.loading) {
				this.$store.commit("switch_loading", false);
			}
		},

		onLoad() {
			 this.item=uni.getStorageSync('providedetailitem');
			 console.log(this.item);
			 this.getprovideDetail();
	       // this.searchDeptsthrottle('', dataSource)
// 			this.$bus.on('onBarCode', (e) => {
// 				this.judgeScanType(e.data);
// 			});
		},
	
		methods: {
			cancleff(){
				this.showDialog=false;
					const data={"FfLog":{"tmid":this.tmid},
"LoginForm":this.loginForm};
							
				cancleff(data).then(res=>{
					
					console.log(res,'撤销条码');
					if(res.status=="OK"){
						this.toast('撤销成功');
						this.getprovideDetail(this.addlist,res.returnValue.Tmxx,'cancle');
						// this.addlist(res.returnValue.Tmxx,'cancle');
						
					}
					
					if(res.status=='error'){
						this.toast(res.message);
					}
					
				})
			},
			providepass(){
				if(this.tmid==''){
					this.toast('请录入条码');
					return;
				}
				const data={"FfLog":{"sl_id":this.item.sl_id,"dept_did":this.item.did,"tmid":this.tmid},"LoginForm":this.loginForm};
			
				providepass(data).then(res=>{
					console.log(res,data,'录入条码');
					if(res.status=="OK"){
						this.toast('操作成功');
						// let item=res.returnValue.Tmxx;
						this.getprovideDetail(this.addlist,res.returnValue.Tmxx,'push');
						
						// this.addlist(res.returnValue.Tmxx,'push');
						
					}
					if(res.status=="warn"){
						this.showDialog=true;
					}
					if(res.status=='error'){
						this.toast(res.message);
					}
					
				})
			},
			addlist(result,state){
				let item= {ff_dt:result.ff_dt.substring(11,result.ff_dt.length),bid:result.bid,tmid:this.tmid};
				let additem=this.provideList.find(element=>{
					return element.bid==item.bid;
				})
				if(state=='push'){
					additem.tmidlist.push(item);
				}else{
					console.log(additem.tmidlist,this.tmid);
					additem.tmidlist=additem.tmidlist.filter((element)=>{
						return element.tmid!=this.tmid;
					})
				}
				this.tmid='';
				
			},
			gettime(){
				return {end_dt:uni.getStorageSync('providedetailend'),start_dt:uni.getStorageSync('providedetailstart')}
			},
			getprovideDetail(fun,listdata,state){
				let posttime=this.gettime();
				const data={"SlDtl":{"sl_id":this.item.sl_id,"did":this.item.did,"end_dt":posttime.end_dt+" 23:59:59","ffList":[],"hb_num":this.item.hb_num,"jb_num":this.item.jb_num,"jsb_num":this.item.jsb_num,"start_dt":posttime.start_dt+" 00:00:00"},
"LoginForm":this.loginForm};
                getprovideDetail(data).then(res=>{
					console.log(res,'getprovideDetail');
					if(res.status=="OK"){
						// res.returnValue.FfList.tmidlist=[];
						this.provideList=res.returnValue.FfList.map(item=>{
							return Object.assign(item,{tmidlist:[]})
						});
						if(fun){
							fun(listdata,state);
						}
					}else{
						this.toast(res.message);
					}
				})
			},
			onShowdetail(item){
				this.showdetail=true;
			},
			closeAllselect(){
				this.toggleList=false;
			},
			onStepClick(index) {
				this.activeTabIndex = index;
			},
			cleandeptfun(){
				 this.toggleList=false;
				 if(!this.currentDept){
					 this.dept='';
				 }
							 
			},
			onSearch(e) {
				this.currentDept=null;
				if (!this.toggleList) {
					this.toggleList = true;
				}
				// console.log(e.target.value);
				this.searchDeptsthrottle(e.target.value, dataSource).then(res => {
					this.dataList = res;
				});
			
			
			},
			onChoseKs(e) {
				this.dept = e.de_deptname;
				this.currentDept = e;
			},
			onSelected(e) {
				this.initparmas();
				let year = e.year;
				let month = Number(e.month) < 10 ? ("0" + e.month) : e.month;
				let date = Number(e.date) < 10 ? ("0" + e.date) : e.date;
				let time = year + "-" + month + "-" + date;
				this.timestate == 'end' ? this.endTime = time : this.startTime = time;
			
				// this.groundingcencus();
			},
			initparmas(){
				
			},
			onShowDatePicker(state) { //显示
				this.showPicker = true;
				this.timestate = state;
			},






















		

			scrolltoBottom() {
				page++;
				this.loadingType = 1;
				// this.getTogrounding();
				console.log("loading more");
			},


		}
	}
</script>

<style lang="scss">
	@import "../../common/global.scss";
	.xydialig {
		position: absolute;
		width: 80%;
		height: 320upx;
		top: 50%;
		left: 50%;
		padding:20upx;
		transform: translate(-50%, -50%);
		background: #FFFFFF;
		box-shadow: 0 8upx 24upx 0 rgba(0, 0, 0, 0.10);
		border-radius: 4upx;
		z-index:10000;
	
		.xydialig-title {
			height: 30%;
		}
	
		.btm {
			font-size: 41upx;
			color: rgba(0, 0, 0, 0.87);
		}
	
		.bid {
			font-size: 41upx;
			color: #0080FF;
		}
	
		.tip {
			height: 30%;
			margin: 20upx 0;
			font-size: 33upx;
			color: rgba(0, 0, 0, 0.54);
	
		}
	
		.xydialig-content {
			&>button {
				width: 20%;
			}
	
			&>button:first-child {
				margin-right: 10upx;
			}
	
			&>button:last-child {
				margin-left: 10upx;
			}
		}
	}
	
	.sure-changeshelves{
		width: 100%;
		height: 110upx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index:1000;
		background-color: #0080FF;
		font-size: 37upx;
		color: #FFFFFF;
	}

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

	.grounding-header {
		position: fixed;
		width: 100%;
		z-index: 1000;
		top: var(--status-bar-height);
		left: 0;

	}
	.provide-top {
	
		position: fixed;
		width: 100%;
		left: 0;
	
		z-index: 1000;
		background-color: white;
		top: calc(154upx + var(--status-bar-height));
	}
	.samestyle {
		height: 90upx;
		padding: 20upx 30upx;
		box-sizing: border-box;
		font-size: 35upx;
	
	}
	.showtime {
		width: 50%;
		font-size: 29upx;
		color: #666666;
	
		.image-down {
			flex: none;
			width: 30upx;
			height: 15upx;
			margin-left: 10upx;
		}
	}
	
	.provide-list {
		position: absolute;
	    // margin-bottom:110upx;
		left: 0;
		width: 100%;
		top: 90upx;
		
	}
	.kslistcontent {
		position: absolute;
		top: 100%;
		left: 0;
		background-color: white;
		z-index: 10000;
		width: 100%;
	
		.scroll-Y {
			height: 300upx;
	
			.listItem {
				padding: 20upx 0 20upx 20upx;
				border-bottom: 1upx solid $bordercolor;
			}
	
			.listItem:first-child {
				border-top: 1upx solid $bordercolor;
			}
		}
	
		.uni-list::before {
			background-color: white;
	
		}
	
		.uni-list-cell__container {
			border-bottom: 1upx solid $bordercolor;
		}
	
		.uni-list-cell:first-child {
			.uni-list-cell__container {
				border-top: 1upx solid $bordercolor;
			}
		}
	
	}

	/* #ifdef APP-PLUS */
	.provide-content {
		width: 100%;
		position: absolute;
		top: calc(154upx + var(--status-bar-height));
		left: 0;
		display: flex;
		height: calc(100vh - (154upx + var(--status-bar-height)));
		flex-direction: column;
	}

	/*  #endif  */
	/* #ifdef H5 */
	.provide-content {
		width: 100%;
		position: absolute;
		top: 154upx;
		left: 0;
		display: flex;
		height: 100vh;
		flex-direction: column;
	}

	/*  #endif  */
	
</style>
