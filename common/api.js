import {post} from "./http.js";
import {requestwashFormat,requestwashFormatnvue} from "./tool.js";

export function publicSelect(data){ //下拉框
	let method="getAa10ListForMobile";
	let service="ParamService";
	return post(requestwashFormat(service, method, data));
}
export function getcompositedetail(data){ //下拉框
	let method="getDbtjDtl";
	let service="CxtjService";
	return post(requestwashFormat(service, method, data));
}
export function getpackdetail(data){ //下拉框
	let method="getPbtjDtl";
	let service="CxtjService";
	return post(requestwashFormat(service, method, data));
}

export function washwaste(data){ //下拉框
	let method="invQx";
	let service="QxService";
	return post(requestwashFormat(service, method, data));
}


// 清洗修改完成删掉此api
// export function getWashList(data){//清洗列表
// 	let method="getAllQxjState";
// 	let service="QxService";
// 	return post(requestwashFormat(service, method, data));
// }
// export function getMachineDetail(data){//清洗机内容
// 	let method="getQxDtlList";
// 	let service="QxService";
// 	return post(requestwashFormat(service, method, data));
// }
// export function updatesignMachine(data){//获取单个清洗机
// 	let method="getAllQxjState";
// 	let service="QxService";
// 	return post(requestwashFormat(service, method, data));
// }
// export function getMachines(data){//获取清洗机
// 	let method="getSbxxListForMobile";
// 	let service="SbxxService";
// 	return post(requestwashFormat(service, method, data));
// }

// 清洗修改完成删掉此api

// 清洗修改完成添加此api
export function getWashList(data){//清洗列表
	let method="getAllQxjState";
	let service="QxService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getMachineDetail(data){//清洗机内容
	let method="getQxDtlList";
	let service="QxService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function updatesignMachine(data){//获取单个清洗机
	let method="getAllQxjState";
	let service="QxService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getMachines(data){//获取清洗机
	let method="getSbxxListForMobile";
	let service="SbxxService";
	return post(requestwashFormatnvue(service, method, data),true);
}

// 清洗修改完成添加此api




export function publicSelectnvue(data){ //下拉框
	let method="getAa10ListForMobile";
	let service="ParamService";
	return post(requestwashFormatnvue(service, method, data),true);
}

export function login(data){
	let method="loginIn";
	let service="EmurService";
	return post(requestwashFormatnvue( service, method, data),true);
}
	
export function getDepts(data){
	let method="getDepartmentList";
	let service="DepartmentService";
	return post(requestwashFormatnvue( service, method, data),true);
}
export function getPower(data){//获取home页面的权限
	let method="getUserMetaList";
	let service="PermissionService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function checkversion(data){//获取回收统计
	let method="getUpdateFiles";
	let service="UpdateService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getToreclaim(data){//获取待回收列表
	let method=data.method;
	let service="HsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function reclaimByList(data){//批量回收
	let method="doHsBatch";
	let service="HsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function doreclaim(data){//enter回收
	let method="addHsLog";
	let service="HsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function cancleRecliam(data){//撤销回收
	let method="revokeHs";
	let service="HsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function doreclaimSpecial(data){//特殊包回收
	let method="addHsLog";
	let service="HsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getdownPerson(data){//获取home页面的权限
	let method="getOneUserinfo";
	let service="UserinfoService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getTocensus(data){//获取回收统计
	let method="getHstjList";
	let service="CxtjService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getfailureresons(data){//获取回收统计
	let method="getTmsxyyList";
	let service="TmsxService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function startfailure(data){//获取回收统计
	let method="doTmsx";
	let service="TmsxService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function canclefailure(data){
	let method="revTmsx";
	let service="TmsxService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getreadDetail(data){
	let method="getBnrbyBidorTmid";
	let service="TmxxService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function lossregisterstore(data){
	let method="addSh";
	let service="ShService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getoutperson(data){
	let method="getBrxx";
	let service="SyService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function outsourcingsearch(data){
	let method="getWlbList";
	let service="WlbService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getsendperson(data){
	let method="getWlbShr";
	let service="WlbService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getuserInfor(data){
	let method="getOneUserinfo";
	let service="UserinfoService";
	return post(requestwashFormatnvue(service, method, data),true);
}









// export function getToreclaim(data){//获取待回收列表
// 	let method=data.method;
// 	let service="HsService";
// 	return post(requestwashFormat(service, method, data));
// }
// export function checkversion(data){//获取回收统计
// 	let method="getUpdateFiles";
// 	let service="UpdateService";
// 	return post(requestwashFormat(service, method, data));
// }
// export function login(data){
// 	let method="loginIn";
// 	let service="EmurService";
// 	return post(requestwashFormat(service, method, data));
// }
	
// export function getDepts(data){
// 	let method="getDepartmentList";
// 	let service="DepartmentService";
// 	return post(requestwashFormat(service, method, data));
// }



