<template>
	<view class="maincontent">
		<view class="status_bar"></view>
		<myloading></myloading>
		<reclaimDetailComponent v-if="togglereclaim" @closeDetail="togglereclaim=false" :tmid="chosePack.choseTmid" :bmc="chosePack.bmc"></reclaimDetailComponent>

		<view class="reclaim-header">
			<navbarComponent @stepClick="onStepClick" :buttonList="['回收','统计']"></navbarComponent>
			<loginInformationComponent></loginInformationComponent>
		</view>
  
			<cencusComponent  v-if="activeTabIndex==1"></cencusComponent>
	
		
		<view class="reclaim-content" @click="closeAllselect" v-show="activeTabIndex==0">
			<view v-show="startReclaim">
				<startReclaimComponent @doreclaim="ondoreclaim($event)" @closeCover="startReclaim=false"></startReclaimComponent>
			</view>
			<view class="home-top">
				<view class="flexaround same floor">
					<view class="flexcenter">
						<text style="flex:none;">大楼:</text>
						<selectComponent @click="showSelect('buildSelect')" :listshow="buildSelect" @chose="onChoosebuild" :dataList="builds"
						 :lable="'dlname'" class="nowstate-select"></selectComponent>
					</view>
					<view class="flexcenter">
						<text style="flex:none;">大楼楼层:</text>
						<selectComponent @click="showSelect('floorSelect')" @chose="onChoosefloor" :listshow="floorSelect" :clearValue="clearfloor"
						 :dataList="floors" :lable="'lcname'" class="nowstate-select"></selectComponent>
					</view>
				
				</view>
				<view class="kslist same">
					<text style="flex:none;">科室:</text>
					<selectComponent @click="showSelect('deptSelect')" :listshow="deptSelect" @chose="onChoosedept" @input="searchList"
					 :clearValue="cleardept" :dataList="kslist" :search="true" :lable="'de_deptname'" class="nowstate-select"></selectComponent>
					<!-- 	<input style="padding-right:10upx;color: #666666;"  v-model="selectValue" placeholder="test"/> -->
					<button style="flex:none;" type="default" size="mini" @click.stop="showRemark=true">备注</button>
				</view>
				<view class="nowstate flexaround same">
					<selectComponent :placeholder="'全部'" :notshowpleaseSelect="true" @click="showSelect('stateSelect')" :listshow="stateSelect"
					 @chose="onChooseState" :dataList="stateList" :lable="'hstype_name'" class="nowstate-select"></selectComponent>
					<text style="flex:none;" class="nowstate-right" @click="navigateTodayReclaim">今日回收({{todayReclaimNum}})</text>
				</view>
			</view>

		



		   <!-- <scroll-view scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}" @scrolltolower="scrolltoBottom"> -->
		   <view class="home-content">
			   	<view v-for="(item,index) in toReclaimList" :key="index" class="list-item-content">
			   
			   		   <view class="circal" @click.stop="onChoseItem(item)" :class="{'active':item.checked}"></view>
			   		   <img src="../../static/img/timg.jpg" style="width:110upx;height:110upx;padding:15upx;" alt="">
			   		   <view class="list-center" @click.stop="showdetail(item)">
			   			   <view class="list-center-top">
			   				   <text>{{item.bmc}}</text>
			   				   <view class="item-state overdue" v-if="item.hstype_name=='已过期'" style="margin:0 20upx;">已过期</view> 
			   				    <view class="item-state used" v-if="item.hstype_name=='已使用'" style="margin:0 20upx;">已使用</view>
			   					<view class="item-state unqualified" v-if="item.hstype_name=='不合格'" style="margin:0 20upx;">不合格</view>
			   				</view>
			   			   <view class="list-center-bottom" >
			   				   <text>{{item.tmid}}</text> 
			   				   <text style="padding-left:40upx;">器械数量: <text style="color:#0080FF;font-size:29upx;">{{item.qx_num}}</text> </text>
			   			   </view>
			   		   </view>
			   		   <img src="../../static/img/i-right.png" style="width:10upx;height:20upx;margin:0 20upx;" alt="">
			  
			   </view>
			   <loadingMoreComponent v-if="toReclaimList.length" :loadingType="loadingType"></loadingMoreComponent>
		   </view>
		   
		    	<!-- <reclaimListItemComponent @showdetail="showdetail" :choseall="choseall" @choseItem="onChoseItem" :item="item"></reclaimListItemComponent> -->
			
		   <!-- </scroll-view> -->
		   <view class="home-bottom">
			   			<view class="flexaround choseall">
			   	<view class="flexaround" style="height:100%;" @click.stop="onChoseall">
			   		<view class="circal" :class="{'activecicle':activecicle}"></view>
			   		<text style="width:300upx;">全选({{toReclaimList.length}})</text>
			   	</view>
			   	<img class="keyboard" @click.stop="onKeyboard" src="../../static/img/i-keyboad.png" alt="">
			   </view>
			   <view class="reclaim-bottom flexaround">
			   	<view class="left-detail" v-if="sdownPerson">
			   		<view>{{downPersonDetail.us_username}}</view>
			   		<view>
			   			<text>{{downPersonDetail.us_deptid}}</text>
			   			<text>{{downPersonDetail.us_deptname}}</text>
			   		</view>
			   	</view>
			   	<view class="left-detail-none flexcenter" v-if="!sdownPerson">
			   		<img src="../../static/img/i-scanning1.png">
			   		<!-- <view>请扫描下收人信息</view> -->
			   		<input class="uni-input" type="text" v-model="downPerson" confirm-type="确定" @confirm="onpersonEnter()" placeholder="请扫描下收人信息" />
			   		<!-- 	<input type="text" v-model="downPerson" confirm-type="确定" @confirm="onpersonEnter()" placeholder="请扫描下收人信息"> -->
			   		<!-- 	 <input type="text" v-model="downPerson"  placeholder="请扫描下收人信息"> -->
			   	</view>
			   	<!-- <downpersonComponent v-if="sdownPersonComponent" @colseDownPerson="onColseDownPerson"></downpersonComponent> -->
			   	<view class="sure-reclaim flexcenter" @click.stop="sureReclaimbylist">
			   		确认回收({{accontNum}})
			   	</view>
			   
			   </view>
		   </view>






			<view class="xydialig" v-if="showDialog" @click.stop="">
				<view class="xydialig-title">
					<text class="btm">包条码:</text>
					<text class="bid">{{bid}}</text>
				</view>
				<veiw class="tip">已回收,是否撤销!</veiw>
				<view class="xydialig-content" style="text-align: center;padding-top:50upx;">
					<button type="default" size="mini" @click="showDialog=false">否</button>
					<button type="primary" size="mini" @click="cancleRecliam">是</button>
				</view>
			</view>
			<view class="xydialig" v-if="showsurereclaim" @click.stop="">
				<view class="xydialig-title">
					<text class="btm">包条码:</text>
					<text class="bid">{{bid}}</text>
				</view>
				<veiw class="tip">{{errormessage}}</veiw>
				<view class="xydialig-content" style="text-align: center;padding-top:50upx;">
					<button type="default" size="mini" @click="showsurereclaim=false">否</button>
					<button type="primary" size="mini" @click="surereclaim">是</button>
				</view>
			</view>
			<!-- <selectComponent @closeCover="showselect=false" v-if="showselect" :dataList="dataList"></selectComponent> -->
			<selfDialogComponent v-if="showRemark">
				<template slot="content">
					<input class="uni-input" type="text" v-model="remark" placeholder="备注" style="border:1upx solid #E5E5E5" />
					<!-- <input type="text" v-model="remark" placeholder="备注" style="border:1upx solid #A5A5A5"> -->
				</template>
				<template slot="footer">
					<button type="default" size="mini" style="font-size:22upx;" @click.stop="showRemark=false;remark='';">取消</button>
					<view style="display:inline-block;width:20upx;"></view>
					<button type="primary" size="mini" style="font-size:22upx;" @click.stop="showRemark=false">确认</button>
				</template>

			</selfDialogComponent>
		</view>

	</view>
	</view>
