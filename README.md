# gesturePWD


#### 一、本次demo用于“2017年360前端星计划”大作业手势密码组件

#### 二、本次手势密码的设计思路：

1. 首先在页面上渲染出画布canvas，采用n阶矩阵的方法，因此可以设置成九宫格、十六宫格。本题设置const=n， 即九宫格。
2. 初始化节点，初始化画布。在画布上canvas画圆：drawCircle()，画圆心：drawPoint()
3. 添加touch事件，获取当前对象的位置，根据位置的移动，更新圆心的位置从而画折线: drawLine()
4. 当执行touchend事件之后，进行密码的设置或验证操作
5. 设置密码： 
	- 判断当前lastPoint(存储连接点)的长度是否大于4，否则提示长度太短；
	- 若长度符合要求，则判断localStorage是否存在，若存在，则提示再次输入手势密码；若不存在，则提示重新输入密码；
	- 若localStorage存在，判断是否两次输入值相等，循环遍历当前lastPoint值和localStorage中的password属性值，相等返回true，不等返回false；
6. 验证密码： 
	- 若设置密码环节正确，则input标签checked属性跳转添加至验证密码的单选框
	- 首先，判断输入的密码与localStorage的密码是否一致，若不一致，提示输入密码不正确
	- 其次，若输入的密码是正确的，则提示密码正确！

#### 三、使用方法：
	git clone https://github.com/Sai0514/gesturePWD.git
	开启谷歌浏览器，打开该网页
	手机调试模式，选择合适的手机进行测试。需手动刷新。


