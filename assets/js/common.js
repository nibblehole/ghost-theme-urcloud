$(function () {
    // 顶部菜单导航
    $(".site-header .btn-menu").click(function () {
        var isExpand = $(this).attr("expand") == 1;
        if (isExpand) {
            $(".site-header .menu")
                .stop()
                .animate({
                    top: 60,
                    opacity: 0,
                })
                .hide();
            $(this).attr("expand", 0);
        } else {
            $(".site-header .menu").stop().show().animate({
                opacity: 1,
                top: 60,
            });
            $(this).attr("expand", 1);
        }
    });
});
