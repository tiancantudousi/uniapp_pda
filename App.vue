<script>

    export default {
		onUniNViewMessage:function(e){
        
// 		 if(e.data.key=="onScanBarCode"){
// 			   this.$bus.emit('onBarCode',e.data.value);		
// 		 }
// 		 
// 		 if(e.data.key=="loginform"){
// 			 this.$store.commit("setLoginForm", e.data.value);
// 			 
// 		 }
// 		 if(e.data.key=="deptlist"){
// 			 uni.setStorageSync('deptlist', e.data.value);
// 		 }
		 
		 
		  if(e.data.key=="exit"){
		 	 plus.runtime.quit()
		 }
		 if(e.data.key=="refreshoutsourcing"){
			 console.log('refreshoutsourcing');
			  var pages = getCurrentPages();
                var page = pages[pages.length - 2];
                var currentWebview = page.$getAppWebview();
                plus.webview.postMessageToUniNView({
                    key: "fresh"
                }, currentWebview.id);
		 }
		  if(e.data.key=="sterilizationmachine"){
		 			  
		 		var pages = getCurrentPages();
		        var page = pages[pages.length - 2];
		        var currentWebview = page.$getAppWebview();
		        plus.webview.postMessageToUniNView({
		 					key:'sterilizationmachine',
		            value: e.data.value
		        }, currentWebview.id);
		 }
		 
		 if(e.data.key=="updatesterilizationmachine"){
		 			  
		 		var pages = getCurrentPages();
		        var page = pages[pages.length - 3];
		        var currentWebview = page.$getAppWebview();
		        plus.webview.postMessageToUniNView({
		 					key:'sterilizationmachine',
		            value: e.data.value
		        }, currentWebview.id);
		 }
		 
		 if(e.data.key=="washmachine"){
			    console.log('app refreshmachine');
		 		var pages = getCurrentPages();
		        var page = pages[pages.length - 2];
		        var currentWebview = page.$getAppWebview();
		        plus.webview.postMessageToUniNView({
					key:'washmachine',
		            value: e.data.value
		        }, currentWebview.id);
		 }
		 if(e.data.key=="updatewashmachine"){
		 			    console.log('app refreshmachine');
		 		var pages = getCurrentPages();
		        var page = pages[pages.length - 3];
		        var currentWebview = page.$getAppWebview();
		        plus.webview.postMessageToUniNView({
		 					key:'washmachine',
		            value: e.data.value
		        }, currentWebview.id);
		 }
		  if(e.data.key=="freshwashresult"){
		 		var pages = getCurrentPages();
		        var page = pages[pages.length - 2];
		        var currentWebview = page.$getAppWebview();
		        plus.webview.postMessageToUniNView({
		 			key:'freshwashresult',
		            value: e.data.value
		        }, currentWebview.id);
		 }
		 if(e.data.key=="freshsterilizationresult"){
		 		var pages = getCurrentPages();
		        var page = pages[pages.length - 2];
		        var currentWebview = page.$getAppWebview();
		        plus.webview.postMessageToUniNView({
		 			key:'freshsterilizationresult',
		            value: e.data.value
		        }, currentWebview.id);
		 }
		if(e.data.key=="downloadapp"){
		 	download(e.data.value);
		 }
		 
		 
		 
		 
		},
        onLaunch: function() {
            console.log('App Launch');
        },
		onError(err){
			console.log(err);
		},
        onShow: function() {
            console.log('App Show');
        },
        onHide: function() {
            console.log('App Hide');
        }
    }
	function download(value){
		uni.getStorage({
			key: 'endIp',
			success: function(res) {
								var dtask = plus.downloader.createDownload(
					`http://${res.data}/${value.returnValue.UpdateFileList[0].downloadpath}`, {},
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
							// weexpost('http://' + res.data + '/ylzlzz/soa?',qs.stringify(data),resolve,reject);
			},
			fail:function(e){
				console.log('fial ip')
				resolve('ip error');
			}
		});
	}
	
	
</script>

<style>
    /*每个页面公共css */
    /* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
    body,
    page {
        min-height: 100%;
        display: flex;
		font-family: PingFangSC-Regular;
    }
	*{
		box-sizing: border-box;
		margin:0;
		padding:0;
	}
	.flexcenter{
		display:flex;
		align-items: center;
		justify-content: center;
	}
	.flexaround{
		display:flex;
		align-items: center;
		justify-content: space-between;
	}
	.border-bottom{
		border-bottom:1upx solid #E5E5E5;
	}
	.absolutecenter{
	   position:absolute;
	   top:0;
	   left:0;
	   right:0;
	   bottom:0;
	}
	.uni-sample-toast{
		z-index:20000!important;
	}

    /* #ifdef MP-BAIDU */
    page {
        width: 100%;
        height: 100%;
        display: block;
    }

    swan-template {
        width: 100%;
        min-height: 100%;
        display: flex;
    }


    /* #endif */

/*    .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        background-color: #efeff4;
        padding: 20upx;
    }

    .input-group {
        background-color: #ffffff;
        margin-top: 40upx;
        position: relative;
    }

    .input-group::before {
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        height: 1upx;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #c8c7cc;
    }

    .input-group::after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 1upx;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #c8c7cc;
    }

    .input-row {
        display: flex;
        flex-direction: row;
        position: relative;
    }

    .input-row .title {
        width: 20%;
        height: 50upx;
        min-height: 50upx;
        padding: 15upx 0;
        padding-left: 30upx;
        line-height: 50upx;
    }

    .input-row.border::after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 15upx;
        height: 1upx;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #c8c7cc;
    }

    .btn-row {
        margin-top: 50upx;
        padding: 20upx;
    } */

    button.primary {
        background-color: #0faeff;
    }
</style>
