//非weex请求
// export function requestwashFormat(service, mehtod, data) {
// 	return {
// 		"clientip": "",
// 		'sysid': 'android',
// 		'sign': 'DA944624C718CAA806A5E5555D78ED9B',
// 		"specialcode": "",
// 		"ssoid": "",
// 		'timestamp': fromDate(true),
// 		'req': {
// 			'service': service,
// 			'method': mehtod,
// 			'args': data,
// 			"currentip": ""
// 		},
// 		"v": "1.0"
// 	};
// }
//非weex请求
//weex请求
export function requestwashFormat(service, mehtod, data) {
	let jsondata={
			'service': service,
			'method': mehtod,
			'args': data,
			"currentip": ""
		};
	let temp={
		"posttype":'url',
		"clientip": "",
		'sysid': 'android',
		'sign': 'DA944624C718CAA806A5E5555D78ED9B',
		"specialcode": "",
		"ssoid": "",
		'timestamp': fromDate(true),
		'req':JSON.stringify(jsondata),
		"v": "1.0"
	};
	return temp;
}
//weex请求


export function requestwashFormatnvue(service, mehtod, data) {
	let jsondata={
			'service': service,
			'method': mehtod,
			'args': data,
			"currentip": ""
		};
	let temp={
		"posttype":'url',
		"clientip": "",
		'sysid': 'android',
		'sign': 'DA944624C718CAA806A5E5555D78ED9B',
		"specialcode": "",
		"ssoid": "",
		'timestamp': fromDate(true),
		'req':JSON.stringify(jsondata),
		"v": "1.0"
	};
	return temp;
}

export function fromDate(isFull = false) {
	const today = new Date();
	const year = today.getFullYear();
	let month = '' + (today.getMonth() + 1);
	let day = '' + today.getDate();
	let hours = '' + today.getHours();
	let mints = '' + today.getMinutes();
	let sec = '' + today.getSeconds();

	month.length < 2 ? month = '0' + month : month = month;
	day.length < 2 ? day = '0' + day : day = day;
	hours.length < 2 ? hours = '0' + hours : hours = hours;
	mints.length < 2 ? mints = '0' + mints : mints = mints;
	sec.length < 2 ? sec = '0' + sec : sec = sec;
	if (isFull) {
		return year + '-' + month + '-' + day + ' ' + hours + ':' + mints + ':' + sec;
	}
	return year + '-' + month + '-' + day;
}

export function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	}
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + ''
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
		}
	}
	return fmt
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length)
}

 function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
export function guid() {
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
