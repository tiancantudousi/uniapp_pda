<template>
	<maincomponent style="background-color:#FFFFFF;">
		<view slot="content">
			<view class="login-content">
				<view class="headTitle">
					<text>消毒供应中心质量追溯系统</text> 
				</view>

				<view class="loginForm acForm">
					<view class="input-group" id="input-group">
						<view class="input-row" style="position:relative;">
                            <input class="uni-input" type="text" @input="onSearch" v-model="dept" placeholder="科室" />
							<view class="kslistcontent" v-if="toggleList&&dept.length">
								<scroll-view scroll-y="true" v-if="dataList.length" class="scroll-Y">
									<view class="listItem" v-for="(item, itemIndex) in dataList" @click.stop="onChoseKs(item)" :key="itemIndex">
										{{item.de_deptname}}</view>
								</scroll-view>
							</view>
						</view>

						<view class="input-row" style="position:relative;">
							<input class="uni-input" type="text" v-model="account"  :focus="accountFocus"
							 placeholder="用户名" />
							
						</view>
			


						<view class="input-row">
							<input class="uni-input" type="password" v-model="password" placeholder="密码" />
							
							<icon v-if="clearshow" class="clearIcon" @tap="clearPassword()" type="clear" size="22" />
						</view>
					</view>
					<view class="passwordError">
						<view v-show="passwordError">用户名或密码错误</view>
						<!-- <view v-show="pleasEnterInformation"></view> -->
					</view>

					<view class="btn-row">
						<button type="primary" class="primary" @tap="bindLogin">登录</button>
					</view>
				
				</view>


				<view class="set-up">
					<text>医惠科技有限公司</text>
					<text @tap.stop="seting">设置</text>
				</view>
				<myloading></myloading>
				<setipcomponent v-if="setipshow" @closeSetip="onCloseSetip"></setipcomponent>
			</view>

			<selfDialogComponent v-if="showDialog">
				<view slot="content">
					检测到性版本，是否更新
				</view>
				<view slot="footer">
					<button type="default" size="mini" @click.stop="showDialog=false;remark='';">否</button>
					<view style="display:inline-block;width:20upx;"></view>
					<button type="primary" size="mini" @click.stop="download">是</button>
				</view>

			</selfDialogComponent>


		</view>
	</maincomponent>
</template>

