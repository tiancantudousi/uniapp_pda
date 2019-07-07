<template>
	<maincomponent style="background-color:#FFFFFF">
		<view slot="content">
			<view class="wash-check-content">
				<view class="wash-check-header">
					<navbarComponent :buttonList="[activeMachine.dev_name]">
					</navbarComponent>
					<loginInformationComponent></loginInformationComponent>
				</view>
				<view class="program-detail same">
					<view class="program-detail-time">{{start}}</view>
					<view class="program-text">{{activeMachine.proc_name}}</view> 
					<view class="program-text">{{activeMachine.plan_time}}分</view>
				</view>

				<view class="split"></view>
				<view class="same border-bottom">
						<packNumComponent :packNum="packNum" :materialNum="materialNum"></packNumComponent>  
				</view>
			
				<view class="wash-check-main">
					<scroll-view scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}" @scrolltolower="scrolltoBottom">
						<view v-for="(item,index) in detailList" :key="index" >
							<scrollListItem :item="item"></scrollListItem>
						</view>
						<loadingMoreComponent :loadingType="loadingType"></loadingMoreComponent>
					</scroll-view>
				
				</view>
	            <view class="start-wash flexaround">
						<view @click.stop="onUnquality">不合格</view>
						<view @click.stop="onquality">合格</view>
				</view>
			
				<unqualityReson v-if="showunqualityReson" :refreshpage="refreshpage" :machines="machines" :unqualityResons="unqualityResons" @closeUnqualityReson="onCloseUnqualityReson"></unqualityReson>
				<selfDialogComponent v-if="showDialog">
					<view slot="content">

					</view>
					<view slot="footer">
						<button type="default" size="mini" @click.stop="showDialog=false;remark='';">取消</button>
						<view style="display:inline-block;width:20upx;"></view>
						<button type="primary" size="mini" @click.stop="showDialog=false">确认</button>
					</view>

				</selfDialogComponent>
			</view>

		</view>
	</maincomponent>
