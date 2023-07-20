<template>
	<div>
		<fx67ll-random-mosaic-avatar v-if="showType==='default'" />
		<fx67ll-random-mosaic-avatar v-if="showType==='geturl'" :isAllowRefresh="true"
			@avatarUrlChange="getAvatarUrl" />
		<fx67ll-random-mosaic-avatar v-if="showType==='custome'" :avatarSize="300" :isNeedRandom="false"
			:avatarNum="404" avatarType="svg" :avatarPadding="0.1" :avatarColor="[0, 0, 0, 255]"
			:avatarBgColor="[255, 255, 255, 255]" />
	</div>
</template>

<script>
	import {
		getUrlQueryString
	} from '@u/index.js'
	export default {
		name: 'fx67llVueUIAvatar',
		data() {
			return {
				showType: 'dafault'
			};
		},
		mounted() {
			this.showType = getUrlQueryString('showType') || 'dafault';
		},
		methods: {
			getAvatarUrl(url) {
				console.log('avatarUrl: ' + url);
			}
		}
	};
</script>

<style>
</style>