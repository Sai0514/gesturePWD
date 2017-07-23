
/* 
  功能：UI手势密码组件
  作者: 黎若楠
  日期：2017年3月29日
*/

// 全局获取页面中的canvas画布
var canvas = $('canvas');
var ctx = canvas.getContext('2d'); 
var oP = document.getElementsByTagName("p")[0];
var oDiv = $("choose");
var oSetup = oDiv.getElementsByTagName("input")[0];
var oVerify = oDiv.getElementsByTagName("input")[1];

const n = 3;  //自定义n阶矩阵，本题为: n*n
window.onload = initDom(n);

// 初始化Dom结构
function initDom(n){
	// 当视窗大小超过ipad的大小时，固定设置容器宽度为800。
	// 当视窗小于800之后，根据设备宽高动态设置画布大小
	var width = Math.min(800,document.documentElement.clientWidth); 
	var height = document.documentElement.clientHeight;

	canvas.setAttribute("width",width+'px');
	canvas.setAttribute("height",height*0.6+'px');
	canvas.style.className = 'canvas';

	initCanvas(n);
	addEvent();
}

// 初始化画布，实现n阶矩阵
function initCanvas(n){
	arr = [],       // 存储所有的点，即九宫格圆圈
	lastPoint = [], // 存储绘制过程中触碰的点
	restPoint = []; // 存储未使用的点，即剩余的点
    // 求canvas的圆圈半径
	r = ctx.canvas.width/(2+4*n);
	for(var i=0;i<n;i++){
		for(var j=0;j<n;j++){
			var obj = {
				x: j*4*r + 3*r,
				y: i*4*r + 3*r
			};
			arr.push(obj);
			restPoint.push(obj);
		}
	}
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0 ; i < arr.length ; i++) {
        drawCircle(arr[i].x, arr[i].y);
    }
}

// 对n阶矩阵，在画布上画圆
function drawCircle(x,y){
	ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
}