// export function getPower(data){//获取home页面的权限
// 	let method="getUserMetaList";
// 	let service="PermissionService";
// 	return post(requestwashFormat(service, method, data));
// }
export function getbuilds(data){//获取home页面的权限
	let method="getAllDlxx";
	let service="KslcService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getfloors(data){//获取home页面的权限
	let method="getLcxx";
	let service="KslcService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getdeptbyfloor(data){//获取home页面的权限
	let method="getKsxx";
	let service="KslcService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getmaterial(data){//获取材料信息
	let method="getBnrbyBidorTmid";
	let service="TmxxService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getTodayReclaim(data){//撤销回收
	let method="getTmxxListForHsToday";
	let service="HsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function searchPacknvue(data){//
	let method="getBpzListForMobile";
	let service="BpzService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getlosstypes(data){//
	let method="getAa10ListForMobile";
	let service="ParamService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getmaterialByBid(data){//
	let method="getClAll";
	let service="ClService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getquerylist(data){//
	let method="getShList";
	let service="ShService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getquerydetail(data){//
	let method="getShDtlList";
	let service="ShService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getTmxx(data){//
	let method="getTmxx";
	let service="TmxxService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getSystemTimenvue(data){//获取系统时间
	let method="getServerInfo";
	let service="EmurService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function gettobeacept(data){//获取系统时间
	let method="getJsTmList";
	let service="JsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function doacept(data){//获取系统时间
	let method="doJs";
	let service="JsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function cancleAcept(data){//获取系统时间
	let method="revokeJs";
	let service="JsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function aceptAll(data){//获取系统时间
	let method="doJsBatch";
	let service="JsService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getaceptcencus(data){//获取系统时间
	let method="getJstjList";
	let service="CxtjService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getcencusdetail(data){//获取系统时间
	let method="getJstjDtl";
	let service="CxtjService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getpatient(data){//获取系统时间
	let method="getBrxx";
	let service="SyService";
	return post(requestwashFormatnvue(service, method, data),true);
}

export function patientuse(data){//获取系统时间
	let method="doSy";
	let service="SyService";
	return post(requestwashFormatnvue(service, method, data),true);
}

export function cancleuse(data){//获取系统时间
	let method="revokeSy";
	let service="SyService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getUsecensus(data){//获取系统时间
	let method="getSytjList";
	let service="CxtjService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getusecencusdetail(data){//获取系统时间
	let method="getSytjDtl";
	let service="CxtjService";
	return post(requestwashFormatnvue(service, method, data),true);
}




export function getshippers(data){//获取单个清洗机
	let method="getSccj";
	let service="SccjService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function outsourcingstore(data){//获取单个清洗机
	let method="addWlb";
	let service="WlbService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getwlbList(data){//获取单个清洗机
	let method="getWlbDtlList";
	let service="WlbService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function wlbwaste(data){//获取单个清洗机
	let method="modWlb";
	let service="WlbService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function dorevert(data){//获取单个清洗机
	let method="doWlbGh";
	let service="WlbService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getrevertperson(data){//获取单个清洗机
	let method="getWlbDzr";
	let service="WlbService";
	return post(requestwashFormatnvue(service, method, data),true);
}
export function getrevertpackList(data){//获取单个清洗机
	let method="getWlbghList";
	let service="WlbService";
	return post(requestwashFormatnvue(service, method, data),true);
}






































export function getSystemTime(data){//获取系统时间
	let method="getServerInfo";
	let service="EmurService";
	return post(requestwashFormat(service, method, data));
}

export function searchPack(data){//
	let method="getBpzListForMobile";
	let service="BpzService";
	return post(requestwashFormat(service, method, data));
}
export function addpack(data){//添加包
	let method="addQxDtl";
	let service="QxService";
	return post(requestwashFormat(service, method, data));
}
export function startwash(data){//添加包
	let method="startQx";
	let service="QxService";
	return post(requestwashFormat(service, method, data));
}
export function update(data){//清洗中修改
	let method="modQx";
	let service="QxService";
	return post(requestwashFormat(service, method, data));
}

export function unquality(data){//不合格检定
	let method="addQxResult";
	let service="QxService";
	return post(requestwashFormat(service, method, data));
}
export function potChange(data){//换锅
	let method="chgQx";
	let service="QxService";
	return post(requestwashFormat(service, method, data));
}
export function resultMachines(data){//清洗机列表
	let method="getSbxxListForMobile";
	let service="SbxxService";
	return post(requestwashFormat(service, method, data));
}
export function getwashresults(data){//清洗机列表
	let method="getQxResultList";
	let service="QxService";
	return post(requestwashFormat(service, method, data));
}

export function getpersonlist(data){//获取回收统计
	let method="getUserinfoList";
	let service="UserinfoService";
	return post(requestwashFormat(service, method, data));
}
export function getwashcensusList(data){//获取回收统计
	let method="getQxtjList";
	let service="CxtjService";
	return post(requestwashFormat(service, method, data));
}
export function getforeignList(data){//获取回收统计
	let method=data.method;
	let service="QxService";
	return post(requestwashFormat(service, method, data));
}
export function changewash(data){//获取回收统计
	let method="addQxDtlForSpecial";
	let service="QxService";
	return post(requestwashFormat(service, method, data));
}
export function dopack(data){//获取回收统计
	let method="doPb";
	let service="PbService";
	return post(requestwashFormat(service, method, data));
}
export function canclepack(data){//获取回收统计
	let method="revPb";
	let service="PbService";
	return post(requestwashFormat(service, method, data));
}
export function getpackcensuscensusList(data){//获取回收统计
	let method="getPbtjList";
	let service="CxtjService";
	return post(requestwashFormat(service, method, data));
}

