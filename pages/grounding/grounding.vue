<template>
	<view class="maincontent">
		<view class="status_bar">
		</view>
		<myloading></myloading>
		<groundingDetailComponent v-if="togglegrounding" @closeDetail="togglegrounding=false" :tmid="chosePack.choseTmid" :bmc="chosePack.bmc"></groundingDetailComponent>
        
		<view class="grounding-header">
			<navbarComponent @stepClick="onStepClick" :buttonList="['上架','换架','统计']">
				<template slot="headerRight">
					<view class="header-right flexcenter" v-if="showimport" @click.stop="toggleImport=!toggleImport">
						<text class="import-text">导入</text>
					</view>
				</template>
			</navbarComponent>
			<loginInformationComponent></loginInformationComponent>
		</view>
         <mx-datepicker v-model="showPicker" :init="selectTime" type="date" @selected="onSelected" />
		 <cencusComponent v-if="activeTabIndex==2" :loadingmore="loadingmore"></cencusComponent>
		 <changeshelvesComponent v-if="activeTabIndex==1"></changeshelvesComponent>
		 
		<view class="grounding-content"  @click="closeAllselect"  v-if="activeTabIndex==0">
			<view class="import" :class="{'toggleImport':toggleImport}">
				<view class="flexaround samepadding border-bottom import-input">
						<view class="flexcenter showtime" @click.stop="onShowDatePicker">
							<text>{{selectTime}}</text>
							<img src="../../static/img/i-down1.png" class="image-down" alt="">
					    </view>
						<input class="uni-input" type="text" v-model="numgc"  placeholder="请录入锅次" />
				</view>
				<!-- <view class="select-machine" @click.stop="toggleMachine"> -->
				<!-- 	{{activeMachine?activeMachine.name:'请选择灭菌机'}} -->
					<scroll-view scroll-y="true" v-if="machineList.length" class="machine-list" >
						<view class="listItem samepadding border-bottom" @click.stop="onChoosemachine(null)" :key="-1">请选择灭菌机</view>
						<view class="listItem samepadding border-bottom flexaround" v-for="(item, itemIndex) in machineList" @click.stop="onChoosemachine(item,itemIndex)" :key="itemIndex">
							<view>{{item.name}}</view>
							<img v-if="itemIndex==acresonindex" class="checkimg" src="../../static/img/i-Check.png" alt="">
						</view>
						
					</scroll-view>
					<view class="suresearch flexcenter" @click.stop="suresearch">确定</view>
				<!-- </view> -->
			
			</view>
			<view v-show="startgrounding">
				<startgroundingComponent @dogrounding="ondogrounding($event)" @closeCover="startgrounding=false"></startgroundingComponent>
			</view>



			<scroll-view scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}" @scrolltolower="scrolltoBottom">
				<view v-for="(item,index) in togroundingList" :key="index">
					<!-- <view v-for="(item,index) in togroundingList" v-show="visableIndex<=index&&index<=visableIndex+visablenum" :key="index" :class="{'scrollItem':index==0}"> -->
					<groundingListItemComponent @showdetail="showdetail" :choseall="choseall" @choseItem="onChoseItem" :item="item"></groundingListItemComponent>
				</view>
				<loadingMoreComponent v-if="togroundingList.length" :loadingType="loadingType"></loadingMoreComponent>
				
			</scroll-view>

			<view class="flexaround choseall" >
				<view class="flexaround" style="height:100%;" @click.stop="onChoseall">
					<view class="circal" :class="{'activecicle':activecicle}"></view>
					<text style="width:300upx;">全选({{togroundingList.length}})</text>
				</view>
				<img class="keyboard" @click.stop="onKeyboard" src="../../static/img/i-keyboad.png" alt="">
			</view>
			<view class="grounding-bottom flexaround">
				<view class="left-detail-none flexcenter">
					<img src="../../static/img/i-scanning1.png" alt="">
					<!-- <view>请扫描下收人信息</view> -->
					<selectComponent @click="showSelect('shelvesSelect')"  :listshow="shelvesSelect"  @chose="onChooseshelves" :placeholder="'请选择货架'" :dataList="shelvesList" :lable="'name'"></selectComponent>
					<!-- <input type="text" v-model="storageRack" confirm-type="search" @confirm="onstorageRackEnter()" placeholder="请扫描存储架信息"> -->
					<!-- 	 <input type="text" v-model="downPerson"  placeholder="请扫描下收人信息"> -->
				</view>
				<!-- <downpersonComponent v-if="sdownPersonComponent" @colseDownPerson="onColseDownPerson"></downpersonComponent> -->
				<view class="sure-grounding flexcenter" @click.stop="suregrounding">
					确认上架({{accontNum}})
				</view>

			</view>




			<view class="xydialig" v-if="showDialog" @click.stop="">
				<view class="xydialig-title">
					<text class="btm">包条码:</text>
					<text class="bid">{{bid}}</text>
				</view>
				<veiw class="tip">已上架,是否撤销!</veiw>
				<view class="xydialig-content" style="text-align: center;padding-top:50upx;">
					<button type="default" size="mini" @click="showDialog=false">否</button>
					<button type="primary" size="mini" @click="cancleGrounding">是</button>
				</view>
			</view>
		</view>

	</view>
	</view>
