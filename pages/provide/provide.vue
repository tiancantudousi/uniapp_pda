<template>
	<view class="maincontent" @click="closeAllselect">
		<view class="status_bar"></view>
		<myloading></myloading>
<!-- 		<groundingDetailComponent v-if="togglegrounding" @closeDetail="togglegrounding=false" :tmid="chosePack.choseTmid"
		 :bmc="chosePack.bmc"></groundingDetailComponent> -->

		<view class="grounding-header">
			<navbarComponent @stepClick="onStepClick" :buttonList="['申领','直接','统计']"></navbarComponent>
			<loginInformationComponent></loginInformationComponent>
		</view>
		<mx-datepicker v-model="showPicker" :init="selectTime" type="date" @selected="onSelected" />
		<!-- 		 <cencusComponent v-if="activeTabIndex==2" :loadingmore="loadingmore"></cencusComponent>
		 <changeshelvesComponent v-if="activeTabIndex==1"></changeshelvesComponent> -->
		 <cencusComponent :loadingmore="loadingmore" v-if="activeTabIndex==2"></cencusComponent>
		 <directProvideComponent v-if="activeTabIndex==1"></directProvideComponent>
	<!-- 	 <view class="provide-direct" v-if="activeTabIndex==1">
			 	<view v-for="(item,index) in provideList" :key="index">
			 	
			 	<directProvideComponent :item="item"></directProvideComponent>
			 </view>
			 <loadingMoreComponent v-if="provideList.length" :loadingType="loadingType"></loadingMoreComponent>
			  
		 </view> -->
         
		<view class="provide-content" @click="closeAllselect" v-show="activeTabIndex==0">
			<view class="provide-top">
				<view class="flexaround samestyle border-bottom">
					<view class="flexcenter showtime" @click.stop="onShowDatePicker('start')">
						<text>{{startTime}}</text>
						<img src="../../static/img/i-down1.png" class="image-down" alt="">
					</view>
					<view class="flexcenter showtime" @click.stop="onShowDatePicker('end')">
						<text>{{endTime}}</text>
						<img src="../../static/img/i-down1.png" class="image-down" alt="">
					</view>

				</view>
				 <view class="flexaround samestyle border-bottom">
					<view class="flexcenter">
						<text style="flex:none;">大楼:</text>
						<selectComponent @click="showSelect('buildSelect')" :listshow="buildSelect" @chose="onChoosebuild"  :dataList="builds" :lable="'dlname'"></selectComponent>
					</view>
					<view class="flexcenter">
						<text style="flex:none;">大楼楼层:</text>
						<selectComponent @click="showSelect('floorSelect')" @chose="onChoosefloor" :listshow="floorSelect" :clearValue="clearfloor" :dataList="floors" :lable="'lcname'"></selectComponent>
					</view>
				
				</view>
				<view class="samestyle border-bottom" style="display:flex;align-items: center;">
					<text style="flex:none;">科室:</text>
					<vmodelselectComponent :placeholder="'科室'" v-model="dept"  @click="showSelect('deptSelect')" :listshow="deptSelect" :search="true" @chose="onChoosedept" @input="searchList" :dataList="kslist" :lable="'de_deptname'" ></vmodelselectComponent>
			<!-- 		<selectComponent @click="showSelect('deptSelect')" :listshow="deptSelect" @chose="onChoosedept"   @input="searchList" :clearValue="cleardept" :dataList="kslist" :search="true"
					 :lable="'de_deptname'"></selectComponent> -->
				<!-- 	<input class="uni-input"  @click="showSelect('deptSelect')" type="text" @input="searchList" v-model="dept" placeholder="科室" @blur="cleandeptfun" />
					 <view class="kslistcontent" v-if="deptSelect&&kslist.length">
					 	<scroll-view scroll-y="true" v-if="kslist.length" class="scroll-Y">
					 		<view class="listItem" v-for="(item, itemIndex) in kslist" @click.stop="onChoosedept(item)" :key="itemIndex">
					 			{{item.de_deptname}}</view>
					 	</scroll-view>
					 </view> -->
				</view>

			</view>




			
			<view class="provide-list">
				<view v-for="(item,index) in provideList" :key="index">
					<!-- <view v-for="(item,index) in togroundingList" v-show="visableIndex<=index&&index<=visableIndex+visablenum" :key="index" :class="{'scrollItem':index==0}"> -->
					<provideListItemComponent   :item="item"></provideListItemComponent>
				</view>
				<loadingMoreComponent v-if="provideList.length" :loadingType="loadingType"></loadingMoreComponent>
			</view>
		</view>

	  </view>
	</view>
