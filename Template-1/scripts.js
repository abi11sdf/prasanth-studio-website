/*
* JOPHO - Photography Studio Template
* Build Date: May 2025
* Author: Your Name
* Copyright (C) 2025 - Your Company
*/

$(function () {
    "use strict";
    
    // Preloader
    $(window).on('load', function () {
        $(".loading").fadeOut(500);
    });

    // Navbar scrolling background
    $(window).on("scroll", function () {
        var bodyScroll = $(window).scrollTop(),
            navbar = $(".navbar");
        
        if (bodyScroll > 100) {
            navbar.addClass("nav-scroll");
        } else {
            navbar.removeClass("nav-scroll");
        }
    });

    // Close navbar-collapse when clicking a nav-link
    $(".nav-link").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });

    // Smooth Scrolling
    $.scrollIt({
        upKey: 38,               // key code to navigate to the next section
        downKey: 40,             // key code to navigate to the previous section
        easing: 'swing',         // the easing function for animation
        scrollTime: 600,         // how long (in ms) the animation takes
        activeClass: 'active',   // class given to the active nav element
        onPageChange: null,      // function(pageIndex) that is called when page is changed
        topOffset: -70           // offste (in px) for fixed top navigation
    });
    
    // Sections background image from data background
    var pageSection = $(".bg-img, section");
    pageSection.each(function (indx) {
        if ($(this).attr("data-background")) {
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });

    // Animations
    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {
            if (direction === 'down' && !$(this.element).hasClass('animated')) {
                i++;
                $(this.element).addClass('item-animate');
                setTimeout(function () {
                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            var effect = el.data('animate-effect');
                            if (effect === 'fadeIn') {
                                el.addClass('fadeIn animated');
                            } else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animated');
                            } else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight animated');
                            } else {
                                el.addClass('fadeInUp animated');
                            }
                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });
                }, 100);
            }
        }, {
            offset: '85%'
        });
    };
    
    // Document on load.
    $(function () {
        contentWayPoint();
    });

    // Testimonials owlCarousel
    $('.testimonails .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: false,
        dots: true,
        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>", "<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });
    
    // Services owlCarousel
    $('.proto-services .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: false,
        dots: true,
        autoplayHoverPause: true,
        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>", "<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });
    
    // Header slider owlCarousel
    $('.header .owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        mouseDrag: false,
        autoplay: true,
        smartSpeed: 500,
        nav: true,
        navText: ['<i class="ti-arrow-left" aria-hidden="true"></i>', '<i class="ti-arrow-right" aria-hidden="true"></i>']
    });
    
    // Slider owlCarousel
    $('.slider-fade .owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        margin: 0,
        autoplay: true,
        smartSpeed: 500,
        animateOut: 'fadeOut',
        nav: true,
        navText: ['<i class="ti-arrow-left" aria-hidden="true"></i>', '<i class="ti-arrow-right" aria-hidden="true"></i>']
    });

    // Stellar Parallax
    $.stellar({
        horizontalScrolling: false,
        responsive: true
    });

    // Fancybox
    $('[data-fancybox="gallery"]').fancybox({
        buttons: [
            "slideShow",
            "thumbs",
            "zoom",
            "fullScreen",
            "share",
            "close"
        ],
        loop: true,
        protect: true
    });
    
    // Initialize Masonry Layout for Gallery
    function initMasonryGallery() {
        // Initialize Masonry with a delay to ensure DOM is ready
        setTimeout(function() {
            var $grid = $('#jophoto-section-photos');
            
            // Initialize Masonry
            $grid.masonry({
                itemSelector: '.animate-box',
                percentPosition: true,
                columnWidth: '.animate-box',
                gutter: 0,
                transitionDuration: '0.5s'
            });
            
            // Re-layout Masonry after images are loaded for accurate positioning
            $grid.imagesLoaded().progress(function() {
                $grid.masonry('layout');
            });
            
            // Add event handler for layout complete
            $grid.on('layoutComplete', function() {
                console.log('Masonry layout complete');
            });
            
            // Reset layout on window resize
            $(window).on('resize', function() {
                $grid.masonry('layout');
            });
            
            // Force a re-layout after a short delay
            setTimeout(function() {
                $grid.masonry('layout');
            }, 1000);
            
            // Update masonry when content changes (for dynamic content)
            $('.jophoto-photo-item img').on('load', function() {
                $grid.masonry('layout');
            });
            
            // Handle videos if present
            $('video').on('loadeddata', function() {
                $grid.masonry('layout');
            });
            
        }, 200);
    }
    
    // Initialize masonry when document is ready
    $(document).ready(function() {
        if ($('#jophoto-section-photos').length > 0) {
            initMasonryGallery();
        }
    });
    
    // Re-initialize masonry after window load to catch any delayed images
    $(window).on('load', function() {
        if ($('#jophoto-section-photos').length > 0) {
            setTimeout(function() {
                $('#jophoto-section-photos').masonry('layout');
            }, 500);
        }
    });

});