</template>
<script>
	let deptlist;
	let scrollHeight;
	let reclaimList = [];
	let page = 1;
	let pageSize = 10;
	let reclaimType = 'normal';
	let dept = ''; //科室id
	let build = '';
	let floor = '';
	let timer;
	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar-base.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";
	import reclaimListItemComponent from "../../components/reclaim/reclaim-list-item.vue";
	import startReclaimComponent from "../../components/reclaim/start-reclaim.vue";
	import reclaimDetailComponent from "../../components/reclaim/reclaim-detail.vue";
	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import cencusComponent from "../../components/reclaim/cencus.vue";


	// import mInput from "../../components/uni-ui/m-input/m-input.vue";


	import {
		mapGetters,
		mapMutations
	} from "vuex";
	import selectComponent from "../../components/base/search-select.vue";
	import selfDialogComponent from "../../components/base/self-dialog.vue";
	import {
		getbuilds,
		getfloors,
		getdeptbyfloor,
		getToreclaim,
		getTodayReclaimNum,
		reclaimByList,
		getdownPerson,
		doreclaim,
		cancleRecliam,
		doreclaimSpecial

	} from "../../common/api.js";
	import {
		myMixin
	} from "../../common/mixins.js";

	let stateMethod = "getTmxxListForHs";


	export default {
		mixins: [myMixin],
		components: {
			maincomponent,
			navbarComponent,
			loginInformationComponent,
			reclaimListItemComponent,
			selectComponent,
			startReclaimComponent,
			reclaimDetailComponent,
			loadingMoreComponent,
			selfDialogComponent,
			cencusComponent
			// mInput

		},
		data() {
			return {
				activeTabIndex: 0,
				floorSelect: false,
				deptSelect: false,
				buildSelect: false,
				stateSelect: false,
				bid: '',
				showDialog: false,
				errorDialog: false,
				errormessage: '',
				showsurereclaim: '',
				downPerson: '',
				showRemark: false,
				todayReclaimNum: 0,
				remark: '',
				chosePack: {
					bmc: '',
					choseTmid: ''
				},
				stateList: [{
					hstype_name: '全部',
					stateMethod: 'getTmxxListForHs'
				}, {
					hstype_name: '已使用',
					stateMethod: 'getTmxxListForSyHs'
				}, {
					hstype_name: '已过期',
					stateMethod: 'getTmxxListForGqHs'
				}, {
					hstype_name: '不合格',
					stateMethod: 'getTmxxListForBhgHs'
				}],
				downPersonDetail: null,
				sdownPerson: false,
				loadingType: 0,
				togglereclaim: false,
				startReclaim: false,
				choseall: false,
				clearfloor: false,
				cleardept: false,
				builds: [],
				floors: [],
				homeHeight: 0,
				accontNum: 0,
				toReclaimList: [],
				activecicle: false,
				kslist: [],
				selectLoading: false,
				initgetlist:false
			}
		},
		computed: {
			...mapGetters(["loginForm"])
		},
		onUnload() {
			this.$bus.off('onBarCode');
		},
		onBackPress() {
			if (this.$store.state.loading) {
				this.$store.commit("switch_loading", false);
			}
		},
		onReachBottom() {
			if(this.activeTabIndex==0){
				this.scrolltoBottom();
			}
		},
		onLoad() {
			this.getbuilds();
			this.getToreclaim(); //获取默认待回收列表
			this.$bus.on('onBarCode', (e) => {
				this.judgeScanType(e.data);
			});
		},
		updated() {
			setTimeout(()=>{
				if (this.selectLoading && this.toReclaimList.length >= 20) {
					this.$loading(false);
					this.selectLoading = false;
				}
			},1)
		
		},
		methods: {
			initreclaimlist(){
				page=1;
				this.getToreclaim();
			},
			onStepClick(index) {
				if(index==this.activeTabIndex){
					return;
				}
				if(index==0){
					this.initreclaimlist();
				}else{
					this.toReclaimList=[];
					this.initgetlist=!this.initgetlist;
				}
				setTimeout(()=>{this.activeTabIndex = index;},200)
				
				console.log(this.activeTabIndex);
			},
			closeAllselect() {
				this.floorSelect = false;
				this.deptSelect = false;
				this.buildSelect = false;
				this.stateSelect = false;
			},
			showSelect(name) {
				if (name != "floorSelect") {
					this.floorSelect = false;
				}
				if (name != "deptSelect") {
					this.deptSelect = false;
				}
				if (name != "buildSelect") {
					this.buildSelect = false;
				}
				if (name != "stateSelect") {
					this.stateSelect = false;
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
					this.onEnter();
				}
				let personReg = new RegExp('^(ZG|zg)');
				if (personReg.test(data)) { //人员扫码
					this.downPerson = data.slice(2, data.length);
					this.onpersonEnter();
				}
			},
			ondoreclaim(e) {
				this.bid = e;
				this.onEnter();
			},
			cancleRecliam() {
				const data = {
					"HsLog": {
						"tmid": this.bid
					},
					"LoginForm": this.loginForm
				};
				cancleRecliam(data).then(res => {
					if (res.errorCode == "0") {
						this.toast('撤销回收成功');
						this.bid = "";
						this.showDialog = false;
						this.getToreclaim();
					}
				})
			},
			onEnter() {
				if (reclaimType == "normal") {
					this.doreclaim();
				} else {
					this.doreclaimSpecial();
				}

			},
			doreclaimSpecial() {
				const data = {
					"HsLog": {
						"tmid": this.bid,
						"ksid": dept,
						"remark": this.remark
					},
					"LoginForm": this.loginForm
				}
				doreclaimSpecial(data).then(res => {
					console.log('特殊包回收');
					console.log(res);
					if (res.errorCode == "0") {
						this.toast('回收成功');
						this.bid = "";
						this.getToreclaim();
					}
					if (res.status == "error") { //报错提示
						this.errorDialog = true;

					}
					if (res.status == 'warnadd') {
						this.showsurereclaim = true;
					}
					if (res.status == "warnrev") {
						this.showDialog = true;
					}

				})
			},

			surereclaim() {
				const data = {
					"HsLog": {
						"tmid": this.bid,
						"is_confirm": '1'
					},
					"LoginForm": this.loginForm
				}
				doreclaim(data).then(res => {
					console.log(res, 'surereclaim');
					if (res.errorCode == "0") {
						this.toast('回收成功');
						this.bid = "";
						this.showsurereclaim = false;
						this.getToreclaim();
					}
				})
			},
			doreclaim() {
				const data = {
					"HsLog": {
						"tmid": this.bid
					},
					"LoginForm": this.loginForm
				}
				doreclaim(data).then(res => {
					console.log('包回收');
					console.log(JSON.stringify(res));
					this.errormessage = res.message;
					if (res.errorCode == "0") {
						this.toast('回收成功');
						this.bid = "";
						this.getToreclaim();
					}
					if (res.status == "error") { //报错提示
						this.toast(this.errormessage);

					}
					if (res.status == 'warnadd') {
						this.showsurereclaim = true;
					}
					if (res.status == "warnrev") {
						this.showDialog = true;
					}


				})
			},
			/*回收enter事件功能区域*/

			onpersonEnter() {
				if (!this.downPerson) {
					this.toast("请输入下收人编号");
					return;
				}
				this.getdownPerson();
			},
			getdownPerson() {
				const data = {
					"Userinfo": {
						"us_userid": this.downPerson
					},
					"LoginForm": this.loginForm
				}
				getdownPerson(data).then(res => {
					if (res.errorCode == "0") {
						this.onColseDownPerson(res.returnValue.Userinfo)
						// this.$emit('colseDownPerson',res.returnValue.Userinfo);
					}
					if (res.status == "error") {
						this.toast(res.message);
					}
					console.log(res, '下手人');
				})
			},
			navigateTodayReclaim() {
				uni.navigateTo({
					url: '/pages/todayreclaim/todayreclaim?id=1&name=uniapp'
				});
			},
			onChooseState(item) {
				this.stateSelect = false;
				if (stateMethod == item.stateMethod) {
					return;
				}
				stateMethod = item.stateMethod;
				this.toReclaimList = [];
				this.getToreclaim();
			},
			onColseDownPerson(res) {

				if (res) {
					this.sdownPerson = true;
					this.downPersonDetail = res;
				}
			},
			scrolltoBottom() {
				page++;
				this.loadingType = 1;
				this.getToreclaim();
				console.log("loading more");
			},
			onKeyboard() {
				if (reclaimType != "normal" && !dept) {
					this.toast('请选择科室');
					return;
				}
				this.startReclaim = true;
			},
			reclaimByList() { //批量回收
				let HsLogList = this.toReclaimList.filter(item => {
					return item.checked;
				});
				HsLogList = _.map(HsLogList, (item) => {
					return {
						'tmid': item.tmid
					};
				})
				const data = {
					"HsLog": {},
					"HsLogList": HsLogList,
					"LoginForm": this.loginForm
				}
				reclaimByList(data).then(res => {
					console.log(res);
					if (res.errorCode == "0") {
						this.toast('回收成功');
						this.accontNum == 0;
						this.toReclaimList = [];
						this.getToreclaim();
					}

				}).catch((error)=>{console.log('catched:', error);})
			},

			sureReclaimbylist() {
				if (this.accontNum == 0) {
					this.toast('请选择包');
					return;
				}
				this.reclaimByList();

			},
			onChoseItem(item) { //单个包被选中
			   item.checked=!item.checked;
				item.checked ? this.accontNum++ : this.accontNum--;
			},

			showdetail(item) { //查看包信息
				this.togglereclaim = true;
				this.chosePack.choseTmid = item.tmid;
				this.chosePack.bmc = item.bmc;
				console.log(item);
			},

			onChoseall() { //全部选中
				if (!reclaimList.length) {
					return;
				}
				this.selectLoading = true;
				if (this.toReclaimList.length >= 20) {
					this.$loading();
				}

				this.activecicle = !this.activecicle;
				this.$nextTick(() => {
					reclaimList.forEach(item => {
						item.checked = this.activecicle ? true : false;
					})
					this.toReclaimList = reclaimList;
					this.accontNum = this.activecicle ? reclaimList.length : 0;
				})


			},
			onChoosedept(item) {
				this.deptSelect = false;
				if (item != null && dept == item.de_deptid) {
					return;
				}
				this.toReclaimList = [];
				dept = item ? item.de_deptid : '';
				this.getToreclaim();
			},
			getToreclaim(){
				clearInterval(timer);
				timer=setTimeout(()=>{
				  this.gettoreclaimtimeout();
				},500)
			},
			
	

			gettoreclaimtimeout(){ //获取待回收列表
				const data = {
					method: stateMethod,
					"Tmxx": {
						"bnrList": [],
						"isChecked": false,
						"jsList": [],
						"zjFfList": [],
						"ff_did": dept
					}, //第一次登录不传 
					"PageReq": {
						"page": page,
						"rows": pageSize
					},
					"LoginForm": this.loginForm
				};
				this.$loading();
				getToreclaim(data).then(res => {
					this.$loading(false);
					console.log(JSON.stringify(res), '回收列表');
					if (res.errorCode == "0") {
						this.loadingType = res.returnValue.rows < pageSize ? 2 : 0;
						this.todayReclaimNum = res.returnValue.zsl;
						uni.setStorageSync('todayReclaimNum', this.todayReclaimNum);
						let resReclaimList = res.returnValue.rows.map(item => {
							return {
								bmc: item.bmc,
								tmid: item.tmid,
								checked: item.checked,
								hstype_name: item.hstype_name,
								qx_num: item.qx_num
							}
						})
						reclaimList = this.toReclaimList.concat(resReclaimList);
						this.toReclaimList = this.toReclaimList.concat(resReclaimList);
						
					}
				})
			},

			onChoosebuild(item) {
				console.log(item, 'build');
				this.buildSelect = false;
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
				} else {
					deptlist = uni.getStorageSync('deptlist'); //设置默认科室列表为登录页科室列表
					this.kslist = this.searchDepts('', deptlist);
				}


			},
			onChoosefloor(item) {
				this.floorSelect = false;
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
				console.log(data, 'getdeptbyfloor');
				getdeptbyfloor(data).then(res => {
					console.log(JSON.stringify(res));
					deptlist = res.returnValue.ksxxList.map(item => {
						return {
							de_deptname: item.deptname,
							de_deptid: item.deptid,
							alph: item.alph
						};
					});
					this.searchList(''); //默认取前15个
				})
			},
			searchList(e) {
				this.deptSelect=true;
				this.searchDeptsthrottle(e, deptlist).then(res => {
					console.log(res, '科室列表');
					this.kslist = res;
				});
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
					if(res.status=="OK"&&res.returnValue){
							this.builds = res.returnValue.dlxxList.map(item => {
							return {
								dlname: item.dlname,
								dlbh: item.dlbh
							};
						});
					}else{
						this.toast('楼层获取失败');
					}
				
					console.log(res, 'builds');
				})
			},

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
// 			setTimeout(() => {
// 				this.setDomHeight();
// 			}, 500)

			deptlist = uni.getStorageSync('deptlist'); //设置默认科室列表为登录页科室列表
			this.kslist = this.searchDepts('', deptlist);

		}
	}
