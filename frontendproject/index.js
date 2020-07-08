$(document).ready(function () {
    var previousScroll = 0;
    $(window).scroll(function () {
        var currentScroll = $(this).scrollTop();
        if (currentScroll < 50) {
            showTopNav();
        } else if (currentScroll > 0 && currentScroll < $(document).height() - $(window).height()) {
            if (currentScroll > previousScroll) {
                hideNav();
            } else {
                showNav();
            }
            previousScroll = currentScroll;
        }
    });

    function hideNav() {
        $(".navbar").removeClass("is-visible").addClass("transform");
    }

    function showNav() {
        $(".navbar").removeClass("transform").addClass("is-visible");
    }
});