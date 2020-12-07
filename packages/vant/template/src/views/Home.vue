<template>
	<div class="home">
		<template v-if="linkedList.length > 0">
			<van-nav-bar title="其他平台设备" right-text="添加" left-arrow @click-right="addPlatform" />
			<div class="list hideScrollBar">
				<van-cell-group>
					<van-cell v-for="(v,i) in linkedList" class="textL" is-link to="DeviceList" :key="i">
						<template #title>
							<img :src="v.imgpath" class="list-img marR4"/>
							<span class="font12">{{v.name}}</span>
						</template>
					</van-cell>
				</van-cell-group>
			</div>
		</template>
		<template v-else>
			<van-nav-bar title="其他平台设备" left-arrow />
			<div class="color888 center">
				<img class="image" src="../assets/device.png" />
				<p class="font16">当前未添加任何其他平台设备</p>
			</div>
			<div class="footer">
				<div class="color888 marB8 font16">其他平台设备均由第三方服务商提供支持</div>
				<van-button type="primary" size="large" class="backAzure" round @click="addPlatform">点击添加</van-button>
			</div>
		</template>
	</div>
</template>

<script>
// @ is an alias to /src
import { NavBar, Button, Cell, CellGroup } from "vant";
export default {
	name: "Home",
	components: {
		[NavBar.name]: NavBar,
		[Button.name]: Button,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup
	},
	data() {
		return {
			linkedList: [
				{
					name: "平台1",
					imgpath: "/3list/1.png"
				},
				{
					name: "平台2",
					imgpath: "/3list/1.png"
				}
			]
		};
	},
	methods: {
		addPlatform(): void {
			this.$router.push({
				name: "PlatformList"
			});
		}
	}
};
</script>

<style scoped lang="less">
.home {
	height: 100%;
	background-color: #f6f6f6;
	display: flex;
	flex-direction: column;
	.center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-bottom: 106px;
		.image {
			width: 100px;
			height: 100px;
		}
	}

	.footer {
		position: absolute;
		bottom: 20px;
		left: 20px;
		right: 20px;
	}

	.list {
		overflow: scroll;
		flex: 1;
		.list-img {
			width: 20px;
			height: 20px;
			vertical-align: middle;
		}
	}
}
</style>