export function docomposite(data){//复核
	let method="doDb";
	let service="DbService";
	return post(requestwashFormat(service, method, data));
}
export function canclecomposite(data){//获取回收统计
	let method="revDb";
	let service="DbService";
	return post(requestwashFormat(service, method, data));
}
export function getcomposiecensus(data){//获取回收统计
	let method="getDbtjList";
	let service="CxtjService";
	return post(requestwashFormat(service, method, data));
}
//灭菌模块
export function getsignsterilization(data){//获取单个灭菌机
	let method="getSbxxListForMobile";
	let service="SbxxService";
	return post(requestwashFormat(service, method, data));
}

export function getsterilizationdataList(data){//获取所有灭菌机
	let method="getAllMjjState";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}

export function getsterilizationList(data){//获取所有灭菌机
	let method="getSbxxListForMobile";
	let service="SbxxService";
	return post(requestwashFormat(service, method, data));
}

export function getDetailsterilization(data){//获取单个灭菌机
	let method="getAllMjjState";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}
export function getsterilizationpacklist(data){//获取灭菌机包信息
	let method="getMjDtlList";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}
export function inputbarcode(data){//灭菌机录入条码
	let method="addMjDtl";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}
export function docancletmid(data){//灭菌机录入条码
	let method="revokeMj";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}
export function startsterilization(data){//灭菌机录入条码
	let method="startMj";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}
export function canclesterilization(data){//灭菌机录入条码
	let method="invMj";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}

export function updatesterilization(data){//灭菌机录入条码
	let method="modMj";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}
export function sterilizationcheck(data){//灭菌机录入条码
	let method="addMjResult";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}

export function sterilizationchangepan(data){//换锅
	let method="chgMj";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}
export function getsterilizationcensusList(data){//灭菌统计
	let method="getMjtjList";
	let service="CxtjService";
	return post(requestwashFormat(service, method, data));
}
export function getsterilizationresulList(data){//灭菌统计
	let method="getMjResultList";
	let service="MjService";
	return post(requestwashFormat(service, method, data));
}
export function getTogrounding(data){//灭菌统计
	let method="getTmxxForCc";
	let service="CcService";
	return post(requestwashFormat(service, method, data));
}

export function getshelves(data){//灭菌统计
	let method="getJZ";
	let service="JzService";
	return post(requestwashFormat(service, method, data));
}

export function suregrounding(data){//灭菌统计
	let method="doCcBatch";
	let service="CcService";
	return post(requestwashFormat(service, method, data));
}
export function dogrounding(data){//灭菌统计
	let method="doCc";
	let service="CcService";
	return post(requestwashFormat(service, method, data));
}
export function cancleGrounding(data){//灭菌统计
	let method="revCc";
	let service="CcService";
	return post(requestwashFormat(service, method, data));
}
export function getshelvespack(data){//灭菌统计
	let method="getTmxxForCcHj";
	let service="CcService";
	return post(requestwashFormat(service, method, data));
}
export function surechangeshelves(data){//灭菌统计
	let method="modCcBatch";
	let service="CcService";
	return post(requestwashFormat(service, method, data));
}
export function dochangeshelves(data){//灭菌统计
	let method="modCc";
	let service="CcService";
	return post(requestwashFormat(service, method, data));
}
export function groundingcencus(data){//灭菌统计
	let method="getCctjListPda";
	let service="CxtjService";
	return post(requestwashFormat(service, method, data));
}
export function getprovideList(data){//灭菌统计
	let method="getFfinfo";
	let service="FfService";
	return post(requestwashFormat(service, method, data));
}
export function getprovideDetail(data){//灭菌统计
	let method="getFfinfoByslid";
	let service="FfService";
	return post(requestwashFormat(service, method, data));
}
export function providepass(data){//灭菌统计
	let method="doSlFfBySlid";
	let service="FfService";
	return post(requestwashFormat(service, method, data));
}
export function cancleff(data){//灭菌统计
	let method="revFf";
	let service="FfService";
	return post(requestwashFormat(service, method, data));
}
export function getdirectprovideList(data){//灭菌统计
	let method="getZjFfinfo";
	let service="FfService";
	return post(requestwashFormat(service, method, data));
}
export function directprovide(data){//灭菌统计
	let method="doZjFf";
	let service="FfService";
	return post(requestwashFormat(service, method, data));
}
export function getprovidecensus(data){//灭菌统计
	let method="getFftjList";
	let service="CxtjService";
	return post(requestwashFormat(service, method, data));
}
export function getprovideitemdetail(data){//灭菌统计
	let method="getFftjDtl";
	let service="CxtjService";
	return post(requestwashFormat(service, method, data));
}






















































