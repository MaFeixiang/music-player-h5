// 歌曲进度条控制封装
// 防止变量的污染 --> 立即执行函数
// 方法的挂载 --> window.player
/**
 * $ : 移动端插件
 * window.player : 把封装的方法挂载的地方
 */
(function ($, root) {
    var dur; // 储存歌曲的总时间
    var frameId; // 定时器的标识
    var startTime = 0; // 开始播放的时间
    var lastPer = 0; // 这个变量记录用户按下暂停时候歌曲所占的百分比

    // 处理时间的格式
    function formatTime (time) {
        // time 可能会取到小数
        time = Math.round(time); // 四舍五入

        // 拿到分钟和秒数
        var m = Math.floor( time / 60); //对分钟的处理, 拿总时长除以60s就是几分几秒(4.3)。只要分钟，所以向下取整
        var s = time % 60; // 对秒的处理, 拿总时长模上60，余数就是秒数

        // 对小于10的时长前面补0
        m = (m < 10 ? ('0' + m) : m); // 三目运算, 如果小于10,则前面补0
        s = (s < 10 ? ('0' + s) : s); // 同上

        // 最终返回的是处理好的时间格式  --> (05:30)
        return m + ':' + s;
    }

    // 渲染总时长
    function renderAllTime (time) {
        // dur用于下面函数的处理, 所以先把总时长time保存在dur中
        dur = time;

        // 把time处理成正确的格式
        time = formatTime(time);

        // 插入到html中
        $('.all-time').html(time);

    }
    // 进度条开始时功能: 点击播放时，进度条应该怎么运动和记录怎么样的状态
    function start(p) {
        /** 
         * 调用start的时候有两种情况, 一种传参，一种不传参
         *  1. 不传参的话，还取原来的值
         *  2. 传参的话，取传的值，表示已经切歌了
         * */
        lastPer = (p === undefined ? lastPer : p);

        // 清除定时器
        cancelAnimationFrame(frameId);

        // 记录一个开始时间: 只获取一次，相当于起点
        startTime = new Date().getTime();

        // 使用定时器不断的去调用updata(渲染进度条: 让进度条运动)
        function frame() {
            // 每次执行这个函数就会获取新的当前时间
            // 用当前时间 - 开始时间 就是目前运动了多少时间
            // (当前时间 - 开始时间) / 总时间 = 目前所占总时间的比例
            var curTime = new Date().getTime();

            // 求出当前时间所长总时长的比例 
            // dur * 1000: 把秒转化为毫秒
            var per = lastPer + (curTime - startTime) / (dur * 1000);
            
            // 0 < per < 1 : 才能渲染进度条
            if ( per <= 1 ) {
                // 如果这个条件成立，说明当前歌曲还没有播放完
                // 让进度条运动(渲染进度条)
                updata(per);

            } else {
                // 否则就结束循环, 停止运动
                cancelAnimationFrame(frameId);
            }

            // 递归调用: es6方法, 循环运动
            frameId = requestAnimationFrame(frame);
        }

        // 执行frame
        frame();
    }

    // 进度条的运动(渲染进度条)
    function updata(per) {
        // 更新左侧时间
        // per是目前进度的比例 dur是总时长
        // 把time处理成正确的时间格式, 插入到html中
        var time = formatTime(per * dur);
        $('.cur-time').html(time);

        // 更新进度条位置
        // 进度条是从-100走到0, 所以把比例处理成 -1 - 0;
        var perX = (per - 1) * 100 + '%';
        $('.pro-top').css({
            transform: 'translateX('+ perX +')',
        });
    }

    // 进度条结束时功能: 点击暂停时, 进度条怎么运动和保持什么样儿的状态
    function stop() {
        // 记录停止时的时间
        var stopTime = new Date().getTime();
        cancelAnimationFrame(frameId);

        // 暂停两次后, 再点击， 也是需要加上上上次播放的进度
        // 计算停止时的比例
        lastPer = lastPer + (stopTime - startTime) / (dur * 1000);
    }
    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        updata: updata,
        stop: stop,
        formatTime: formatTime,
    }
})(window.Zepto, window.player || (window.player = {}));