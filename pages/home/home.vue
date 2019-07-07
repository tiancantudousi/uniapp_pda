<template>
	<maincomponent style="background-color:#FFFFFF">
		<template slot="content">
			<myloading></myloading>
			<view class="home-header">
				<view class="home-header-top">
					<text class="username">{{loginForm.userName}}</text>
					<view class="some" @tap.stop="triggerDailog">
						<img src="../../static/img/i-notice.png"></img>
						<text class="notice-num">{{noticeNum}}</text>
					</view>
					<img class="some" src="../../static/img/i-more.png"></img>
				</view>
				<view class="home-header-bottom">
					<view class="some">
						<img src="../../static/img/i-number.png" alt="">
						<view style="padding-top:4upx;">{{loginForm.deptId}}</view>
					</view>
					<view class="some">
						<img src="../../static/img/i-department1.png" alt="">
						<view>{{loginForm.deptName}}</view>
					</view>
				</view>
			</view>
			<scroll-view scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}">
				<view class="home-list-content">
					<view class="home-list-item flexaround"  v-for="(item,index) in listTop" @click="navigateTop(item)" :key="index">
						<img :src="item.image" alt="">
						<view>
							{{item.text}}
						</view>
					</view>
				</view>
				<view style="margin:40upx 0;">
				
				</view>
				<view class="home-list-content">
					<view class="home-list-item flexaround" v-for="(item,index) in listBottom" @click="navigateTop(item)" :key="index">
						<img :src="item.image" alt="">
						<view>
							{{item.text}}
						</view>
					</view>
				</view>
			</scroll-view>
		</template>
	</maincomponent>
</template>
<script>
	let basePowerData = [{
			image: '../../static/img/i-reclaim.png',
			text: '回收'
		},
		{
			image: '../../static/img/i-sorting.png',
			text: '分拣'
		},
		{
			image: '../../static/img/i-purging.png',
			text: '清洗'
		},
		{
			image: '../../static/img/i-Pack.png',
			text: '清洗结果'
		},
		{
			image: '../../static/img/i-Pack.png',
			text: '打包'
		},
		{
			image: '../../static/img/i-Pack.png',
			text: '复核'
		},
		{
			image: '../../static/img/i-sterilization.png',
			text: '灭菌'
		},
		{
			image: '../../static/img/i-Pack.png',
			text: '灭菌结果'
		},
		{
			image: '../../static/img/i-shelves.png',
			text: '上架'
		},
		{
			image: '../../static/img/i-issue.png',
			text: '发放'
		},
		{
			image: '../../static/img/i-reception.png',
			text: '接受'
		},
		{
			image: '../../static/img/i-use.png',
			text: '使用'
		},
		{
			image: '../../static/img/i-loss.png',
			text: '损耗登记'
		},
		{
			image: '../../static/img/i-boxsearch.png',
			text: '包内容查询'
		},
		{
			image: '../../static/img/i-barcode.png',
			text: '条码失效'
		},
		{
			image: '../../static/img/i-Claims.png',
			text: '申领'
		},
		{
			image: '../../static/img/i-department.png',
			text: '科室申领'
		},
		{
			image: '../../static/img/i-Outsidepackages.png',
			text: '外来包'
		},
		{
			image: '../../static/img/i-Packageborrowed.png',
			text: '科室间借还包'
		},
		{
			image: '../../static/img/i-creature.png',
			text: '生物召回'
		},
		{
			image: '../../static/img/i-stock.png',
			text: '库存'
		}
	];
	import maincomponent from '../../components/maincontent/maincontent.vue';
	import xyDialog from '../../components/uni-ui/xy-dialog/xy-dialog.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		getPower
	} from "../../common/api.js";
	export default {

		components: {
			maincomponent,

			
			xyDialog
		},
		onBackPress() {
			setTimeout(() => {
				uni.navigateBack({
					delta: 1
				});
			}, 500)

		},
		data() {
			return {
				// tmid:'',
				id: '',
				numgc: '',

				noticeNum: 200,
				dialogTitle: '加急包发放',
				homeHeight: 'auto',
				listTop: [],
				listBottom: []
			}
		},
		created() {
			this.getPower();
			// this.listTop=basePowerData.slice(0,9);

		},
		computed: {
			...mapState(['loginForm'])
		},
		watch: {

		},
		methods: {

			getPower() {
	
				const data = {
					"Metafunction": {
						"us_userid": this.loginForm.userId,
						"me_appid": "PDA"
					},
					"LoginForm": this.loginForm
				};
				getPower(data).then(res => {
					console.log(res, '权限数据');
					this.sortPower(res.returnValue.metalist);
			
				})

			},
			sortPower(data) {
				// data.push({'me_metaname':"清洗结果"});
				//更换装配名称为 复核 


				data.forEach(item => {
					let havepowerItem = _.find(basePowerData, {
						'text': item.me_menulable
					});
					if (havepowerItem) {
						if (havepowerItem.text == "打包") {
							havepowerItem = {
								image: '../../static/img/i-Pack.png',
								text: '复核'
							};
						}
						this.listTop.length < 9 ? this.listTop.push(havepowerItem) : this.listBottom.push(havepowerItem);
					}
					if (item.me_menulable == "装配") {
						this.listTop.length < 9 ? this.listTop.push({
							image: '../../static/img/i-Pack.png',
							text: '打包'
						}) : this.listBottom.push({
							image: '../../static/img/i-Pack.png',
							text: '打包'
						});
					}
				})
			},
			navigateTop(item) {
				switch (item.text) {
					case "回收":
// 					uni.redirectTo({
// 						url: '/pages/reclaim/reclaim'
// 					});
						uni.navigateTo({
							url: '/pages/reclaim/reclaim',
							 animationType: 'none'
						});
						break;
					case "清洗":
						uni.navigateTo({
							url: '/pages/wash/wash',
							animationType: 'none'
						});
						break;
					case "清洗结果":
						uni.navigateTo({
							url: '/pages/washresult/washresult',
							animationType: 'none'
						});
						break;
					case "打包":
						uni.navigateTo({
							url: '/pages/pack/pack',
							animationType: 'none'
						});
						break;
					case "复核":
						uni.navigateTo({
							url: '/pages/composite/composite',
							animationType: 'none'
						});
						break;
					case "灭菌":
						uni.navigateTo({
							url: '/pages/sterilization/sterilization',
							animationType: 'none'
						});
						break;
					case "灭菌结果":
							uni.navigateTo({
								url: '/pages/sterilizationresult/sterilizationresult',
								animationType: 'none'
							});
							break;
					case "上架":
						uni.navigateTo({
							url: '/pages/grounding/grounding',
							animationType: 'none'
						});
						break;
					case "发放":
						uni.navigateTo({
							url: '/pages/provide/provide',
							animationType: 'none'
						});
						break;	
						case "损耗登记":
							uni.navigateTo({
								url: '/pages/lossregister/lossregister',
								animationType: 'none'
							});
							break;
								case "条码失效":
								uni.navigateTo({
									url: '/pages/barcodefailure/barcodefailure',
									animationType: 'none'
								});
								break;
								
				}

			},
			
			handleConfirm(e) {
				// this.$refs.xyDialog01.alert()
			},

			triggerDailog() {
				this.$refs.xyDialog.alert()
			},
			setDomHeight() {
				let _this = this;
				const query = uni.createSelectorQuery();
				let view = query.select('.home-header');
				view.boundingClientRect(data => {
					uni.getSystemInfo({
						success: function(res) {
							_this.homeHeight = res.windowHeight - data.height - res.statusBarHeight;
						}
					});
				}).exec();

			}
		},
		onReady() {
			setTimeout(() => {
				this.setDomHeight();
			}, 100)
		}
	}