</template>
<script>
	import navbarComponent from "../../components/nav-bar/nav-bar-base.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";
	import provideListItemComponent from "../../components/provide/provide-list-item.vue";
	import directProvideComponent from "../../components/provide/providedirect.vue";
	import cencusComponent from "../../components/provide/cencus.vue";
	
	import loadingMoreComponent from "../../components/base/uni-load-more.vue";


	import MxDatepicker from "../../components/uni-ui/mx-datepicker/mx-datepicker.vue";
	import vmodelselectComponent from "../../components/base/vmodel-search-select.vue";


	// import mInput from "../../components/uni-ui/m-input/m-input.vue";


	import {
		mapGetters,
		mapMutations
	} from "vuex";

		import selectComponent from "../../components/base/search-select.vue";

	import {
       getdeptbyfloor,getfloors, getbuilds,getprovideList

	} from "../../common/api.js";
	import {
		myMixin
	} from "../../common/mixins.js";
	import {
		formatDate
	} from "../../common/tool.js";

	let page = 1;
	let pageSize = 20;
	let deptlist=uni.getStorageSync('deptlist');
	let build;
	let floor;
	let dept;





	export default {
		mixins: [myMixin],
		components: {
			navbarComponent,
			loginInformationComponent,
			provideListItemComponent,
			selectComponent,
			loadingMoreComponent,
			MxDatepicker,
			directProvideComponent,
			cencusComponent,
			vmodelselectComponent
			// mInput

		},
		data() {
			return {
				startTime:formatDate(new Date(), "yyyy-MM-dd"),
				endTime:formatDate(new Date(), "yyyy-MM-dd"),
				activeTabIndex: 0,
				dept:'',
				toggleList:false,
				currentDept:'',
				// dataList:[],
				showPicker: false,
				selectTime: formatDate(new Date(), "yyyy-MM-dd"),
				timestate: '',
				provideList:[],
				showdetail:false,
				tmid:'',
				loadingType: 2,
				buildSelect:false,
				builds:[],
				kslist:[],
				clearfloor:false,
				cleardept:false,
				floors:[],
				floorSelect:false,
				deptSelect:false,
				loadingmore:false
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
	       // this.searchDeptsthrottle('', dataSource);
		   this.setbasedata();
		   this.getbuilds();
		   this.getprovideList();
		   this.settime();
// 			this.$bus.on('onBarCode', (e) => {
// 				this.judgeScanType(e.data);
// 			});
		},
	
		methods: {
			setbasedata(){
				page = 1;
				pageSize = 20;
				deptlist=uni.getStorageSync('deptlist');
				build='';
				floor='';
				dept='';
			},
			onChoosedept(item) {
				this.deptSelect=false;
				if (item != null && dept == item.de_deptid) {
					return;
				}
				
				dept = item ? item.de_deptid : '';
				this.dept=item ? item.de_deptname : '';
				this.getprovideList();
			},
			getprovideList(){
				this.provideList = [];
				const data={"SlDtl":{"did":dept,"end_dt":this.endTime+" 23:59:59","ffList":[],"hb_num":0,"jb_num":0,"jsb_num":0,"start_dt":this.startTime+" 00:00:00"},"LoginForm":this.loginForm};
				console.log(data,'列表ddata');
				getprovideList(data).then(res=>{
					console.log(JSON.stringify(res),'申领单列表');
					if(res.status=="OK"){
						if(!res.returnValue.FfList.length){
							this.toast('未查询到相关记录!');
							return;
						}
						this.provideList=res.returnValue.FfList;
						this.subtime(this.provideList);
					}else{
						this.toast(res.message);
					}
				})
			},
			subtime(list){
				list.forEach(item=>{
					item.sl_dt=item.sl_dt.substring(11,item.sl_dt.length);
				})
			},
			searchList() {
					this.searchDeptsthrottle(this.dept, deptlist).then(res => {
						console.log(res,'科室列表');
					this.kslist = res;
				});
			},
			closeAllselect(){
				this.floorSelect=false;
				this.deptSelect=false;
				this.buildSelect=false;
			
			},
			showSelect(name){
			    if(name!="floorSelect"){
					this.floorSelect=false;
				}
				if(name!="deptSelect"){
					this.deptSelect=false;
				}
				if(name!="buildSelect"){
				   this.buildSelect=false;
				}
			
			    setTimeout(()=>{
					this[name]=!this[name];
				},20)
				
			},
			getfloors() {
				this.floors = [];
				const data = {
					"Lcxx": {
						"dlbh": build
					},
					"LoginForm": this.loginForm
				};
				getfloors(data).then(res => {  
			
					this.floors = res.returnValue.lcxxList.map(item => {
						return {
							lcname: item.lcname,
							lcbh: item.lcbh
						}
					});
					console.log(res, 'floors');
				})
			},
			getbuilds() {
				const data = {
					"Dlxx": {},
					"LoginForm": this.loginForm
				};
				getbuilds(data).then(res => {
					this.builds = res.returnValue.dlxxList.map(item => {
						return {
							dlname: item.dlname,
							dlbh: item.dlbh
						};
					});
					console.log(res, 'builds');
				})
			},
			onChoosefloor(item) {
				this.floorSelect=false;
				if (item != null && floor == item.lcbh) {
					return;
				}
				this.cleardept = !this.cleardept;
			
				
				floor = item ? item.lcbh : '';
				this.getdeptbyfloor();
				console.log(item);
			},
			getdeptbyfloor() {
				
				const data = {
					"Kslcgx": {
						"dlbh": build,
						"lcbh": floor
					},
					"LoginForm": this.loginForm
				}
				console.log(data,'getdeptbyfloor');
				getdeptbyfloor(data).then(res => {
					console.log(JSON.stringify(res));
					deptlist = res.returnValue.ksxxList.map(item => {
						return {
							de_deptname: item.deptname,
							de_deptid: item.deptid,
							alph:item.alph
						};
					});
					this.searchList(''); //默认取前15个
				})
			},
			onChoosebuild(item) {
				this.buildSelect=false;
				if (item != null && build == item.dlbh) {
					return;
				}
				
				build = item ? item.dlbh : ''; 
				floor = '';
				this.clearfloor = !this.clearfloor;
				this.cleardept = !this.cleardept;
			
				if (item) {
					this.getdeptbyfloor();
					this.getfloors();
				}else{
					deptlist = uni.getStorageSync('deptlist'); //设置默认科室列表为登录页科室列表
					this.kslist = this.searchDepts('', deptlist);
				}
			},
			onShowdetail(item){
				this.showdetail=true;
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
// 			onSearch(e) {
// 				this.currentDept=null;
// 				if (!this.toggleList) {
// 					this.toggleList = true;
// 				}
// 				// console.log(e.target.value);
// 				this.searchDeptsthrottle(e.target.value, dataSource).then(res => {
// 					this.dataList = res;
// 				});
// 			
// 			
// 			},
// 			onChoseKs(e) {
// 				this.dept = e.de_deptname;
// 				this.currentDept = e;
// 			},
			onSelected(e) {
				this.initparmas();
				let year = e.year;
				let month = Number(e.month) < 10 ? ("0" + e.month) : e.month;
				let date = Number(e.date) < 10 ? ("0" + e.date) : e.date;
				let time = year + "-" + month + "-" + date;
				this.timestate == 'end' ? this.endTime = time : this.startTime = time;
			    this.settime();
			   this.getprovideList();
			},
			settime(){
				 uni.setStorageSync('providedetailstart', this.startTime);
				  uni.setStorageSync('providedetailend', this.endTime);
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
		left: 0;
		width: 100%;
		top: 270upx;
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
	.provide-direct{
			width: 100%;
		position: absolute;
		top: calc(154upx + var(--status-bar-height));
		left: 0;
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
