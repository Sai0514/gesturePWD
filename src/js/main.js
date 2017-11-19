/* 
  功能：UI手势密码组件
  author: 黎若楠
  date：2017.03.29
  modified: 2017.11.19
*/

import GesturePWD from './gesturepwd.js';

const N = 3; // 矩阵参数
const initProps = {
    n: N
}
window.onload = function() {
    new GesturePWD(initProps);
}