<script>
	let dataSource = [];

	import {
		mapState,
		mapMutations
	} from 'vuex'
	import maincomponent from '../../components/maincontent/maincontent.vue';
	import setipcomponent from '../../components/setip/setip.vue';
	import selfDialogComponent from "../../components/base/self-dialog.vue";
	import selectComponent from "../../components/base/search-select.vue";

	
	import {
		login,
		getDepts,
		checkversion
	} from "../../common/api.js";
	import {
		myMixin
	} from "../../common/mixins.js";
	// import loginnvue from "../../components/base/login.nvue";
	// import selectTestComponent from "../../components/base/select-test.vue";

	export default {
		mixins: [myMixin],
		components: {
			maincomponent,
			setipcomponent,
			selfDialogComponent,
selectComponent
		},
		data() {
			return {
				// 测试
				deptSelect:false,
				accountFocus: false,
				activeboradHeight: '',
				providerList: [],
				hasProvider: false,
				account: '', //用户名
				password: '', //密码
				dept: '', //科室
				positionTop: 0,
				passwordError: false,
				setipshow: false,
				dataList: [],
				toggleList: false,
				currentDept: null,
				version: '',
				showDialog: false,
				pleasEnterInformation: false,
				versiondata: ''
			}
		},
		computed: {
			clearshow: function() {
				return this.password != '';
			}
		},
		watch: {
			password(val, oldval) {
				this.cleanError()
			},

			account(val, oldval) {
				this.cleanError()
			}

		},
		methods: {
			// 测试
			showSelect(name){
			    if(name!="deptSelect"){
					this.deptSelect=false;
				}
			
			    setTimeout(()=>{
					this[name]=!this[name];
				},20)
				
			},
				onChoosedept(item) {
					this.deptSelect=false;
			
			},
			searchList(e) {
					this.searchDeptsthrottle(e, dataSource).then(res => {
					this.dataList = res;
				});
				// this.kslist = this.searchDeptsthrottle(e, deptlist);
			},
			
			// 测试
			
			
			
             cleandeptfun(){
				 this.toggleList=false;
				 console.log(this.currentDept,'this.currentDept');
// 				 if(!this.currentDept){
// 					 this.dept='';
// 					 this.toast('请选择科室');
// 				 }
				 
			 },
			checkupload() {
				uni.getSystemInfo({
					success: (res) => {
						console.log(res.platform);
						//检测当前平台，如果是安卓则启动安卓更新  
						if (res.platform == "android") {
							this.AndroidCheckUpdate();
						}
					}
				})
			},
			download() {
				this.showDialog = false;
				
				var dtask = plus.downloader.createDownload(
					`http://${uni.getStorageSync('endIp')}/${this.versiondata.returnValue.UpdateFileList[0].downloadpath}`, {},
					function(d, status) {
						// 下载完成  
						if (status == 200) {
							plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function(error) {
								uni.showToast({
									title: '安装失败',
									mask: false,
									duration: 1500
								});
							})
						} else {
							uni.showToast({
								title: '更新失败',
								mask: false,
								duration: 1500
							});
						}
					});
				dtask.start();
			},
			AndroidCheckUpdate: function() {
				
				var _this = this;
				const data = {
					"UpdateFilesSetting": {
						"clientversioncode": "0",
						"platformtype": "2"
					},
					"LoginForm": {}
				};
				checkversion(data).then(res => {
					console.log(JSON.stringify(res));

					if (res.returnValue.UpdateFileList[0] && res.returnValue.UpdateFileList[0].versioncode > _this.version) {
						_this.showDialog = true;
						this.versiondata = res;

					}
				}) 
			},

			cleanError() {
				this.passwordError = false;
				this.pleasEnterInformation = false;
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
			onCloseSetip() {
				this.setipshow = false;
				this.$nextTick(() => {
					this.getdeptsbyip();
				})

			},
			seting() {
				this.setipshow = true;
			},
			getDepts() {
				const data = {
					"Department": {}
				};
				this.$loading();
				try {
					getDepts(data).then(res => {
						console.log(res);
						this.$loading(false);
						if (res.errorCode == '0') {
							this.checkupload();

							dataSource = res.returnValue.DepartmentList.map(item => {
								return {
									de_alph: item.de_alph,
									de_deptname: item.de_deptname,
									de_deptid: item.de_deptid
								};
							});
							uni.setStorageSync('deptlist', dataSource);

							this.dataList = [].concat(dataSource).slice(0, 15);
						}
					})
				} catch (e) {
					this.$loading(false);
					this.toast('网络连接失败');
					
				}

			},

			onChoseKs(e) {
				console.log(e,'选择科室');
				this.dept = e.de_deptname;
				this.currentDept = e;
				this.toggleList = false;
				this.accountFocus = true;
			},
			clearPassword() {
				this.password = '';
			},
			bindLogin() {

                 if (!this.currentDept) {
					this.toast('请选择科室');
					return;
				}
				if (!this.account || !this.password) {
					this.toast('请输入用户名和密码');
					return;
				}
				const data = {
					"LoginForm": {
						"deptId": this.currentDept.de_deptid,
						"loginName": this.account,
						"password": this.password
					}
				};

				this.$loading();
				login(data).then(res => {
					console.log(res, '登录接口');
					this.$loading(false);
					if (res.errorCode == '0') {
						console.log(res.returnValue.LoginForm, 'res.returnValue.LoginForm');
						// this.$store.commit("setLoginForm", res.returnValue.LoginForm);
						uni.setStorageSync('loginForm', res.returnValue.LoginForm);
						this.setLoginForm(res.returnValue.LoginForm);
						
// 												uni.navigateTo({
// 													url: '/pages/start/start'
// 												});
						uni.navigateTo({
							url: '/pages/start/start'
						});
					} else {
						this.passwordError = true;
					}
				})


			},
			getdeptsbyip(){
				uni.getStorage({
					key: 'endIp',
					success: (res)=> {
							this.getDepts();
					},
					fail:(e)=>{
						this.toast('请设置ip');
						this.setipshow = true;
					}
				});
			},

			...mapMutations(['setLoginForm'])

		},
		onReady() {
			this.getdeptsbyip();
// 			setTimeout(()=>{
// 				if (!uni.getStorageSync('endIp')) {
// 					this.toast('请设置ip');
// 					this.setipshow = true;
// 				} else {
// 					this.getDepts();
// 				}
// 			},2000)
            
		


		}


	}
