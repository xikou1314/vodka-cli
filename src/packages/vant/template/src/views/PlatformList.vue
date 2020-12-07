<template>
	<div class="container">
		<van-nav-bar title="绑定账号" left-arrow @click-left="back" />
		<div class="list hideScrollBar" v-show="list.length > 0">
			<van-cell-group>
				<template v-for="(v,i) in list">
					<van-cell v-if="!v.linked" class="textL" is-link to="PlatformDetail" :key="i">
						<template #title>
							<img :src="v.imgpath" class="list-img marR4"/>
							<span class="font12">{{v.name}}</span>
						</template>
					</van-cell>
					<van-cell v-else class="textL" value="已绑定" :key="i">
						<template #title>
							<img :src="v.imgpath" class="list-img marR4"/>
							<span class="font12">{{v.name}}</span>
						</template>
					</van-cell>
				</template>
			</van-cell-group>
		</div>
		<van-empty image="error" description="暂无其他平台可添加" v-show="list.length === 0" />
	</div>
</template>

<script>
// @ is an alias to /src
import { NavBar, Cell, CellGroup, Empty } from "vant";
export default {
	name: "PlatformList",
	components: {
		[NavBar.name]: NavBar,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[Empty.name]: Empty
	},
	data() {
		return {
			list: [
				{
					name: "平台1",
					imgpath: "/3list/1.png",
					linked: true
				},
				{
					name: "平台2",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台3",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台4",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台5",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台6",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台7",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台8",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台9",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台10",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台11",
					imgpath: "/3list/1.png",
					linked: false
				},
				{
					name: "平台12",
					imgpath: "/3list/1.png",
					linked: false
				}
			]
		};
	},
	methods: {
		back(): void {
			this.$router.go(-1);
		}
	}
};
</script>

<style scoped lang="less">
.container {
	height: 100%;
	background-color: #f6f6f6;
	display: flex;
	flex-direction: column;
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
