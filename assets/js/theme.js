function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';
    /**
     * Sticky Navbar
     * Enable sticky behaviour of navigation bar on page scroll
    */

    var stickyNavbar = function () {
        var navbar = document.querySelector('.navbar-sticky');
        if (navbar == null) return;
        var navbarClass = navbar.classList,
            navbarH = navbar.offsetHeight,
            scrollOffset = 500;

        if (navbarClass.contains('navbar-floating') && navbarClass.contains('navbar-dark')) {
            window.addEventListener('scroll', function (e) {
                if (e.currentTarget.pageYOffset > scrollOffset) {
                    navbar.classList.remove('navbar-dark');
                    navbar.classList.add('navbar-light');
                    navbar.classList.add('navbar-stuck');
                } else {
                    navbar.classList.remove('navbar-stuck');
                    navbar.classList.remove('navbar-light');
                    navbar.classList.add('navbar-dark');
                }
            });
        } else if (navbarClass.contains('navbar-floating') && navbarClass.contains('navbar-light')) {
            window.addEventListener('scroll', function (e) {
                if (e.currentTarget.pageYOffset > scrollOffset) {
                    navbar.classList.add('navbar-stuck');
                } else {
                    navbar.classList.remove('navbar-stuck');
                }
            });
        } else {
            window.addEventListener('scroll', function (e) {
                if (e.currentTarget.pageYOffset > scrollOffset) {
                    document.body.style.paddingTop = navbarH + 'px';
                    navbar.classList.add('navbar-stuck');
                } else {
                    document.body.style.paddingTop = '';
                    navbar.classList.remove('navbar-stuck');
                }
            });
        }
    }();
    /**
     * Sticky sidebar
     * @requires https://github.com/abouolia/sticky-sidebar
     * @requires https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
    */


    var stickySidebar = function () {
        var sidebar = document.querySelectorAll('.sidebar-sticky');

        if (sidebar.length > 0) {
            // Default options
            var defaultOptions = {
                topSpacing: 0,
                bottomSpacing: 0,
                containerSelector: false,
                innerWrapperSelector: '.sidebar-sticky-inner',
                minWidth: 0
            }; // Loop through the instances of sticky sidebar on the page

            for (var i = 0; i < sidebar.length; i++) {
                // User options
                var userOptions = void 0;
                if (sidebar[i].dataset.sidebarStickyOptions !== undefined) userOptions = JSON.parse(sidebar[i].dataset.sidebarStickyOptions); // Combine default and user options into one object

                var options = _objectSpread(_objectSpread({}, defaultOptions), userOptions); // Init plugin


                var _stickySidebar = new StickySidebar(sidebar[i], options);
            }
        }
    }();
    /**
     * Anchor smooth scrolling
     * @requires https://github.com/cferdinandi/smooth-scroll/
    */


    var smoothScroll = function () {
        var selector = '[data-scroll]',
            fixedHeader = '[data-scroll-header]',
            scroll = new SmoothScroll(selector, {
                speed: 800,
                speedAsDuration: true,
                offset: 40,
                header: fixedHeader,
                updateURL: false
            });
    }();
    /**
     * Animate scroll to top button in/off view
    */


    var scrollTopButton = function () {
        var element = document.querySelector('.btn-scroll-top'),
            scrollOffset = 600;
        if (element == null) return;
        var offsetFromTop = parseInt(scrollOffset, 10);
        window.addEventListener('scroll', function (e) {
            if (e.currentTarget.pageYOffset > offsetFromTop) {
                element.classList.add('show');
            } else {
                element.classList.remove('show');
            }
        });
    }();
})();


$(function () {
    $('header a').click(function () {
        $('#navbar-menu').collapse('hide');
    });

    $('a[data-lang]').click(function () {
        Cookies.set('lang', $(this).attr('data-lang'), { expires: 365, sameSite: 'strict' })
        location.reload();
    });

    window.init_page = function (selector) {};
    init_page(document);

    new ClipboardJS('.copy', {
        text: function (trigger) {
            var target = $(trigger);
            if (target.attr('target')) {
                target = $(target.attr('target'));
            }
            return target.attr('data-text') || target.val() || target.text();
        }
    }).on('success', function (event) {
        var trigger = $(event.trigger);
        var title_origin = trigger.attr('title');
        var message = trigger.attr('data-copy-success');
        trigger.removeAttr('title');
        trigger.tooltip({
            title: message ? message : window.copy_success_text,
            trigger: 'manual',
        }).tooltip('show');
        setTimeout(function () {
            trigger.tooltip('dispose');
            trigger.attr('title', title_origin);
        }, 600);
    }).on('error', function (e) {
        alert("Copy failed");
    });
    $(document).on('click', '#withdraw', function(){
        var block = $('#airdrop-block');
        var address = $(this).attr('data-address');
        block.load('/airdrop/withdraw',{
            address: address,
        }, function(){
            init_page(block);
        });
    });

    var end_ts = parseInt($('body').attr('data-end-time-ts'));
    var prev_days = 0;
    var prev_hours = 0;
    var prev_minutes = 0;
    var prev_seconds = 0;
    var countdown = function () {
        var now_ts = Math.floor(new Date().getTime() / 1000);
        var ts_diff = end_ts - now_ts;
        if (ts_diff < 0) {
            return;
        }
        if (ts_diff < -3) {
            clearInterval(interval);
            location.reload();
            return;
        }
        var days = Math.floor(ts_diff / 60 / 60 / 24);
        var hours = Math.floor((ts_diff - days * 60 * 60 * 24) / 60 / 60);
        var minutes = Math.floor((ts_diff - days * 60 * 60 * 24 - hours * 60 * 60) / 60);
        var seconds = Math.floor(ts_diff - days * 60 * 60 * 24 - hours * 60 * 60 - minutes * 60);
        if (prev_days != days) {
            $('.count_down_days').text(days<10?'0'+days:days);
        }
        if (prev_hours != hours) {
            $('.count_down_hours').text(hours<10?'0'+hours:hours);
        }
        if (prev_minutes != minutes) {
            $('.count_down_minutes').text(minutes<10?'0'+minutes:minutes);
        }
        $('.count_down_seconds').text(seconds<10?'0'+seconds:seconds);
        prev_days = days;
        prev_hours = hours;
        prev_minutes = minutes;
        prev_seconds = seconds;
    };
    countdown();
    var interval = setInterval(countdown, 1000);
});