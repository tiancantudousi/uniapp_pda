<template>

	<view class="maincontent" @click="machineSelect=false">
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<view class="wash-header">
			<navbarComponent @stepClick="onStepClick" :buttonList="['灭菌结果']"></navbarComponent>
			<loginInformationComponent></loginInformationComponent>
			<view class="same border-bottom flexaround">
				<view class="select-machine" @click.stop="toggleMachine">
					{{activeMachine?activeMachine.name:'请选择灭菌机'}}
					<scroll-view scroll-y="true" v-if="machineList.length&&machineSelect" style="width:120%;" class="scroll-Y">
						<view class="listItem" @click.stop="onChoosemachine(null)" :key="-1">请选择</view>
						<view class="listItem" v-for="(item, itemIndex) in machineList" @click.stop="onChoosemachine(item)" :key="itemIndex">
							{{item.name}}</view>
					</scroll-view>
				</view>
				<view class="flexcenter showtime" @click.stop="onShowDatePicker">
					<text>{{selectTime}}</text>
					<img src="../../static/img/i-down1.png" class="image-down" alt="">
				</view>

			</view>
			<view class="same potnum">
				<input class="uni-input" type="text" v-model="numgc" @input="onnumgcchange($event)" placeholder="请录入锅次" />
			</view>
			<mx-datepicker v-model="showPicker" :init="selectTime" type="date" @selected="onSelected" />

		</view>

		<view class="main-scroll">
			<view v-for="(item,index) in washresultList" :key="index" @click.stop="navigatestate(item,index)">
				<sterilizationresultListItem :item="item"></sterilizationresultListItem>
			</view>
			<loadingMoreComponent v-if="washresultList.length" :loadingType="loadingType"></loadingMoreComponent>
		</view>
		<myloading></myloading>



	</view>

