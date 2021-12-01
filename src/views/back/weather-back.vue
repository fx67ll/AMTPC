<template>
	<!-- 废弃页面，因为不知道心知天气免费版用户要用v3的接口，导致v4的接口研究了半天没啥用，代码不舍得删放在这里备份 -->
	<div></div>
</template>

<script>
	// 心知天气签名生成工具类
	import url from "url";
	import querystring from "querystring";
	import crypto from "crypto";
	export default {
		methods: {
			// 获取天气数据 https://seniverse.yuque.com/books/share/f4f9bf1a-d3d9-4a68-8996-950f8c88400e/precip_minutely
			getWeather(locations) {
				let self = this;
				let url = 'https://api.seniverse.com/v4?fields=precip_minutely';
				// 公钥，控制台地址 https://www.seniverse.com/products?iid=08aebdde-e9d9-4708-8562-c42f843a37f4
				const publickey = "P3Xw07TicMFBn3kNa";
				// 获取时间戳 https://github.com/seniverse/seniverse-api-v4-demos/edit/main/nodejs/index.js
				const ts = Math.round(Date.now() / 1000);
				// 设置签名过期时间
				const ttl = 3600;
				// 查询参数必须严格按字典升序
				// a、b、c、d、e、f、g、h、i、j、k、l、m、n、o、p、q、r、s、t、u、v、w、x、y、z
				const query = this.getSignStr(url, {
					locations: locations,
					public_key: publickey,
					ts,
					ttl
				});
				// v4用不了已经去除请求地址了，原地址是 https://api.seniverse.com/v4
				// axios.get(`${process.env.VUE_APP_WEATHER_API}?${query}`).then(response => (console.log(response)));
			},
			// 获取当前浏览器的经纬度 https://www.cnblogs.com/lnn-713/p/5364725.html
			getPosition() {
				let self = this;
				let positionPromise = new Promise(function(resolve, reject) {
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(
							function(position) {
								resolve(position.coords.longitude + ":" + position.coords.latitude);
							},
							function(error) {
								reject(error.code + "\n" + error.message);
							}
						);
					} else {
						console.log("异常！您当前浏览器不支持或者你取消了获取当前位置信息！");
					}
				});
				positionPromise.then(function(value) {
					self.getWeather(value);
				});
			},
			// 心知天气签名加密获取，签名结果验证 https://seniverse.yuque.com/books/share/f4f9bf1a-d3d9-4a68-8996-950f8c88400e/nke5p8
			getSignStr(urlString, paramsObj) {
				// 私钥，控制台地址 https://www.seniverse.com/products?iid=08aebdde-e9d9-4708-8562-c42f843a37f4
				// 因为自己写着玩所以在js中直接写入明文的密钥了，开发环境中切勿这样使用
				const secretkey = "S3l3hrhH1v1_GG88W";
				if (!urlString) {
					return;
				}
				const obj = url.parse(urlString, true, true);
				const params = Object.assign({}, obj.query, paramsObj);
				let result = querystring.stringify(params);
				const sig = crypto
					.createHmac('sha1', secretkey)
					.update(result, 'utf8')
					.digest('base64');
				console.log(sig);
				console.log(encodeURIComponent(encodeURIComponent));
				result += `&sig=${encodeURIComponent(sig)}`;
				return result;
			},
		}
	}
</script>

<style>
</style>
