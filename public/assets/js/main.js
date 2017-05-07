(function($) {
    "use strict";
    //preloader
    $(window).on('load', function() {
        $('#preloader').fadeOut('slow', function() {
            $(this).remove();
        });
    });

    //jQuery MeanMenu
    $('nav#dropdown').meanmenu();

    //jQuery datepicker
    $('#datepicker').datepicker();

    //wow js active
    new WOW().init();

    /* meanmenu */
    $('#mobile-menu-active').meanmenu({
        meanScreenWidth: "991",
        meanMenuContainer: ".mobile-menu",
    });

    //sticky menu
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 55) {
            $('.header').addClass('navbar-fixed-top');
        } else {
            $('.header').removeClass('navbar-fixed-top');
        }
    });

    // revolution slider start
    $("#slider1").revolution({
        sliderType: "standard",
        sliderLayout: "auto",
        delay: 900000,
        navigation: {
            arrows: {
                enable: true
            }
        },
        gridwidth: 1170,
        gridheight: 700
    });
    // revolution slider end

    //owl active
    $(".single-carousel").owlCarousel({
        autoPlay: true,
        slideSpeed: 2000,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        navigation: true,
        pagination: false,
        items: 1,
        itemsDesktop: [1199, 1],
        itemsDesktopSmall: [980, 1],
        itemsTablet: [768, 1],
        itemsMobile: [479, 1],
    });


    //scrollup
    $.scrollUp({
        scrollName: 'scrollUp', // Element ID
        topDistance: '300', // Distance from top before showing element (px)
        topSpeed: 300, // Speed back to top (ms)
        animation: 'fade', // Fade, slide, none
        scrollSpeed: 900,
        animationInSpeed: 1000, // Animation in speed (ms)
        animationOutSpeed: 1000, // Animation out speed (ms)
        scrollText: '<i class="fa fa-angle-up"></i>', // Text for element
        activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
    });


    //venobox
    $('.venobox').venobox();

    // counterUp
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });

    // project-area
    $(".project-carousel").owlCarousel({
        autoPlay: true,
        slideSpeed: 2000,
        pagination: false,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        navigation: true,
        items: 3,
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [980, 2],
        itemsTablet: [768, 1],
        itemsMobile: [479, 1],
    });

    // testimonial-item
    $(".testimonial-item").owlCarousel({
        autoPlay: true,
        slideSpeed: 2000,
        pagination: false,
        navigation: true,
        items: 1,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        transitionStyle: "goDown",
        itemsDesktop: [1199, 1],
        itemsDesktopSmall: [980, 1],
        itemsTablet: [768, 1],
        itemsMobile: [479, 1],
    });

    // client_carousel
    $(".client_carousel").owlCarousel({
        autoPlay: true,
        slideSpeed: 2000,
        pagination: false,
        navigation: false,
        items: 5,
        itemsDesktop: [1199, 1],
        itemsDesktopSmall: [980, 3],
        itemsTablet: [768, 2],
        itemsMobile: [479, 2],
    });

    // skills
    if (typeof($.fn.knob) != 'undefined') {
        $('.knob').each(function() {
            var $this = $(this),
            knobVal = $this.attr('data-rel');
            $this.knob({
                'draw': function() {
                    $(this.i).val(this.cv + '%')
                }
            });

            $this.appear(function() {
                $({value: 0}).animate({
                    value: knobVal
                }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function() {
                        $this.val(Math.ceil(this.value)).trigger('change');
                        }
                    });
                }, {
                accX: 0,
                accY: -150
            });
        });
    }

    //portfolio start
    $(window).on("load", function() {
        var $container = $('.portfolio');
        $container.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.portfolio-nav li').on("click", function() {
            $('.portfolio-nav li.active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });
    });
    //portfolio end

    // dropdown menu on mouse hover start
    $(".dropdown").hover(function() {
        $('.dropdown-menu', this).not('.in .dropdown-menu').stop(true, true).slideDown("400");
        $(this).toggleClass('open');
    }, function() {
        $('.dropdown-menu', this).not('.in .dropdown-menu').stop(true, true).slideUp("400");
        $(this).toggleClass('open');
    });

})(jQuery);