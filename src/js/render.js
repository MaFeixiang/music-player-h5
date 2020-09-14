// 实现页面渲染  img + info + like-btn
// 封闭作用域 --> 立即执行函数
(function ($,root) {
   
    // 渲染图片
    function renderImg (src) {
        var img = new Image();
        img.src =src;
        img.onload = function () {
            $('.img-box img').attr('src', src);
            root.blurImg(img, $('body'));
        }
    }

    // 渲染信息
    function renderInfo (info) {
        var str = '<div class="song-name">'+ info.song +'</div>\
                   <div class="singer-name">'+ info.singer +'</div>\
                   <div class="album-name">'+ info.album +'</div>'
                ;
        $('.song-info').html(str);
    }

    // 渲染是否收藏
    function renderIslike (like) {
        if (like) {
            $('.like').addClass('liking');
        } else {
            $('.like').removeClass('liking');
        }
    }


   // 暴露出口
   root.render = function (data) {
       renderImg(data.image);
       renderInfo(data);
       renderIslike(data.isLike);
   }; 
})(window.Zepto, window.player || (window.player = null));
// 第一个参数: 拿到zepto插件
// 第二个参数: 暴露出口,在window上挂载player, 
// 容错处理: 如果window已有window.player,传进去,如果没有,创建一个