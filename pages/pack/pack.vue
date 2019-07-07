<template>
	<view class="maincontent">
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<view class="wash-header">
			<navbarComponent @stepClick="onStepClick" :buttonList="['打包','统计']"></navbarComponent>
			<loginInformationComponent></loginInformationComponent>
			<view class="flexaround same border-bottom timd" v-if="activeTabIndex==0">
				<text style="flex:none;">包条码:</text>
				<input class="tmidinput" type="text" v-model="tmid" confirm-type="search" @confirm="dopack()" placeholder="请录入包条码" />
			</view>
		</view>




		<view class="wash-content" v-if="activeTabIndex==0">
			<view class="pack-list-item flexaround border-bottom" v-for="(item,index) in packList" :key="index">
				<img src="../../static/img/timg.jpg" style="width:110upx;height:110upx;padding:15upx;" alt="">

				<view style="flex:1;">
					<view class="flexaround" style="flex-wrap: wrap;">
						<view class="thead-pack" style="flex:2;">{{item.bmc}}</view>
						<view class="pack-person" style="flex:1;">
							{{item.pb_uname}}
						</view>
					</view>
					<view class="flexaround">
						<view class="pack-tmid">{{item.tmid}}</view>
						<view class="pack-time">{{item.xq_start}}</view>
					</view>
				</view>
			</view>
			<loadingMoreComponent v-if="packList.length" :loadingType="loadingType"></loadingMoreComponent>
		</view>
		<packcencusComponent v-if="activeTabIndex==1" :pagestate="'pack'" :loadingmore="loadingmore"></packcencusComponent>
		<myloading></myloading>
		<selfDialogComponent v-if="showDialog">
			<view slot="content">
				包条码已打包，是否撤销
			</view>
			<view slot="footer">
				<button type="default" size="mini" @click.stop="showDialog=false;remark='';">否</button>
				<view style="display:inline-block;width:20upx;"></view>
				<button type="primary" size="mini" @click.stop="docancle">是</button>
			</view>
		
		</selfDialogComponent>

	</view>


</template>
<script>
	import Vue from 'vue';
	import navbarComponent from "../../components/nav-bar/nav-bar-base.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";
	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import packListItem from "../../components/pack/pack-list-item.vue";
	import packcencusComponent from "../../components/pack/packcensus.vue";
	import selfDialogComponent from "../../components/base/self-dialog.vue";
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";
	import {
		dopack,
		canclepack
	} from "../../common/api.js";
	// import washingitem from "../../common/global.js";
	// import Bus from "../../common/bus.js";


	export default {
		components: {
			navbarComponent,
			loginInformationComponent,
			loadingMoreComponent,
			selfDialogComponent,
			packListItem,
			packcencusComponent
		},
		data() {
			return {
				// {bmc:'1', pb_uname:'12', tmid:'12121', xq_start:3213},{bmc:'1', pb_uname:'12', tmid:'12121', xq_start:3213}
				packList: [],
				loadingType: 2,
				page: 1,
				pageSize: 20,
				showDialog: false,
				homeHeight: '0',
				tmid: '',
				activeTabIndex:0,
				loadingmore:false

			}
		},
		computed: {
			...mapGetters(["loginForm"])
		},
		onReachBottom() {
			if(this.activeTabIndex==1){
				this.loadingmore=!this.loadingmore;
			}
		},
		onUnload(){
			 this.$bus.off('onBarCode');
		},
		onLoad() {
			this.$bus.on('onBarCode', (e) => {
				this.judgeScanType(e.data);
			});
		},

		methods: {
				/*清洗enter事件功能区域*/
			judgeScanType(data){
				let reg=new RegExp('^(TM|tm)');
				if(reg.test(data)){//包扫码
					this.tmid = data.slice(2,data.length);
					this.dopack();
				}		
			},
	        onStepClick(index){
				this.activeTabIndex=index;
			},
			dopack() {
				if(this.tmid==''){
					this.toast("包条码不能为空");
					return;
				}
				const data = {
					"PbLog": {
						"opt_uid": this.loginForm.userId,
						"opt_uname": this.loginForm.userName,
						"tmid": this.tmid
					},
					"LoginForm": this.loginForm
				};
				dopack(data).then(res => {
					console.log(res, '打包');
					if (res.status == "OK") {
						let item = res.returnValue.tmxxList[0];

							this.packList.push({
								bmc: item.bmc,
								tmid: item.tmid,
								xq_start: item.xq_start,
								pb_uname: item.pb_uname
							})

					
						this.tmid = "";
					}
					if (res.status == 'warn') {
						this.showDialog = true;
					}
					if(res.status=="error"){
						this.toast(res.message);
					}
				})
			},
			docancle() {
				this.canclepack(this.tmid);
				this.showDialog = false;
			},
			canclepack(tmid) {
				const data = {
					"PbLog": {
						"tmid": tmid
					},
					"LoginForm": this.loginForm
				};
				canclepack(data).then(res => {
					if (res.errorCode == "0") {
						this.toast("撤销成功");
						this.packList = this.packList.filter(item => {
							return item.tmid != tmid;
						})
						this.tmid='';
					}
				})
			}



		}
	}
</script>

<style lang="scss" scoped>
	@import "../../common/global.scss";

	.maincontent {
		height: 100vh;
		width: 100vw;
		padding: 0;
		margin: 0;
		position: relative;
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

	.status_bar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		height: var(--status-bar-height);
		width: 100%;
		background-color: #000000;
	}

	/* #ifdef APP-PLUS */
	.wash-content {
		width: 100%;
		position: absolute;
		top: calc(254upx + var(--status-bar-height));
		left: 0;
		// overflow-y: hidden;
		// height: calc(100vh - var(--status-bar-height));
	}

	/*  #endif  */
// 	/* #ifdef H5 */
// 	.wash-content {
// 		width: 100%;
// 		position: absolute;
// 		top: calc(122px + var(--status-bar-height));
// 		left: 0;
// 		overflow-y: hidden;
// 		height: 100vh;
// 	}

	 // #endif 


		.same {
			background-color: white;
			height:90upx;
			box-sizing: border-box;
			padding: 20upx 30upx;
			font-size: 35upx;
			flex: none;
		}

		.tmidinput {
			flex: 1;
			padding-left: 20upx;
		}

		.table-head {
			padding: 20upx 6%;
			display: flex;
			align-items: center;

			&>view {
				flex: 1;
				text-align: center;
			}
		}

		


	
</style>