</template>
<script>
	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";

	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import scrollListItem from "../../components/wash/scroll-item.vue";
	import MxDatepicker from "../../components/uni-ui/mx-datepicker/mx-datepicker.vue";
	import selectComponent from "../../components/base/search-select.vue";
	import checkstatecontentComponent from "../../components/wash/check-state-content.vue";
	import packNumComponent from "../../components/wash/pack-number.vue";
	import unqualityReson from "../../components/qualitycheck/unquality-reson.vue";



	import {
		mapGetters,
		mapMutations
	} from "vuex";
	import {
		publicSelect,getMachines,unquality
	} from "../../common/api.js";

	import selfDialogComponent from "../../components/base/self-dialog.vue";

	import {
		myMixin
	} from "../../common/mixins.js";
	import {
		formatDate
	} from "../../common/tool.js";



	export default {
		mixins: [myMixin],
		components: {
			maincomponent,
			navbarComponent,
			loginInformationComponent,
			loadingMoreComponent,
			selfDialogComponent,
			scrollListItem,
			MxDatepicker,
			selectComponent,
			checkstatecontentComponent,
			packNumComponent,
			unqualityReson

		},
		data() {
			return {
				showunqualityReson:false,
				packNum: 0,
				materialNum: 0,
				selectTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
				qualityList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
				loadingType: 2,
				page: 1,
				pageSize: 20,
				showDialog: false,
				stateList: [{
					hstype_name: '123'
				}],
				homeHeight: '100',
				start:'',
				unqualityResons:[],
				machines:[],
				jumpPage:''
			}
		},
		computed: {
			...mapGetters(["loginForm","detailList","activeMachine"])
		},
		created(){
			this.start=this.activeMachine.start_dt.substring(11,this.activeMachine.start_dt.length);
			this.countNum();
			this.getMachines();
		},
		onLoad(option){
			this.jumpPage=option.id;
			this.refreshpage.bind(this);
		},
		methods: {
		    refreshpage(){
				console.log(this.jumpPage,'this.jumpPage');
				if(this.jumpPage=="washresult"){
					 this.$bus.emit('refreshwashresult');
				}else{
					  this.$bus.emit('refreshItem',this.activeMachine);
				}
				  uni.navigateBack({
						delta: 1
					}); 
			},
			onquality(){
				const data={"Qx":{
					"did":this.loginForm.deptId,
					"jgms":0,
					"result":"1",
					"sb_type":this.activeMachine.sb_type,
					"state":this.activeMachine.state,
					"state_name":this.activeMachine.state_name,
					
					"d_gc":this.activeMachine.d_gc,
					"dev_id":this.activeMachine.dev_id,
					"dev_name":this.activeMachine.dev_name,
					
					"end_dt":this.activeMachine.end_dt,
					"id":this.activeMachine.id,
					"plan_time":this.activeMachine.plan_time,
				  "cre_uid":this.loginForm.userId,
				"cre_uname":this.loginForm.userName,
					"start_dt":this.activeMachine.start_dt,
					"t_gc":this.activeMachine.t_gc
				   },"LoginForm":this.loginForm};
				   unquality(data).then(res=>{
					   console.log(res,"清洗合格检定");
					     if (res.errorCode == "0") {
						   this.toast("检定成功");
						   this.refreshpage();
						
					   }
				   })
			},
			getMachines(){
				const data={"Sbxx":{"did":this.loginForm.deptId,"is_inv":"1","sb_type":"1~2~9"},"LoginForm":this.loginForm};
				getMachines(data).then(res=>{
					console.log(res,"清洗机");
					if (res.errorCode == "0") {
						this.machines=res.returnValue.SbxxList.filter(item=>{
							return item.id!=this.activeMachine.dev_id;
						});
					}
					
				})
			},
			onCloseUnqualityReson(e){
				this.showunqualityReson=false;
			},
			countNum(){
				this.detailList.forEach(item=>{
					this.packNum+=item.b_num;
					this.materialNum+=(item.qx_num?item.qx_num:0);
				})
			},
			onUnquality(){
				
				const data={"AA10":{"aaa100":"QX_BHGYY"},"LoginForm":this.loginForm};
				publicSelect(data).then(res=>{
					if (res.errorCode == "0") {
						this.showunqualityReson=true;
						this.unqualityResons=res.returnValue.AA10List;
						console.log(res.returnValue.AA10List);
					}
				})
				console.log(this.activeMachine);
			},
			onSelected(e) {
				let month = Number(e.month) < 10 ? ("0" + e.month) : e.month;
				let date = Number(e.date) < 10 ? ("0" + e.date) : e.date;
				// this.selectTime=month+"/"+date;
				this.selectTime = e.value;
			},

			scrolltoBottom() {
				this.page++;
				this.loadingType = 2;
			},



			getToreclaim: _.throttle(function(state) { //获取待回收列表
				const data = {
					method: this.stateMethod,
					"Tmxx": {
						"bnrList": [],
						"isChecked": false,
						"jsList": [],
						"zjFfList": [],
						"ff_did": this.dept
					}, //第一次登录不传 
					"PageReq": {
						"page": this.page,
						"rows": this.pageSize
					},
					"LoginForm": this.loginForm
				};
				getToreclaim(data).then(res => {
					console.log(res, '回收列表');
					if (res.errorCode == "0") {
						this.loadingType = res.returnValue.rows < this.pageSize ? 2 : 0;
						this.todayReclaimNum = res.returnValue.zsl;
						let resReclaimList = res.returnValue.rows.map(item => {
							return {
								bmc: item.bmc,
								tmid: item.tmid,
								checked: item.checked,
								hstype_name: item.hstype_name,
								qx_num: item.qx_num
							}
						})
						this.toReclaimList = this.toReclaimList.concat(resReclaimList);
					}
				})
			}, 500, {
				'trailing': false
			}),




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
			setTimeout(()=>{this.setDomHeight();},200)
			
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
	

		.split {
			background: #F3F3F3;
			height: 11upx;
			flex: none;
		}

		.program-detail {
			display: flex;
			align-items: center;
			padding: 20upx;
			.program-detail-time{
				margin:0 15upx;
				font-size: 33upx;
				color: #666666;
			}
			.program-text{
				margin:0 15upx;
				font-size: 29upx;
				color: #A5A5A5;
			}
		}



		.same {
			padding: 20upx 30upx;
			font-size: 29upx;
			flex: none;
		}
		
		.start-wash {
			border-top: 1upx solid $bordercolor;
			background: #0080FF;
			font-size: 38upx;
			color: #FFFFFF;
			height: 100px;
			flex:none;
		
			view {
				width: 50%;
				height: 100%;
				line-height: 100px;
				text-align: center;
			}
		
			view:first-child {
				border-right: 1upx solid $bordercolor;
				background: #FA6865;
				box-shadow: 0 0 0 0 #E5E5E5;
			}
		
			view:last-child {
				background-color: #0080FF;
			}
		
		}

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
