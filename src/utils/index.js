export function getUrlQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	// 获取url中"?"符后的字符串并正则匹配
	var r = window.location.search.substr(1).match(reg);
	var context = '';
	if (r != null) context = decodeURIComponent(r[2]);
	reg = null;
	r = null;
	return context == null || context == '' || context == 'undefined' ? '' : context;
};
