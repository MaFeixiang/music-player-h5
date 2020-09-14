// 控制音频
// 播放 暂停 加载音乐
(function ($, root) {
    // 构造函数
    function AudioManager () {
        // 创建音频对象
        this.audio = new Audio();
        // this.src = src; 
        // 音频默认状态  -- 暂停
        this.status = 'pause'
    }
    AudioManager.prototype = {
        play: function () {
            this.audio.play();
            this.status = 'play';
        },
        pause: function () {
            this.audio.pause();
            this.status = 'pause';
        },
        getAudio: function (src) {
            // console.log(src);
            // 获取传进来的src
            this.audio.src = src;
            // 加载当前音频
            this.audio.load();
        },
        playTo:function(time){
            this.audio.currentTime=time;
        }
    }
    // 第一种写法
    // 把构造函数暴露出去
    // 因为外面接受的时候需要接受一个src, 所以要把构造函数暴露出去
    // root.audioManager = AudioManager;

    // 第二种写法(优化)
    // new一个构造函数暴露出去,获取数据在getAudio函数中处理
    root.audioManager = new AudioManager();
})(window.Zepto, window.player || (window.player = {}))