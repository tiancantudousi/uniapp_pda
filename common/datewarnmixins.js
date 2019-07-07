export const datewarnmixins={
	methods:{
		warningdate(time){
				    var oDate1 = new Date(time.start.trim());
					var oDate2 = new Date(time.end.trim());
					if(oDate1.getTime() > oDate2.getTime()){
						return true;
					} else {
						return false
					}
		}
	}
}

