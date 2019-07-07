<template>
	<maincomponent style="background-color:#FFFFFF">
		<view slot="content">
			<view class="todayreclaim-content">
				<reclaimDetailComponent v-if="togglereclaim" @closeDetail="togglereclaim=false" :tmid="chosePack.choseTmid" :bmc="chosePack.bmc"></reclaimDetailComponent>
				<view class="reclaim-header">
					<navbarComponent :buttonList="['今日回收']">
						<view slot="headerRight">
							<view class="header-right flexcenter">
							
									<!-- <img src="../../static/img/i-keyboad1.png" alt=""> -->
								
							</view>
						</view>
					</navbarComponent>
					<loginInformationComponent></loginInformationComponent>
				</view>

				<scroll-view scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}" @scrolltolower="scrolltoBottom">
					<view v-for="(item,index) in todayReclaimList" :key="index">
					<!-- <view v-for="(item,index) in toReclaimList" v-show="visableIndex<=index&&index<=visableIndex+visablenum" :key="index" :class="{'scrollItem':index==0}"> -->
						<reclaimListItemComponent @showdetail="onshowdetail" :item="item"></reclaimListItemComponent>
					</view>
					<loadingMoreComponent :loadingType="loadingType"></loadingMoreComponent>
				</scroll-view>
			
			</view>
		</view>
	</maincomponent>
</template>
<script>
	let deptlist;
	let scrollHeight;
	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";
	import reclaimListItemComponent from "../../components/reclaim/reclaim-list-item.vue";
	// import startReclaimComponent from "../../components/reclaim/start-reclaim.vue";
	import reclaimDetailComponent from "../../components/reclaim/reclaim-detail.vue";
	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	// import downpersonComponent from "../../components/reclaim/down-person.vue";

	import {
		mapGetters,
		mapMutations
	} from "vuex";
	// import selectComponent from "../../components/base/search-select.vue";
	import {
         getTodayReclaim
	} from "../../common/api.js";
	// import { myMixin } from "../../common/mixins.js";


	export default {

		components: {
			maincomponent,
			navbarComponent,
			loginInformationComponent,
			reclaimListItemComponent,
			loadingMoreComponent,
			reclaimDetailComponent

		},
		data() {
			return {
				loadingType:0,
				page:1,
				pageSize:20,
				homeHeight: 200,
				todayReclaimList: [],
				chosePack:{},
				togglereclaim:false
			}
		},
		computed: {
			...mapGetters(["loginForm"])
		},
		created() {
			this.getTodayReclaim();
		},
		methods: {
				onshowdetail(item) { //查看包信息
				this.togglereclaim = true;
				this.chosePack.choseTmid = item.tmid;
				this.chosePack.bmc = item.bmc;
				console.log(item);
			},
		
			scrolltoBottom(){
				this.page++;
			    this.loadingType=1;
				this.getTodayReclaim();
				 console.log("loading more");
			},
			getTodayReclaim:_.throttle(function(state){//获取待回收列表
				const data={
				"Tmxx":{},"PageReq":{"page":this.page,"rows":this.pageSize},"LoginForm":this.loginForm};
				getTodayReclaim(data).then(res=>{
					console.log(res,'今日回收列表');
				    if(res.errorCode=="0"){
						this.loadingType=res.returnValue.rows<this.pageSize?2:0;
						let resReclaimList=res.returnValue.rows.map(item=>{
							return {bmc:item.bmc,tmid:item.tmid,hstype_name:item.hstype_name,qx_num:item.qx_num}
						})
						this.todayReclaimList=this.todayReclaimList.concat(resReclaimList);

					}
				})
			},500,{ 'trailing': false }),

			
		
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

			},
			
		

		},
		onReady() {
			setTimeout(() => {
				this.setDomHeight();
			}, 100);
		
			
		}
	}
</script>

<style lang="scss">
	@import "../../common/global.scss";

	/* #ifdef APP-PLUS */
	.todayreclaim-content {
		width:100%;
		position:absolute;
		top:var(--status-bar-height);
		left:0;
		overflow-y: hidden;
		height: calc(100vh - var(--status-bar-height));
	}

	/*  #endif  */
	.todayreclaim-content {
		display:flex;
		flex-direction: column;
	
		.kslist {
			display: flex;
			align-items: center;
			border-bottom: 1upx solid $bordercolor;
			.test{
				width:300upx;
			}
		}
        .reclaim-header {
			flex:none;
         	.header-right {
         		color: white;
         
         		img {
         			height: 37upx;
         			width: 50upx;
         			margin-left: 10upx;
         		}
         	}
         }
		.home-content{
			flex:1;
		}

		.same {
			padding: 20upx 30upx;
			font-size: 29upx;
			flex: none;
		}

		
	}
</style>
