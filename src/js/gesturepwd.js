import * as EventUtil from './eventutil.js';

// 全局获取页面中的canvas画布
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const oP = document.getElementsByTagName('p')[0];
const oDiv = document.getElementById('choose');
const oSetup = oDiv.getElementsByTagName('input')[0];
const oVerify = oDiv.getElementsByTagName('input')[1];

const params = {
    arr: [],
    restPoint: [],
    lastPoint: [],
    touchFlag: false
}

export default class GesturePWD {
    constructor(props) {
        this.n = props.n || 3;
        this.initDom(this.n);
    }

    // 初始化Dom结构
    initDom(n) {
        // 当视窗大小超过ipad的大小时，固定设置容器宽度为800。
        // 当视窗小于800之后，根据设备宽高动态设置画布大小
        let width = Math.min(800, document.documentElement.clientWidth);
        let height = document.documentElement.clientHeight;

        canvas.setAttribute("width", width + 'px');
        canvas.setAttribute("height", height * 0.6 + 'px');
        canvas.style.className = 'canvas';

        this.initCanvas(n);
        this.addEvent();
    }

    initParams(props) {
        this.r = 0;
        this.arr = [];
        this.restPoint = [];
        this.lastPoint = [];
        this.touchFlag = false;
    }

    // 初始化画布，实现n阶矩阵
    initCanvas(n) {
        this.initParams();
        // 求canvas的圆圈半径
        this.r = ctx.canvas.width / (2 + 4 * n);
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var obj = {
                    x: j * 4 * this.r + 3 * this.r,
                    y: i * 4 * this.r + 3 * this.r
                };
                this.arr.push(obj);
                this.restPoint.push(obj);
            }
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (var i = 0; i < this.arr.length; i++) {
            this.drawCircle(this.arr[i].x, this.arr[i].y);
        }
    }

    // 对n阶矩阵，在画布上画圆
    drawCircle(x, y) {
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
    }

    // 当点击圆圈时，圆圈变为实心点
    drawCurCir(x, y) {
        ctx.fillStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    // 对画布上的圆进行圆心打点操作
    drawPoint(x, y) {
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    // 根据打点圆心位置，绘制密码折线
    drawLine(point, lastPoint) {
        if (!this.lastPoint) { return; }
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(this.lastPoint[0].x, this.lastPoint[0].y);
        for (var i = 0; i < this.lastPoint.length; i++) {
            ctx.lineTo(this.lastPoint[i].x, this.lastPoint[i].y);
        }
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.closePath();
    }

    // 获得当前点的位置
    getPosition(e) {
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
    updatePosition(point) {
        // 清除面板
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // 重新画圆
        for (var i = 0; i < this.arr.length; i++) {
            this.drawCircle(this.arr[i].x, this.arr[i].y);
        }
        this.drawPoint(this.lastPoint); // 绘制圆心
        this.drawLine(point, this.lastPoint); // 绘制折线
        for (var i = 0; i < this.restPoint.length; i++) {
            if (Math.abs(point.x - this.restPoint[i].x) < this.r && Math.abs(point.y - this.restPoint[i].y) < this.r) {
                this.drawPoint(this.restPoint[i].x, this.restPoint[i].y);
                this.drawCurCir(this.restPoint[i].x, this.restPoint[i].y); // 绘制实心圆
                this.lastPoint.push(this.restPoint[i]);
                this.restPoint.splice(i, 1);
                break;
            }
        }
    }

    // 添加触摸事件
    addEvent() {
        // 触摸开始
        EventUtil.addHandler(canvas, 'touchstart', (e) => {
            e = EventUtil.getEvent(e);
            let loc = this.getPosition(e);
            for (var i = 0; i < this.arr.length; i++) {
                if (Math.abs(loc.x - this.arr[i].x) < this.r && Math.abs(loc.y - this.arr[i].y) < this.r) {
                    // 判断起始点是否在圈内部 
                    this.touchFlag = true;
                    this.drawPoint(this.arr[i].x, this.arr[i].y); // 绘制圆心
                    this.drawCurCir(this.arr[i].x, this.arr[i].y); // 绘制实心圆
                    this.lastPoint.push(this.arr[i]);
                    this.restPoint.splice(i, 1);
                    break;
                }
            }
        });
        // 触摸点移动
        EventUtil.addHandler(canvas, 'touchmove', (e) => {
            if (this.touchFlag) {
                // 更新触摸点的位置
                e = EventUtil.getEvent(e);
                EventUtil.preventDefault(e);
                this.updatePosition(this.getPosition(e));
            }

        });
        // 触摸结束
        EventUtil.addHandler(canvas, 'touchend', (e) => {
            if (this.touchFlag) {
                this.touchFlag = false;
                // 绘图完毕，密码操作
                this.initPwd();
            }
        });
    }

    // 初始化密码，实现设置和验证功能
    initPwd() {
        // 设置密码
        if (oSetup.checked == true) {
            this.setupPwd(this.lastPoint);
        }
        // 验证密码
        if (oVerify.checked == true) {
            this.verifyPwd(this.lastPoint);
        }
    }

    // 设置密码功能
    setupPwd(lastPoint) {
        if (lastPoint.length <= 4) {
            oP.innerHTML = "密码太短，至少需要5个点";
            setTimeout(() => {
                this.initCanvas(this.n);
            }, 1000);
        } else {
            this.checkStorage(lastPoint);
        }
    }

    // 验证密码功能
    verifyPwd(lastPoint) {
        if (this.checkPwd(lastPoint)) {
            oP.innerHTML = "密码正确!"
        } else {
            oP.innerHTML = "输入的密码不正确";
            setTimeout(() => {
                this.initCanvas(this.n);
            }, 1000);
        }
    }

    // 检测是否存入localStorage
    checkStorage(lastPoint) {
        // 若本地localStorage.password不存在，则将当前值存入localStorage
        if (!window.localStorage.getItem('password')) {
            var pwd = JSON.stringify(lastPoint);
            window.localStorage.setItem('password', pwd);
            setTimeout(() => {
                this.initCanvas(this.n);
                oP.innerHTML = "请再次输入手势密码";
            }, 1000);
        } else {
            if (!lastPoint) {
                oP.innerHTML = "请输入手势密码";
            }
            // 若本地localStorage存在，则判断是否一致
            if (this.checkPwd(lastPoint)) {
                oP.innerHTML = "密码设置成功";
                setTimeout(() => {
                    this.initCanvas(this.n);
                    oVerify.setAttribute('checked', true);
                }, 1000);
            } else {
                oP.innerHTML = "两次输入的不一致";
                // 若两次密码设置不一致，则重置密码，更新localStorage
                window.localStorage.setItem('password', "");
                setTimeout(() => {
                    this.initCanvas(this.n);
                    // 重置，提示重新输入密码
                    oP.innerHTML = "请重新输入手势密码";
                }, 1000);
            }
        }
    }

    // 检查输入的密码与localStorage.password是否相等
    checkPwd(lastPoint) {
        var oldPwd = JSON.parse(window.localStorage.getItem('password'));
        if (oldPwd.length != lastPoint.length) {
            return false;
        } else {
            for (var i = 0; i < oldPwd.length; i++) {
                if (oldPwd[i].x != lastPoint[i].x || oldPwd[i].y != lastPoint[i].y) {
                    return false;
                }
            }
            return true;
        }

    }
}