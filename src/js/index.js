// 功能展示
// 信息+图片渲染到页面上 render **
// 点击按钮 **
// 音频的播放与暂停 切歌 ***
// 图片的旋转 **
// 进度条运动与拖拽 ****
// 点击进度条跳转 ***
// 播放完毕自动切歌 *
// 列表切歌 **

// 获取初始化暴露出来的接口
var root = window.player;
// 当前歌曲的索引值
// var nowIndex = 0;

// 把数据变成全局变量
var dataList;
var len;

// 获取音频暴露的接口
var audio = root.audioManager;
// console.log(audio)

// 获取当前索引
var control;

// 旋转图片
var timer;

// 点击切换歌曲列表的显示与隐藏
var listStatus = true;
// init: 取到数据 --> 渲染
function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            console.log(data);
            // 把数据放入全局
            dataList = data;
            len = dataList.length;
            // 把数据的总长度放进control中
            control = new root.controlIndex(len);
            // 数据加载完毕渲染页面
            root.render(data[0]);
            audio.getAudio(data[0].audio);
            // 调用点击事件
            bindEvent();
            // 添加手指事件
            bindTouch();
            // 自动切歌
            autoChange();
            // 渲染歌曲列表
            renderSongList();

            $('body').trigger('play:change', 0);
        },
        error: function (data) {
            console.log("error")
        }
    })
}

// 点击事件
function bindEvent() {
    // 自定义事件
    $('body').on('play:change', function (e, index) {
        // 索引改变 -- 渲染数据改变
        audio.getAudio(dataList[index].audio);
        // 图片 + 信息
        root.render(dataList[index]);
        // 当切歌时判断是否在播放, 若是在播放，则下一首也是播放状态
        if (audio.status == 'play') {
            audio.play();
            // 切歌时候把deg归0
            rotated(0);
        }

        // 图片角度初始化
        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            'transform': 'rotateZ(0deg)',
            'transiton': 'none'
        })

        // 渲染总时长
        root.pro.renderAllTime(dataList[index].duration);

    });
    // 左右切换歌曲
    $('.prev').on('click', function () {
        // 改变索引
        var i = control.prev();
        $('body').trigger('play:change', i);

        // 切歌进度条归0
        root.pro.start(0);

        if (audio.status == 'pause') {
            audio.pause();
            root.pro.stop();
        }
    });
    $('.next').on('click', function () {
        // 获取当前索引
        var i = control.next();
        $('body').trigger('play:change', i);

        // 切歌进度条归0
        root.pro.start(0);
        // 当切歌时, 状态为pasue, 则停止播放和停止渲染进度条
        if (audio.status == 'pause') {
            audio.pause();
            root.pro.stop();
        }
    });

    // 点击播放音乐
    $('.play').on('click', function () {
        if (audio.status == 'pause') {
            audio.play();

            // 让进度条运动
            root.pro.start();

            // 获取当前旋转的角度
            var deg = $('.img-box').attr('data-deg') || 0;
            rotated(deg);
        } else {

            audio.pause();
            // 暂停时进度条暂停
            root.pro.stop();

            clearInterval(timer);
        }
        $('.play').toggleClass('playing');
    })

    // 进度条的跳转
    clickChange($('.pro-bottom'));
    clickChange($('.pro-top'));

    // 点击展示和隐藏歌曲列表
    $('.list').on('click', function () {
        if (listStatus) {
            $('.list-song').show();
            listStatus = false;
        } else {
            $('.list-song').hide();
            listStatus = true;
        }
    })

    // 点击关闭按钮关闭
    $('.close').on('click', function () {
        $('.list-song').hide();
        listStatus = true;
    })
}

// 自动切歌
function autoChange() {
    // console.log(audio.audio);

    // audio.audio为正在播放的音频
    // 监听音频结束事件
    audio.audio.addEventListener('ended', function () {
        // 获取下一条的进度
        var i = control.next();
        $('body').trigger('play:change', i);

        // 切歌进度条归0
        root.pro.start(0);
    }, false);
}

// 点击进度条跳转
function clickChange(dom) {
    dom.on('click', function (e) {
        var x = e.clientX;
        var offset = $('.pro-bottom').offset();
        var left = offset.left;
        var width = offset.width;
        var per = (x - left) / width;
        var curTime = per * dataList[control.index].duration; //获取当前拖拽后所到达的时间

        if (0 < per && per < 1) {
            audio.playTo(curTime);
            audio.status = 'play';
            audio.play();

            $('.play').addClass('playing');
            root.pro.start(per);
        }
    })
}

// 图片旋转
function rotated(deg) {
    clearInterval(timer);
    deg = +deg;
    timer = setInterval(function () {
        deg += 0.5;
        // 记录当前的角度
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            'transform': 'rotateZ(' + deg + 'deg)',
            'transiton': 'all 1s ease-out'
        })
    }, 1000 / 60);
}
getData("./../mock/data.json");

// 移动端手指拖动事件
function bindTouch() {
    // 获取拖拽小圆点
    var $spot = $('.spot');
    // 确定移动范围 底边进度条的最左边和最右边
    var offset = $('.pro-bottom').offset();
    var left = offset.left;
    var width = offset.width;

    // 处理事件 --> 摁下 拖动 松开
    $spot.on('touchstart', function () {
        // 让进度条停止
        root.pro.stop();
        audio.pause();
    }).on('touchmove', function (e) {
        //手指按下时，离可视区左边的距离 
        var x = e.changedTouches[0].clientX;

        // 摁下长度所长总长度的比例
        var per = (x - left) / width;

        // 越界判断
        if (0 < per && per < 1) {
            // 渲染进度条
            root.pro.updata(per);
        }
    }).on('touchend', function (e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;

        // 越界判断
        if (0 < per && per < 1) {
            // 获取当前拖拽后所到达的事件
            var curTime = per * dataList[control.index].duration;

            // 更新歌曲进度和状态
            audio.playTo(curTime);
            audio.status = 'play';
            audio.play();

            $('.play').addClass('playing');
            root.pro.start(per);
        }
    })
}

// 渲染歌曲列表 + 点击播放事件
function renderSongList() {
    // 获取需要渲染的父级元素
    var $oUl = $('.list-song-ul');
    dataList.forEach(function (ele, index) {
        // 创建需要渲染的软塑
        var listSong = '\
            <li>\
            <img  class="img" src="' + ele.image + '" alt="">\
            <span class="song">' + ele.song + '</span>\
            <span class="singer">- ' + ele.singer + '</span>\
            <span class="time">' + root.pro.formatTime(ele.duration) + '</span>\
            </li>\
        ';
        // 把歌曲信息渲染到对应的父级页面
        $(listSong).appendTo($oUl);

        // 给对应的元素添加点击事件
        $($oUl.children()[index]).on('click', function () {
            // 播放
            audio.play();
            // 改变对应的歌曲信息展示
            $('body').trigger('play:change', index);

            // 进度条归零
            root.pro.start(0);

            // 切换按钮为正在播放按钮
            $('.play').addClass('playing');
            
            // 清除上一首歌曲样式 + 此次点击事件添加样式
            $('.list-song-ul li').removeClass('clicked')
            $(this).addClass('clicked');
        })
    })
}

// 一类功能放在一个js中