</script>

<style lang="scss">
	@import "../../common/global.scss";
	.home-top{
		position:fixed;
		width:100%;
		left:0;
		background-color:white;
		z-index:1000;
		top:calc(154upx + var(--status-bar-height));
	}
	.home-content{
		position:absolute;
		left:0;
		width:100%;
		top:270upx;
		margin-bottom:200upx;
	}
	.home-bottom{
		position:fixed;
		height:200upx;
		width:100%;
		left:0;
		bottom:0;
		background-color:white;
		z-index:1000;
		
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

	.reclaim-header {
		position: fixed;
		width: 100%;
		z-index: 1000;
		top: var(--status-bar-height);
		left: 0;

	}
	 .list-item-content{
			 display:flex;
			 padding:20upx 4.2%;
			 align-items: center;
			 border-bottom:1upx solid #E5E5E5;
			 background-color:white;
			 .circal{
				 width:50upx;
				 height:50upx;
				 border:1upx solid  #C7C7CC;
				 border-radius: 50%;
				 margin-right:2%;
			 }
			 .circal.active{
				   border:1upx solid  transparent;
				  background: url('../../static/img/i-ok.png') no-repeat;
				  background-size:100% 100%;
			 }
			 .item-state{
					font-size: 30upx;
					height:34upx;
					line-height:34upx;
				    flex:none;
					border-radius: 100px;
					padding:10upx 20upx;
			 }
			 .overdue{
				 color: #E48E39;
				 background:rgba(245,166,35,0.2);
			 } 
			 .used{
				 color:#A5A5A5;
				 background:rgba(165,165,165,0.2);
				
			 } 
			 .unqualified{
				 background:rgba(255,120,139,0.2);
				 color: #F4333C;
			 }
			 .list-center{
				 flex:1;
				 padding-left:20upx;
				 .list-center-bottom{
					font-size:32upx;
					color:#A5A5A5;
					margin-top:10upx;
				 }
				 .list-center-top{
					font-size:38upx;
					color:#333333;
					display:flex;
					justify-content: space-between;
				 } 
			 }
	}

	/* #ifdef APP-PLUS */
	.reclaim-content {
		width: 100%;
		position: absolute;
		top: calc(154upx + var(--status-bar-height));
		left: 0;
		display: flex;
// 		height: calc(100vh - (154upx + var(--status-bar-height)));
// 		flex-direction: column;
// 		overflow-y: hidden;
	}

	/*  #endif  */
	.reclaim-content {
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
			height:90upx;
			box-sizing: border-box;
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
			height:90upx;
			box-sizing: border-box;
			padding: 20upx 30upx;
			background: #FFFFFF;
			border: 1upx solid #E5E5E5;

			.keyboard {
				height: 37upx;
				width: 50upx;
			}
		}

		.uni-scroll-view {
			height: 100%;
		}

		.reclaim-bottom {
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

			.sure-reclaim {
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
