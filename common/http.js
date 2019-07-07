
import qs from 'qs';
export function post(data,type) {
	return new Promise((resolve, reject) => {
		uni.getStorage({
			key: 'endIp',
			success: function(res) {
							weexpost('http://' + res.data + '/ylzlzz/soa?',qs.stringify(data),resolve,reject);
			},
			fail:function(e){
				console.log('fial ip')
				resolve('ip error');
			}
		});

	})

}

function weexpost(url,postBody,resolve,reject){
	var stream = weex.requireModule('stream');
	stream.fetch({
	    method: 'POST',
	    url: url,
	    body: postBody,
	    timeout:'500000',
// 		header: {
// 			'content-type': 'application/x-www-form-urlencoded',
// 		},
	}, function(ret) {
	    if(!ret.ok){
		console.log(ret);
		    reject(null);
			var modal = weex.requireModule('modal');
			modal.toast({
				message: '网络连接失败',
				duration: 0.3
			})
		
		
	        console.log('post request failed');
	    }else{
			   resolve(JSON.parse(ret.data));
	    }
	});
}


