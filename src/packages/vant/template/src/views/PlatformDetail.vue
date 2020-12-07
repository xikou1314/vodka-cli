<template>
	<div class="container">
        <van-nav-bar title="平台详情" left-arrow @click-left="back" />
        
        <div class="introduce">
            <van-divider style="marginTop:0"></van-divider>
            <div class="brand">
                <van-image
                    class="marL8 logo"
                    src="https://img.yzcdn.cn/vant/cat.jpeg"
                />
                <span class="font18 marL20">
                    小狗R3X
                </span>
            </div>
            <van-divider></van-divider>
            <div class="marT20">
                <h3 class="font18 textL">平台介绍</h3>
                <p class="font14 textL">清洁电器生产厂家，主要产品为智能扫地机，吸尘器，除螨仪等清洁类家电</p>
            </div>
        </div>

        <div class="footer">
            <van-button type="primary" size="large" class="backAzure" round >绑定账号</van-button>
        </div>
        
	</div>
</template>

<script>
// @ is an alias to /src
import { NavBar, Image, Divider, Button } from "vant";
export default {
	name: "PlatformList",
	components: {
		[NavBar.name]: NavBar,
		[Image.name]: Image,
		[Divider.name]: Divider,
		[Button.name]: Button
	},
	data() {
		return {
			list: [
				{
					name: "平台1",
					imgpath: "/3list/1.png"
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
    background-color: #FFFFFF;
    position: relative;
    .introduce {
        margin: 0 20px;
        .brand {
            margin: 40px 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .logo {
                width: 100px;
                height: 100px;
                vertical-align: center;
            }
            .name {
                vertical-align: center;
            }
        }
    }
    .footer {
		position: absolute;
		bottom: 20px;
		left: 20px;
        right: 20px;
    }
}
</style>
