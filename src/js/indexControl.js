// 获取当前歌曲索引

(function ($, root) {
    function Control(len) {
        // this --> Control
        this.index = 0;
        this.len = len;
    }
    Control.prototype = {
        prev: function () {
            return this.getIndex(-1);
        },
        next: function () {
            return this.getIndex(1);
        },
        // 计算改变后的索引
        getIndex: function (val) {
            // 当前索引
            var index = this.index;
            // 数据总长度
            var len = this.len;
            // 索引为的改变 -- 模运算
            var curIndex = (index + val + len) % len;
            // 更新索引
            this.index = curIndex;
            // 改变后的索引
            return curIndex;
        }
    }
    // 把构造函数暴露出去
    root.controlIndex = Control;
})(window.Zepto, window.player || (window.player = {}));