</template>
<script>
	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";

	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import sterilizationresultListItem from "../../components/sterilization/sterilization-result-item.vue";
	import MxDatepicker from "../../components/uni-ui/mx-datepicker/mx-datepicker.vue";
	import selectComponent from "../../components/base/search-select.vue";

	// import mInput from "../../components/uni-ui/m-input/m-input.vue";


	import {
		mapGetters,
		mapMutations
	} from "vuex";


	import {
		getsterilizationresulList,
		getSystemTime,
		getsterilizationList,
		getsterilizationpacklist
	} from "../../common/api.js";
	import {
		myMixin
	} from "../../common/mixins.js";
	import {
		formatDate
	} from "../../common/tool.js";


   let devId;

	export default {
		mixins: [myMixin],
		components: {
			maincomponent,
			navbarComponent,
			loginInformationComponent,
			loadingMoreComponent,

			sterilizationresultListItem,
			MxDatepicker,
			selectComponent

		},
		data() {
			return {
				machineSelect: false,
				activeMachine: '',
				selectTime: formatDate(new Date(), "yyyy-MM-dd"),
				showPicker: false,
				machineList: [],
				loadingType: 2,
				page: 1,
				pageSize: 20,
				showDialog: false,
				washresultList: [],
				homeHeight: '100',
				
				numgc: ''
			}
		},
		computed: {
			...mapGetters(["loginForm"])
		},
		onLoad() {
			this.getsterilizationList();
			this.getsystime();
			 this.$bus.on('refreshsterilizationresult',this.getsterilizationcensusList);
		},

		methods: {
				     navigatestate(item,index){
						console.log(item);
							 if(item.result!="待检定"){
								 return;
							 }
							 this.set_activesterilizationMachine(JSON.parse(JSON.stringify(item)));
							 this.getMachineDetail(item);			      
						 },
						 navigate(item){
							  switch(item.result){
									 case "待检定":uni.navigateTo({url:'/pages/sterilizationcheck/sterilizationcheck?id=sterilizationresult'});break;
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
								"Mj":{
									"did":this.loginForm.deptId,
									"jgms":-1,
									"sb_type":"",
									"state":"3",
									"state_name":"待检定",
									"d_gc":item.d_gc,
									"dev_id":item.dev_id,
									"dev_name":item.dev_name,
									"is_inv":"1",
									"t_gc":item.t_gc,
									"type":item.type},"LoginForm":this.loginForm};
							getsterilizationpacklist(data).then(res=>{
								this.$loading(false);
								this.setdetailsterilization(res.returnValue.mjDtlList);
								this.navigate(item);
								console.log(res,'灭菌机包详情');
							})
						},	
			getsterilizationcensusList(){
				const data={"Mj":{"d_gc":this.numgc,"dev_id":devId,"start_dt":this.selectTime+" 00:00:00"},"LoginForm":this.loginForm};
				this.$loading();
				getsterilizationresulList(data).then(res=>{
					this.$loading(false);
					console.log(res,'灭菌结果');
					if(res.status=="OK"){
						if(!res.returnValue.mjResultList.length){
							
							this.toast('未查询到相关记录!');
						}
						
						let temparr=res.returnValue.mjResultList.map(item=>{
								return {start_dt:item.start_dt,end_dt:item.end_dt,result:item.result_name,type:item.type,dev_id:item.dev_id,dev_name:item.dev_name,hx_result:item.hx_result=='1'?'合格':'不合格',sw_result:item.sw_result=='1'?'合格':item.sw_result=='1'?'不合格':'',wl_result:item.wl_result=='1'?'合格':'不合格',d_gc:item.d_gc,t_gc:item.t_gc,start_dt_mj:item.start_dt};
							})
						this.washresultList=[].concat(temparr);
					
					}
				})
			},
			toggleMachine() {
				this.machineSelect = !this.machineSelect;
			},

			getsystime() {
				const data = {
					"LoginForm": this.loginForm
				};
				getSystemTime(data).then(res => {
					if (res.errorCode == "0") {
						this.selectTime = res.returnValue.ServerInfo.systemtime.substring(0, 11);
						this.getsterilizationcensusList();
					}

				})
			},
			onnumgcchange() {
				this.washresultList=[];
				this.getsterilizationcensusList();
			},
			onChoosemachine(item) {
				this.washresultList=[];
				this.machineSelect = false;
				this.activeMachine = item;
				devId = item ? item.id : '';
				this.getsterilizationcensusList();
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
	
			onSelected(e) {
				let year = e.year;
				let month = Number(e.month) < 10 ? ("0" + e.month) : e.month;
				let date = Number(e.date) < 10 ? ("0" + e.date) : e.date;
				this.selectTime = year + "-" + month + "-" + date;
				this.washresultList=[];
				this.getsterilizationcensusList();
			},
			onShowDatePicker() { //显示
				this.showPicker = true;
			},
			...mapMutations(['setdetailsterilization','set_activesterilizationMachine']),

// 			scrolltoBottom() {
// 				this.page++;
// 				this.loadingType = 2;
// 				// this.getToreclaim();
// 				console.log("loading more");
// 			},








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
			// 			}


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

	.main-scroll {
		position: absolute;
		left: 0;
		width: 100%;
		top: calc(334upx + var(--status-bar-height));
	}

	.select-machine {
		width: 60%;
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

	.scroll-Y {
		position: absolute;
		left: 0;
		top: 100%;
		width: 100%;
		z-index: 2000;
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

	.potnum {
		border-bottom: 1upx solid $bordercolor;
	}

	.image-down {
		flex: none;
		width: 30upx;
		height: 15upx;
		margin-left: 10upx;
	}


	.showtime {
		width: 50%;
		font-size: 35upx;
		color: #666666;
		// min-width:310upx;
	}

	.same {
		box-sizing: border-box;
		height: 90upx;
		padding: 20upx 30upx;
		font-size: 35upx;
		background-color: white;
		color: #666666;
	}

	.home-content {
		flex: 1;
	}

	.select-state {
		display: flex;
		align-items: center;
		border-bottom: 1upx solid $bordercolor;

		.chose {
			margin-left: 10upx;
			font-size: 29upx;
		}
	}
</style>
