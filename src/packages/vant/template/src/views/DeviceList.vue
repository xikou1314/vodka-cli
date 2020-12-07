<template>
	<div class="container">
		<van-nav-bar title="小狗RX3" left-arrow @click-left="back" />
		<div class="list hideScrollBar" v-show="list.length > 0">
			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
				<van-cell-group>
					<van-cell v-for="(v,i) in list" class="textL" is-link to="PlatformDetail" :key="i">
						<template #title>
							<img :src="v.imgpath" class="list-img marR4" />
							<span class="font12">{{v.name}}</span>
						</template>
					</van-cell>
				</van-cell-group>
			</van-pull-refresh>
		</div>
		<van-empty description="未添加设备，请添加设备后点击同步按钮" v-show="list.length === 0" />
		<div class="footer">
			<div class="btn-box">
				<img src="../assets/syn.png" :class="['img-btn',{'circle': isCircle}]" @click="refresh" ref="circle" />
				<div class="font12">同步设备</div>
			</div>
			<div class="btn-box">
				<img src="../assets/unlink.png" class="img-btn" @click="unlinked" />
				<div class="font12">解除绑定</div>
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { NavBar, Cell, CellGroup, Empty, Dialog, PullRefresh, Toast } from "vant";
export default {
	name: "DeviceList",
	components: {
		[NavBar.name]: NavBar,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[Empty.name]: Empty,
		[Dialog.Component.name]: Dialog.Component,
		[PullRefresh.name]: PullRefresh,
	},
	data() {
		return {
			list: [
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				},
				{
					name: "设备1",
					imgpath: "/3list/2.png"
				}
			],
			isLoading: false,
			isCircle: false
		};
	},
	methods: {
		back(): void {
			this.$router.go(-1);
		},
		unlinked(): void {
			Dialog.confirm({
				message: '解除绑定后，将无法控制该账号下的所有设备，是否确认解除？'
			}).then(() => {
				// on confirm
			}).catch(() => {
				// on cancel
			});
		},
		onRefresh(): void {
			this.isLoading = true;
			setTimeout(() => {
				this.isLoading = false;
			}, 3000);
		},
		refresh(): void {
			this.isCircle = true;
			setTimeout(() => {
				this.isCircle = false;
				Toast({
					message: '同步成功',
					position: 'bottom'
				});
			}, 3000);
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
	position: relative;
	.list {
		overflow: scroll;
		flex: 1;
		padding-bottom: 80px;
		.list-img {
			width: 20px;
			height: 20px;
			vertical-align: middle;
		}
	}
	.footer {
		position: absolute;
		bottom: 20px;
		left: 20px;
		right: 20px;
		display: flex;
		justify-content: center;
		.btn-box {
			.img-btn {
				width: 20px;
				height: 20px;
				border-radius: 50%;
				border: 1px solid #cccccc;
				padding: 4px;
				cursor: pointer;
				margin: 0 12px;
			}
			.circle {
				animation:turn 1s linear infinite;
			}
		}
	}
}
 @keyframes turn{
      0%{-webkit-transform:rotate(0deg);}
      25%{-webkit-transform:rotate(90deg);}
      50%{-webkit-transform:rotate(180deg);}
      75%{-webkit-transform:rotate(270deg);}
      100%{-webkit-transform:rotate(360deg);}
}
</style>