</script>

<style lang="scss">
	.home-list-content {
		display: flex;
		flex-wrap: wrap;
	}

	.home-list-item {
		width: 33%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20upx 0;

		&>img {
			width: 140upx;
			height: 140upx;
			margin-bottom: 15upx;
		}
	}

	.home-header {
		height: 200upx;
		// background: url('../../static/img/login-bg.png') no-repeat 100% 100%;
		background-color: #0065CC;
		border-radius: 0 0 100upx 100upx;
		margin-top:var(--status-bar-height);

		.home-header-bottom {
			display: flex;
			padding: 0 0 0 40upx;
			align-items: center;
			height: 40upx;
			font-size: 30upx;

			img {
				height: 28upx;
				width: 32upx;
			}

			.some {
				margin: 0 15upx;
				color: white;
				display: flex;
				align-items: center;

				&>view {
					margin-left: 10upx;
				}
			}

			.moremargin {
				margin-left: 40upx;
			}
		}

		.home-header-top {
			display: flex;
			align-items: center;
			padding: 30upx 0 20upx 0;

			img {
				width: 40upx;
				height: 40upx;
			}

			.username {
				padding: 0 40upx;
				flex: 1;
				font-size: 50upx;
				color: white;
			}

			.some {
				margin: 0 30upx;
				position: relative;

				.notice-num {
					position: absolute;
					font-size: 26upx;
					top: -24upx;
					right: -40upx;
					height: 30upx;
					line-height: 30upx;
					padding: 0 10upx;
					border-radius: 20upx;
					background-color: #FF513C;
					color: white;
					z-index: 100;
				}
			}

		}
	}

	.home-content {
		// padding-top:20upx;
		overflow-y: scroll;

		.uni-grid-item-image {
			width: 150upx;
			height: 150upx;
		}
	}
</style>
