<template>
	<maincomponent style="background-color:#FFFFFF">
		<view slot="content">
			<view class="washing-content">
				<view class="washing-header">
					<navbarComponent  :buttonList="[activeMachine.dev_name]">
						<view slot="headerRight">
							<view class="header-right flexcenter" @click.stop="showpotChange=true">
								换锅
							</view>
						</view>
					</navbarComponent>
					<loginInformationComponent></loginInformationComponent>
				</view>
				<potChange :washstate="'washing'" @onClosetemp="showpotChange=false" v-if="showpotChange"></potChange>
	
				<view class="program-detail">
					<checkstatecontentComponent :flexaround="true">
						<template slot="content">
							<view class="left">
								<view>{{start}}</view>
								<view>{{activeMachine.proc_name}} &nbsp;&nbsp;{{activeMachine.plan_time}}分</view>
							</view>
							<view class="right">
								<img src="../../static/img/i-time1.png" alt="">
								<view>{{activeMachine.countdown}}</view>
							</view>
						</template>
					</checkstatecontentComponent>
				<!-- 	<view class="program-detail-content flexaround">
						
					</view> -->
				</view> 
			
				<view class="split"></view>
				
				<scroll-view scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}" @scrolltolower="scrolltoBottom">
					<view v-for="(item,index) in detailList" :key="index">
						<scrollListItem :item="item"></scrollListItem>
					</view>
					<loadingMoreComponent :loadingType="loadingType"></loadingMoreComponent>
				</scroll-view>
				<view class="start-wash flexaround">
				     <view @click.stop="update">修改</view>
					  <view>作废</view>
				</view>
			<!-- 	<view class="washing-main-noplate">
				        <img src="../../static/img/image-plate.png" alt="">
						<text>请扫描清洗盘条码</text>
				</view> -->




				
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
	import potChange from "../../components/qualitycheck/pot-change.vue";

	// import mInput from "../../components/uni-ui/m-input/m-input.vue";
	import washingitem from "../../common/global.js";

	import {
		mapGetters,
		mapMutations
	} from "vuex";

	import selfDialogComponent from "../../components/base/self-dialog.vue";
	import {
		
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
			checkstatecontentComponent,
			potChange

		},
		data() {
			return {
				selectTime:formatDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
				showPicker:false,	
				loadingType:0,
				page:1,
				pageSize:20,
				showDialog:false,
				stateList:[{hstype_name:'123'}],
				homeHeight:'100',
				start:'',
				activeMachine:'',
				showpotChange:false
			}
		},
		computed: {
			...mapGetters(["loginForm","detailList"])
		},
		created() {
			 this.activeMachine=washingitem.item;
		  this.start=this.activeMachine.start_dt.substring(11,this.activeMachine.start_dt.length);
		 
		},

		methods: {
// 				onClosetemp(){
// 					this.$emit("onClosetemp",null);
// 				},
			update(){
				 uni.navigateTo({url:'/pages/washfree/washfree?id=update'});
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
			setTimeout(()=>{this.setDomHeight();},200)
		}
	}
</script>

<style lang="scss">
	@import "../../common/global.scss";

	/* #ifdef APP-PLUS */
	.washing-content {
		width:100%;
		position:absolute;
		top:var(--status-bar-height);
		left:0;
		overflow-y: hidden;
		height: calc(100vh - var(--status-bar-height));
	}
	/*  #endif  */
	/* #ifdef H5 */
	.washing-content {
		width:100%;
		position:absolute;
		top:0;
		left:0;
		overflow-y: hidden;
		height: 100vh;
	}
	/*  #endif  */
	.washing-content {	
		display: flex;
		flex-direction: column;
		.split{
			background: #F3F3F3;
			height:11upx;
			flex:none;
		}
		.program-detail{
			padding: 20upx 30upx;
			flex:none;
			 // .program-detail-content{
				.left{
					view:first{
						font-size: 33upx;
						color: #666666;
					}
					view:last-child{
						font-size: 29upx;
						color: #A5A5A5;
					}
				}
				.right{
					display:flex;
					align-items: center;
					img{
						width:58upx;
						height:58upx;
					}
					view{
						margin-left:10upx;
						font-size: 58upx;
						color: #F5A623;
					}
				}
			// }
				
			
			
		}
	
		

	
	
		.home-content {
			flex: 1;
		
		}
		.start-wash{
			border-top:1upx solid $bordercolor;
			background: #0080FF;
			font-size: 38upx;
			color: #FFFFFF;
			height:100px;
			flex:none;
			view{
				width:50%;
				height:100%;
				line-height:100px;
				text-align: center;
			}
			view:first-child{
				border-right:1upx solid $bordercolor;
			}
			
		}
		

		.washing-header {
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
