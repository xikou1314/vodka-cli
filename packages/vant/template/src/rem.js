// 设置 rem 函数
function setRem() {

    const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const htmlDom = document.getElementsByTagName('html')[0];
    htmlDom.style.fontSize= htmlWidth/10 + 'px';
}
setRem();
window.onresize = function () {
    setRem()
}