// 当点击圆圈时，圆圈变为实心点
function drawCurCir(x,y){
	ctx.fillStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// 对画布上的圆进行圆心打点操作
function drawPoint(x,y){
	ctx.fillStyle="#FF0000";
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

// 根据打点圆心位置，绘制密码折线
function drawLine(point,lastPoint){
	if(!lastPoint){return;}
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.moveTo(lastPoint[0].x,lastPoint[0].y);
	for(var i=0;i<lastPoint.length;i++){
		ctx.lineTo(lastPoint[i].x,lastPoint[i].y);
	}
	ctx.lineTo(point.x,point.y);
	ctx.stroke();
	ctx.closePath();
}

// 获得当前点的位置
function getPosition(e){
	// 获取当前对象的top、right、bottom、left、width、height等值。
	var rect = e.currentTarget.getBoundingClientRect();
	var po = {
		x: Math.floor(e.touches[0].clientX - rect.left),
		y: Math.floor(e.touches[0].clientY - rect.top)
	};
	// 返回当前事件触发对象的位置
	return po;
}

// 随着触摸点的移动，更新触摸点的位置
function updatePosition(point){
	// 清除面板
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
	// 重新画圆
	for(var i=0;i<arr.length;i++){
		drawCircle(arr[i].x,arr[i].y);
	}
	drawPoint(lastPoint);  // 绘制圆心
	drawLine(point,lastPoint);  // 绘制折线
	for(var i=0;i<restPoint.length;i++){
		if(Math.abs(point.x-restPoint[i].x)<r && Math.abs(point.y-restPoint[i].y)<r){
			drawPoint(restPoint[i].x,restPoint[i].y); 
			drawCurCir(restPoint[i].x,restPoint[i].y); // 绘制实心圆
			lastPoint.push(restPoint[i]);
			restPoint.splice(i,1);
			break;
		}
	}
}

// 添加触摸事件
function addEvent(){
	EventUtil.addHandler(canvas,'touchstart', startHandler);
	EventUtil.addHandler(canvas,'touchmove', moveHandler);
	EventUtil.addHandler(canvas,'touchend', endHandler);	
}

// 触摸开始 事件处理程序
function startHandler(e){
	// 获取当前触摸点的位置
	e = EventUtil.getEvent(e);
	EventUtil.preventDefault(e);
	var loc = getPosition(e); 
	for(var i=0;i<arr.length;i++){
		if(Math.abs(loc.x - arr[i].x)<r && Math.abs(loc.y - arr[i].y)<r){
		// 判断起始点是否在圈内部 
			touchFlag = true;
			drawPoint(arr[i].x,arr[i].y);  // 绘制圆心
			drawCurCir(arr[i].x,arr[i].y); // 绘制实心圆
			lastPoint.push(arr[i]);
			restPoint.splice(i,1);
			break;
		}
	}
};

// 触摸点移动 事件处理程序
function moveHandler(e){
	if(touchFlag){
		// 更新触摸点的位置
		e = EventUtil.getEvent(e);
		EventUtil.preventDefault(e);
		updatePosition(getPosition(e));
	}
};

// 触摸结束 事件处理程序
function endHandler(e){
	if(touchFlag){
		touchFlag = false;
		// 绘图完毕，密码操作
		initPwd();
	}
};

// 移除触摸事件
function removeEvent(){	
	EventUtil.removeHandler(canvas,'touchstart', startHandler);
	EventUtil.removeHandler(canvas,'touchmove',moveHandler);
	EventUtil.removeHandler(canvas,'touchend',endHandler);
}

// 初始化密码，实现设置和验证功能
function initPwd(){
	// 设置密码
	if(oSetup.checked==true){
		setupPwd(lastPoint);
	}
	// 验证密码
	if(oVerify.checked==true){
		verifyPwd(lastPoint);
	}
}

// 设置密码功能
function setupPwd(lastPoint){
	if(lastPoint.length<4){
		oP.innerHTML = "密码太短，至少需要5个点";
		setTimeout(function(){
			initCanvas(n);
		},1000);
	}else{
		checkStorage(lastPoint);
	}
}

// 验证密码功能
function verifyPwd(lastPoint){
	if(checkPwd(lastPoint)){
		oP.innerHTML = "密码正确!"
	}else{
		oP.innerHTML = "输入的密码不正确";
		setTimeout(function(){
			initCanvas(n);
		},1000);
	}
}

// 检测是否存入localStorage
function checkStorage(lastPoint){
	// 若本地localStorage.password不存在，则将当前值存入localStorage
	if(!window.localStorage.getItem('password')){
		var pwd = JSON.stringify(lastPoint);
		window.localStorage.setItem('password',pwd);
		setTimeout(function(){
			initCanvas(n);
			oP.innerHTML = "请再次输入手势密码";
		},1000);
	}else{
		if(!lastPoint){
			oP.innerHTML = "请输入手势密码";
		}
		// 若本地localStorage存在，则判断是否一致
		if(checkPwd(lastPoint)){
			oP.innerHTML = "密码设置成功";
			setTimeout(function(){
				initCanvas(n);
				oVerify.setAttribute('checked',true);
			},1000);			
		}else{
				oP.innerHTML = "两次输入的不一致";
				// 若两次密码设置不一致，则重置密码，更新localStorage
				window.localStorage.setItem('password',"");
				setTimeout(function(){
					initCanvas(n);
					// 重置，提示重新输入密码
					oP.innerHTML = "请重新输入手势密码";
				},1000);
		}		
	}	
}

// 检查输入的密码与localStorage.password是否相等
function checkPwd(lastPoint){
	var oldPwd = JSON.parse(window.localStorage.getItem('password'));
	if(oldPwd.length != lastPoint.length){
		return false;
	}else{
		for(var i=0;i<oldPwd.length;i++){
			//console.log(oldPwd[i].x+" "+oldPwd[i].y);
			//console.log(lastPoint[i].x+" "+lastPoint[i].y);
			if(oldPwd[i].x != lastPoint[i].x || oldPwd[i].y != lastPoint[i].y){
				return false;
			}
		}
		return true;
	}	
}