</template>
<script>

	import navbarComponent from "../../components/nav-bar/nav-bar-base.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";
	import groundingListItemComponent from "../../components/grounding/grounding-list-item.vue";
	import startgroundingComponent from "../../components/grounding/start-grounding.vue";
	import groundingDetailComponent from "../../components/reclaim/reclaim-detail.vue";
	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import cencusComponent from "../../components/grounding/cencus.vue";
	import changeshelvesComponent from "../../components/grounding/changeshelves.vue";
	import MxDatepicker from "../../components/uni-ui/mx-datepicker/mx-datepicker.vue";
	import {mapGetters} from "vuex";
	import selectComponent from "../../components/grounding/search-select.vue";
	import selfDialogComponent from "../../components/base/self-dialog.vue";
	import {
		getsterilizationList,getSystemTime,getTogrounding,getshelves,suregrounding,dogrounding,cancleGrounding

	} from "../../common/api.js";
	import {
		myMixin
	} from "../../common/mixins.js";
	import {
		formatDate
	} from "../../common/tool.js";
	
	let page=1;
	let pageSize=20;
	let devId='';
	let groundingList=[];
	let activeshelves;




	export default {
		mixins: [myMixin],
		components: {
			navbarComponent,
			loginInformationComponent,
			groundingListItemComponent,
			selectComponent,
			startgroundingComponent,
			groundingDetailComponent,
			loadingMoreComponent,
			selfDialogComponent,
			cencusComponent,
			MxDatepicker,
			changeshelvesComponent
			// mInput

		},
		data() {
			return {
				activeTabIndex: 0,
				machineList:[],
				selectTime:formatDate(new Date(), "yyyy-MM-dd"),
				numgc:'',
				startgrounding:false,
				homeHeight:'0',
				togroundingList:[],
				loadingType:2,
				accontNum:0,
				storageRack:'',
				showPicker:false,
				// sground:false,
				// groundDetail:{},
				togglegrounding:false,
				activecicle:false,
				toggleImport:true,
				choseall:false,
				acresonindex:-1,
				selectLoading: false,
				shelvesList:[],
				shelvesSelect:false,
				showDialog:false,
				bid:'',
				loadingmore:false,
				showimport:true
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
		onUnload() {
			this.$bus.off('onBarCode');
		},
		onBackPress() {
			if (this.$store.state.loading) {
				this.$store.commit("switch_loading", false);
			}
		},
		onLoad() {
			activeshelves='';
            this.getsterilizationList();
			this.getshelves();
			this.getsystime();
			this.$bus.on('onBarCode', (e) => {
				this.judgeScanType(e.data);
			});
		},
		updated() {
			if (this.selectLoading&&this.togroundingList.length>=40) {
				this.$loading(false);
				this.selectLoading = false;
			}
		},
		methods: {
			onChooseshelves(item){
				this.shelvesSelect=false;
				activeshelves=item;
			},
			getshelves(){
				const data={"Jzxx":{"is_inv":"1"},"PageReq":{},"LoginForm":this.loginForm};
				getshelves(data).then(res=>{
					if(res.status=="OK"){
						console.log(res,'货架');
						this.shelvesList=res.returnValue.rows;
					}
					if(res.status=="error"){
						this.toast(res.message);
					}
				})
			},
			suresearch(){
				this.toggleImport=false;
				if(!this.selectTime){
					this.toast('请选择时间');
					return;
				}
				if(!devId){
					this.toast('请选择灭菌机');
					return;
				}
				this.togroundingList=[];
				this.getTogrounding();
			},
			onChoosemachine(item,index) {
			  	if(this.acresonindex==index){
					this.acresonindex=-1;
					devId='';
					return;
			    }
			  this.acresonindex=index;
				devId = item ? item.id : '';
			},
			onShowDatePicker() { //显示
				this.showPicker = true;
			},
			onstorageRackEnter(){
				
			},
			onKeyboard() {
				this.startgrounding = true;
			},
			ondogrounding(e){//上架
			
				if(!activeshelves){
					this.toast('请选择货架');
					return;
				}
				let reg = new RegExp('^(TM|tm)');
				this.bid=e;
				if (reg.test(e)) { //包扫码
					this.bid = e.slice(2, e.length);
				}
				const data = {
					"CcLog":{"jz_name":activeshelves.name,"jz_id":activeshelves.id,tmid:this.bid},"LoginForm": this.loginForm
				}
				dogrounding(data).then(res => {
					console.log(res,'上架');
					this.errormessage = res.message;
					if (res.status == "OK") {
						this.toast('上架成功');
						this.bid = "";
						this.getTogrounding();
					}
					if (res.status == "error") { //报错提示
						this.toast(this.errormessage);
				
					}
// 					if (res.status == 'warn') {
// 						this.showsuregrounding = true;
// 					}
					if (res.status == "warn") {
						this.showDialog = true;
					}
				
				
				})
			},
			cancleGrounding(){
				const data={"CcLog":{"tmidlist":[],"tmid":this.bid},"LoginForm":this.loginForm};
				cancleGrounding(data).then(res=>{
					this.showDialog = false;
					if(res.status=="OK"){
						this.toast('撤销成功');
						this.getTogrounding();
					}
					if(res.status=="error"){
						this.toast(res.message);
					}
				})
			},

			onSelected(e) {
				let year = e.year;
				let month = Number(e.month) < 10 ? ("0" + e.month) : e.month;
				let date = Number(e.date) < 10 ? ("0" + e.date) : e.date;
				this.selectTime = year + "-" + month + "-" + date;
// 				this.washresultList=[];
// 				this.getsterilizationcensusList();
			},
			getsystime() {
				const data = {
					"LoginForm": this.loginForm
				};
				getSystemTime(data).then(res => {
					if (res.errorCode == "0") {
						this.selectTime = res.returnValue.ServerInfo.systemtime.substring(0, 11);
						// this.getTogrounding();
					}
			
				})
			},
			getsterilizationList: _.throttle(function() { //获取多个灭菌机
				this.$loading();
				const data = {
					"Sbxx": {
						"did": this.loginForm.deptId,
						"is_inv": "1",
						"sb_type": "3~4~5"
					},
					"LoginForm": this.loginForm
				};
			
				getsterilizationList(data).then(res => {
					console.log(res, '灭菌机列表');
					this.$loading(false);
					if (res.errorCode == "0") {
						this.machineList = res.returnValue.SbxxList;
						console.log(this.machineList, 'this.machineList');
					}
			
				})
			}, 500, {
				'trailing': false
			}),
		
			onStepClick(index) {
				if(index==this.activeTabIndex ){
					return;
				}
				this.showimport=index==0?true:false;

				this.activeTabIndex = index;
			},
			closeAllselect() {
				this.shelvesSelect = false;
			
			},
			showSelect(name) {
				if (name != "shelvesSelect") {
					this.shelvesSelect = false;
				}
			
				setTimeout(() => {
					this[name] = !this[name];
				}, 20)

			},
			/*回收enter事件功能区域*/
			judgeScanType(data) {
					let reg = new RegExp('^(BB|bb)');
				if (reg.test(data)) { //包扫码
					this.bid = data.slice(2, data.length);
					this.ondogrounding(this.bid);
				}
				let jzReg = new RegExp('^(JZ|jz)');
				if (jzReg.test(data)) { //人员扫码
					this.storageRack = data.slice(2, data.length);
					this.onstorageRackEnter();
				}
			},
	
			
		
		    getchoosepack(){
				let choosepack=this.togroundingList.filter((item)=>{
					return item.checked;
				})
				choosepack=choosepack.map(element=>{return {tmid:element.tmid}});
				return choosepack;
			},
			suregrounding() {	
				if(!activeshelves){
					this.toast('请选择货架');
					return;
				}
				let chosenpack=this.getchoosepack();
				if(!chosenpack.length){
					this.toast('请选择包');
					return;
				}
				console.log(JSON.stringify(chosenpack));
				const data = {
					"CcLog":{"jz_name":activeshelves.name,"jz_id":activeshelves.id},"CcLogList":chosenpack,"LoginForm": this.loginForm
				}
				suregrounding(data).then(res => {
					console.log(res, 'suregrounding');
					if (res.status == "OK") {
						this.toast('上架成功');
						this.togroundingList=[];
						this.getTogrounding();
					}
					if(res.status == "error"){
						this.toast(res.message);
					}
				})
			},
		
			/*回收enter事件功能区域*/

		

			
		
	
			scrolltoBottom() {
				page++;
				this.loadingType = 1;
				this.getTogrounding();
				console.log("loading more");
			},

			onChoseItem(item) { //单个包被选中
				item.checked ? this.accontNum++ : this.accontNum--;
			},

	

			onChoseall() { //全部选中
				if (!groundingList.length) {
					return;
				}
				this.selectLoading = true;
				if(this.togroundingList.length>=40){
					this.$loading();
				}
				
				this.activecicle = !this.activecicle;
				this.$nextTick(() => {
					groundingList.forEach(item => {
						item.checked = this.activecicle ? true : false;
					})
					this.togroundingList = groundingList;
					this.accontNum = this.activecicle ? groundingList.length : 0;
				})


			},
	
			getTogrounding: _.throttle(function(state) { //获取待上架包列表
				const data = {
					"Tmxx": {
						"bnrList": [],
						"isChecked": false,
						"jsList": [],
						"zjFfList": [],
						"mj_d_gc":this.numgc,
						"mj_dev_id":devId,
						"mj_start_dt":this.selectTime+" 00:00:00"
					}, //第一次登录不传 
					"PageReq": {
						"page": page,
						"rows": pageSize
					},
					"LoginForm": this.loginForm
				};
				getTogrounding(data).then(res => {
					console.log(res, '待上架列表');
					if (res.errorCode == "0") {
						this.accontNum=0;
						console.log(JSON.stringify(res.returnValue.rows));
						this.loadingType = res.returnValue.rows < pageSize ? 2 : 0;
						let resgroundingList = res.returnValue.rows.map(item => {
							return {
								bmc: item.bmc,
								tmid: item.tmid,
								checked: false,
								xq_desp: item.xq_desp,
								mj_start_dt: item.mj_start_dt
							}
						})
						
						this.togroundingList = this.togroundingList.concat(resgroundingList);
						groundingList = JSON.parse(JSON.stringify(this.togroundingList));
					}
				})
			}, 500, {
				'trailing': false
			}),

			
		
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

			}


		},

		onReady() {
			setTimeout(() => {
				this.setDomHeight();
			}, 500)

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

	.grounding-header {
		position: fixed;
		width: 100%;
		z-index: 1000;
		top: var(--status-bar-height);
		left: 0;
	    .import-text{
			color:white;
			font-size:35upx;
		}

	}
	.import{
		position:absolute;
		top:0;
		left:0;
		height:0;
		width:100%;
		z-index:10;
		transition: all 0.5s linear;
		background-color: white;
		overflow-y: hidden;
		.checkimg{
			
				width:50upx;
				height:33upx;
			
		}
	}
	.import-input{
		height:90upx;
		box-sizing: border-box;
	}
	.toggleImport{
		height:calc(100vh - (154upx + var(--status-bar-height)));
	}
	.machine-list{
		height:calc(100vh - (334upx + var(--status-bar-height)));
	}
	.suresearch{
		position:absolute;
		bottom:0;
		left:0;
		box-sizing: border-box;
		height:90upx;
		font-size:45upx;
		color:white;
		background-color: #0080FF;
	    z-index:10;
		padding:40upx;
		width:100%;
	}

	/* #ifdef APP-PLUS */
	.grounding-content {
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
	.grounding-content {
		width: 100%;
		position: absolute;
		top: 154upx;
		left: 0;
		display: flex;
		height: 100vh;
		flex-direction: column;
	}
	
	/*  #endif  */
	.grounding-content {
		.xydialig {
			position: absolute;
			width: 80%;
			height: 320upx;
			top: 50%;
			left: 50%;
			padding: 20upx;
			transform: translate(-50%, -50%);
			background: #FFFFFF;
			box-shadow: 0 8upx 24upx 0 rgba(0, 0, 0, 0.10);
			border-radius: 4upx;
			z-index: 10000;

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

		.kslist {
			display: flex;
			align-items: center;

			// border-bottom: 1upx solid $bordercolor;
			.test {
				width: 300upx;
			}
		}

		.floor {

			border-bottom: 1upx solid $bordercolor;
		}

		.same {
			padding: 20upx 30upx;
			font-size: 35upx;
			flex: none;
		}

		.nowstate {
			padding: 20upx;
			border-bottom: 1upx solid $bordercolor;
			border-top: 1upx solid $bordercolor;

			.nowstate-select {
				// 				position:absolute;
				// 				top:50%;
				// 				left:0;
				// 				transform: translate(-50%,0);
			}

			.nowstate-right {
				flex: 1;
				text-align: right;
				font-size: 29upx;
				color: #0080FF;
			}
		}

		// 		.stateSelect{
		// 			border:1upx solid $bordercolor;
		// 			
		// 		}

		display: flex;
		flex-direction: column;

		.home-content {
			flex: 1;
		}



		.circal {
			width: 50upx;
			height: 50upx;
			border: 1upx solid #C7C7CC;
			border-radius: 50%;
			margin-right: 2%;
		}

		.circal.activecicle {
			border: 1upx solid transparent;
			background: url('../../static/img/i-ok.png') no-repeat;
			background-size: 100% 100%;
		}

		.choseall {
			padding: 20upx 30upx;
			background: #FFFFFF;
			border: 1upx solid #E5E5E5;
			margin-bottom: 110upx;

			.keyboard {
				height: 37upx;
				width: 50upx;
			}
		}

		.uni-scroll-view {
			height: 100%;
		}

		.grounding-bottom {
			width: 100%;
			height: 110upx;
			position: absolute;
			bottom: 0;
			left: 0;
			background-color: #FFFFFF;

			.left-detail-none {
				width: 60%;
				flex: none;
				padding-left: 40upx;

				&>img {
					width: 40upx;
					height: 33upx;
					padding-right: 10upx;
				}

				&>view {
					font-size: 29px;
					color: #A5A5A5;
				}
			}

			.left-detail {
				width: 50%;
				padding-left: 50upx;
				// 				display:flex;
				// 				flex-direction: column;
				// 				align-items: center;
				// 				justify-content: center;


				&>view:first-child {
					font-size: 33upx;
					color: #333333;
				}

				&>view:last-child {
					font-size: 25upx;
					color: #A5A5A5;

					text:first-child {
						padding-right: 10upx;
						border-right: 1upx solid #A5A5A5;
					}

					text:last-child {
						padding-left: 10upx;
					}
				}
			}

			.sure-grounding {
				border: 1upx solid transparent;
				width: 50%;
				height: 100%;
				background-color: #0080FF;
				font-size: 37upx;
				color: #FFFFFF;
			}
		}

		.chose-state {
			padding: 30upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: white;
			border-bottom: 0.5px solid #E5E5E5;

			.todayrecycle {
				font-size: 29upx;
				color: #0080FF;
			}

			.chose-state-all {
				font-size: 29upx;
				color: #666666;
				margin-right: 10upx;
			}
		}
	}
</style>
