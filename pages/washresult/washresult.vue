<template>
	<maincomponent style="background-color:#FFFFFF">
		<template slot="content">
			<view class="wash-content" @click="closeAllselect">
				<view class="wash-header">
					<navbarComponent :buttonList="['清洗结果']">
					</navbarComponent>
					<loginInformationComponent></loginInformationComponent>
				</view>
				<view class="select-state same">
					<view class="chose" style="flex:1;">
						<selectComponent :width="'200'" @click="showSelect('machineSelect')" :listshow="machineSelect"  @chose="onChoosemachine" :placeholder="'请选择清洗机'" :dataList="machineList" :lable="'name'"></selectComponent>
					</view>
					<view class="flexcenter showtime" style="flex:1;" @click.stop="onShowDatePicker">
						<text>{{selectTime}}</text>
						<img  src="../../static/img/i-down1.png" class="image-down" alt="">
					</view>
				</view>
				<view class="same potnum">
					<input class="uni-input" type="number" v-model="numgc" @input="onnumgcchange($event)" placeholder="请录入锅次" />
					<!-- <input class="uni-input" type="number" v-model="numgc" @input="onnumgcchange($event)" placeholder="请录入锅次" /> -->
				</view>
				<mx-datepicker v-model="showPicker" :init="selectTime" type="date" @selected="onSelected" />

				<scroll-view scroll-y="true" class="home-content" :style="{'height':homeHeight+'px'}" @scrolltolower="scrolltoBottom">
					<view v-for="(item,index) in washresultList" :key="index" @click.stop="navigatestate(item,index)">
					   <washresultListItem :item="item"></washresultListItem>
					</view>
					<loadingMoreComponent v-if="washresultList.length" :loadingType="loadingType"></loadingMoreComponent>
				</scroll-view>
			</view>
			
		</template>
	</maincomponent>
</template>
<script>

	import maincomponent from '../../components/maincontent/maincontent.vue';
	import navbarComponent from "../../components/nav-bar/nav-bar.vue";
	import loginInformationComponent from "../../components/login-information/login-information.vue";

	import loadingMoreComponent from "../../components/base/uni-load-more.vue";
	import washresultListItem from "../../components/wash/wash-result-item.vue";
	import MxDatepicker from "../../components/uni-ui/mx-datepicker/mx-datepicker.vue";
	import selectComponent from "../../components/base/search-select.vue";

	// import mInput from "../../components/uni-ui/m-input/m-input.vue";
	

	import {
		mapGetters,
		mapMutations
	} from "vuex";


	import {
		resultMachines,getwashresults,getSystemTime,getMachineDetail
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
			washresultListItem,
			MxDatepicker,
			selectComponent

		},
		data() {
			return {
				selectTime:formatDate(new Date(),"yyyy-MM-dd"),
				showPicker:false,
				machineList:[],
				loadingType:2,
				page:1,
				pageSize:20,
				showDialog:false,
				washresultList:[],
				homeHeight:'100', 
				devId:'',
				numgc:'',
				machineSelect:false
			}
		},
		computed: {
			...mapGetters(["loginForm"])
		},
		onLoad() {
		       this.resultMachines();
			  this.getsystime();
			  this.$bus.on('refreshwashresult',this.getwashresults);
		},

		methods: {
			  navigatestate(item,index){
				  console.log(JSON.stringify(item));
						 this.set_activeMachine(JSON.parse(JSON.stringify(item)));
						 this.getMachineDetail(item);			      
			},
			navigate(item){
				  switch(item.result_name){
					case "待检定":uni.navigateTo({url:'/pages/washcheck/washcheck?id=washresult'});break;
				 }
			},
			getMachineDetail(item){
				this.$loading();
				const data={"Qx":{"d_gc":item.d_gc,"dev_id":item.dev_id,"dev_name":item.dev_name,"t_gc":item.t_gc},"LoginForm":this.loginForm};
				getMachineDetail(data).then(res=>{
					this.$loading(false);
					this.setdetailList(res.returnValue.qxDtlList);
					this.navigate(item);
					console.log(res,'detail');
				})
			},	
				closeAllselect(){
	
				this.machineSelect=false;
			
			},
			showSelect(name){
			    if(name!="machineSelect"){
					this.machineSelect=false;
				}
			
			    setTimeout(()=>{
					this[name]=!this[name];
				},20)
				
			},
			getsystime(){
				const data={"LoginForm":this.loginForm};
				getSystemTime(data).then(res=>{
					if(res.errorCode == "0"){
						this.selectTime=res.returnValue.ServerInfo.systemtime.substring(0,11);
						this.getwashresults();
					}
					
				})
			},
			onnumgcchange(e){
				this.numgc=e.target.value;
				this.getwashresults();
			},
			onChoosemachine(item){
				this.machineSelect=false;	
				this.devId=item?item.id:'';
				this.getwashresults();
			},
			resultMachines(){
				const data={"Sbxx":{"did":this.loginForm.deptId,"is_inv":"1","sb_type":"1~2~9"},"LoginForm":this.loginForm};
				resultMachines(data).then(res=>{
					if(res.errorCode == "0"){
						this.machineList=res.returnValue.SbxxList;
						console.log(res,"清洗机列表");
					}
				})
			},
			getwashresults(){
				const data={"Qx":{"d_gc":this.numgc,"dev_id":this.devId,"start_dt":this.selectTime+" 00:00:00"},"LoginForm":this.loginForm};
				console.log(data);
				getwashresults(data).then(res=>{
					this.washresultList=res.returnValue.qxResultList;
					if(!res.returnValue.qxResultList.length){
						this.toast('未查询到相关记录!');
					}
					console.log(res,"清洗结果列表");
				})
			},
			onSelected(e){
				let year=e.year;
				let month=Number(e.month)<10?("0"+e.month):e.month;
				let date=Number(e.date)<10?("0"+e.date):e.date;
				this.selectTime=year+"-"+month+"-"+date;
				this.getwashresults();
			},
			onShowDatePicker(){//显示
                this.showPicker = true;
				console.log('11');
            },
		
		    onChooseState(){
				
			},
			scrolltoBottom(){
				this.page++;
			    this.loadingType=2;
				// this.getToreclaim();
				 console.log("loading more");
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

			},
			...mapMutations(['setdetailList','set_activeMachine']),
		

		},
		onReady() {
		   this.setDomHeight();
		
			
		}
	}
</script>

<style lang="scss">
	@import "../../common/global.scss";

	/* #ifdef APP-PLUS */
	.wash-content {
		width:100%;
		position:absolute;
		top:var(--status-bar-height);
		left:0;
		overflow-y: hidden;
		height: calc(100vh - var(--status-bar-height));
	}

	/*  #endif  */
	/* #ifdef H5 */
	.wash-content {
		width:100%;
		position:absolute;
		top:0;
		left:0;
		overflow-y: hidden;
		height: 100vh;
	}
	
	/*  #endif  */
	.wash-content {	
		display: flex;
		flex-direction: column;
		.showtime{
			width:50%;
			font-size: 35upx;
			color: #666666;
			// min-width:310upx;
		}
		.same {
			padding: 20upx 30upx;
			font-size: 35upx;
			flex: none;
		}
		.potnum{
			border-bottom:1upx solid $bordercolor; 
		}
		.home-content {
			flex: 1;
		}
		.select-state{
			display:flex;
			align-items: center;
			border-bottom:1upx solid $bordercolor;
			.image-down{
				flex:none;
				width:30upx;
				height:15upx;
				margin-left:10upx;
			}
			.chose{
				    margin-left:10upx;
					font-size: 35upx;
			}
		}

		.wash-header {
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