</script>

<style lang="scss" scoped>
	@import '../../common/global.scss';

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

	.login-content {
		height: 100vh;
		overflow: hidden;
		width: 100vw;
	}

	.headTitle {
		padding-top: 100upx;
		height: 400upx;
		line-height: 200upx;
		background: url('../../static/img/login-bg.png') no-repeat;
		background-size: 100% 100%;
		text-align: center;

		text {
			font-family: PingFangSC-Medium;
			font-size: 48upx;
			color: #FFFFFF;
			letter-spacing: 0;
		}
	}

	.whitebg {
		backgroun-color: #FFFFFF;
	}

	.loginForm {

		// 		margin: 0 auto;
		// 		margin-top: -120upx;
		width: 91.1vw;
		height: 550upx;
		background: #FFFFFF;
		box-shadow: 0 8upx 24upx 0 rgba(0, 0, 0, 0.10);
		border-radius: 8upx;
	}

	.acForm {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	#input-group {
		margin-top: 0;
		border-radius: 8upx;
	}

	#input-group::before {
		background-color: #fff;
	}

	#input-group::after {
		background-color: #fff;
	}

	.input-row {
		height: 120upx;
		border-radius: 8upx 8upx 0 0;
		border-bottom: 1upx solid #E5E5E5;
		display: flex;
		align-items: center;
		margin: 0 40upx;
		width: 90%;

		.uni-input {
			width: 100%;
		}

		.m-input-view {
			border-radius: 8upx;
		}
	}

	.btn-row {
		padding: 0 40upx;
		margin-top: 24upx;
	}

	.clearIcon {
		position: absolute;
		z-index: 200;
		top: 50%;
		right: 20upx;
		transform: translate(0, -50%);
	}

	.textor {
		height: 160upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: PingFangSC-Regular;
		font-size: 28upx;
		color: #A5A5A5;
		letter-spacing: 0;
	}



	.set-up {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 38upx;
		position: absolute;
		bottom: 40upx;

		// margin-top:20vh;
		width: 100%;

		text:first-child {
			color: #A5A5A5;
			margin-right: 10upx;
		}

		text:last-child {
			color: #0080FF;
			margin-left: 10upx;
		}
	}

	.passwordError {
		color: red;
		font-size: 26upx;
		height: 40upx;
		line-height: 60upx;
		padding: 0 40upx;
	}

	.test {
		overflow-y: scroll;
		height: calc(100vh - var(--status-bar-height));
	}


	//     .action-row {
	//         display: flex;
	//         flex-direction: row;
	//         justify-content: center;
	//     }
	// 
	//     .action-row navigator {
	//         color: #007aff;
	//         padding: 0 20upx;
	//     }
	// 
	//     .oauth-row {
	//         display: flex;
	//         flex-direction: row;
	//         justify-content: center;
	//         position: absolute;
	//         top: 0;
	//         left: 0;
	//         width: 100%;
	//     }
	// 
	//     .oauth-image {
	//         width: 100upx;
	//         height: 100upx;
	//         border: 1upx solid #dddddd;
	//         border-radius: 100upx;
	//         margin: 0 40upx;
	//         background-color: #ffffff;
	//     }
	// 
	//     .oauth-image image {
	//         width: 60upx;
	//         height: 60upx;
	//         margin: 20upx;
	//     }
</style>
