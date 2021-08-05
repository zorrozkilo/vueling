setTimeout(function(){
    var options = {};
    $(".loader").hide()
 }, 2000);
 

    /*__________ COOKIES __________*/

 $(".cookies").hide();
 if(!localStorage.getItem('cookies-aceptadas')){ 
    $(".cookies").show();
 }

 function aceptarCookies() {
    $(".cookies").hide();
    localStorage.setItem('cookies-aceptadas', true);
 };


     /*__________SCROLL HORIZONTAL__________*/
 
$(document).ready(function() {

    // Define window variables

    var winScrollTop = $(window).scrollTop();
    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;

    // Define scene classes.
    var sceneClass = 'scene';
    var sceneActiveClass = sceneClass + '--active';
    var sceneEndedClass = sceneClass + '--ended';

    $(window).on('resize', function() {
        winHeight = window.innerHeight;
        winWidth = window.innerWidth;
    });

    // Scene classes function.
    function setScene($el) {

        // Get bounding values from section.
        var bounding = $el.data('elDom').getBoundingClientRect();

        if (bounding.top > winHeight) {

            // Section is below the viewport.
            // Section has not ended or started, therefore remove classes.
            $el.find('.scene').removeClass(sceneActiveClass);
            $el.find('.scene').removeClass(sceneEndedClass);

        } else if (bounding.bottom < 0) {

            // Section is above the viewport.
            // Section has ended, therefore remove classes.
            $el.find('.scene').addClass(sceneEndedClass);
            $el.find('.scene').removeClass(sceneActiveClass);

        } else {

            // We're now inside the section, not below or above.
            // If top of section is at top of viewport, add class active.
            if (bounding.top <= 0) {
                $el.find('.scene').addClass(sceneActiveClass);
            }

            // If top of section is below top of viewport, remove class active.
            if (bounding.top > 0) {
                $el.find('.scene').removeClass(sceneActiveClass);
            }

            // If bottom of section is at bottom of viewport, add class ended.
            if (bounding.bottom <= (winHeight)) {
                $el.find('.scene').addClass(sceneEndedClass);
            }

            // If bottom of section is not at bottom of viewport, remove class ended.
            if (bounding.bottom > (winHeight)) {
                $el.find('.scene').removeClass(sceneEndedClass);
            }
        }
    }

    // This function sets up the horizontal scroll. This applies data attributes to the section for later use.
    function setUpHorizontalScroll($el) {

        var sectionClass = $el.attr('class');

        // Set content wrapper variables & data attributes.
        var $contentWrapper = $el.find('.' + sectionClass + '__content-wrapper');
        var contentWrapperDom = $contentWrapper.get(0);
        $el.data('contentWrapper', $contentWrapper);
        $el.data('contentWrapperDom', contentWrapperDom);

        // Set content wrapper scroll width variables & data attributes.
        var contentWrapperScrollWidth = $el.data('contentWrapperDom').scrollWidth;
        $el.data('contentWrapperScrollWidth', contentWrapperScrollWidth);

        // Set right max variables & data attributes.
        var rightMax = $el.data('contentWrapperScrollWidth') - winWidth;
        var rightMaxMinus = -(rightMax);
        $el.data('rightMax', Number(rightMaxMinus));

        // Set initialized data variable to false do incidate scrolling functionality doesn't work yet.
        $el.data('initalized', false);

        // Set height of section to the scroll width of content wrapper.
        $el.css('height', $el.data('contentWrapperScrollWidth'));

        // Set data attribute for outerHeight.
        $el.data('outerHeight', $el.outerHeight());

        // Set data attribute for offset top.
        $el.data('offsetTop', $el.offset().top);

        // Set data initialized data variable to true to indicate ready for functionality.
        $el.data('initalized', true);

        // Set data variable for transform X (0 by default)
        $el.data('transformX', '0');

        // Add class of init
        $el.addClass($el.attr('class') + '--init');
    }

    function resetHorizontalScroll($el) {


        // Update data attribute for content wrapper scroll width.

        var contentWrapperScrollWidth = $el.data('contentWrapperDom').scrollWidth;
        $el.data('contentWrapperScrollWidth', contentWrapperScrollWidth);


        // Update rightMax variables & data attributes.
        rightMax = $el.data('contentWrapperScrollWidth') - winWidth;
        rightMaxMinus = -(rightMax);
        $el.data('rightMax', Number(rightMaxMinus));

        // Update height of section to the scroll width of content wrapper.
        $el.css('height', $el.data('contentWrapperScrollWidth'));

        // Update data attribute for outerHeight.
        $el.data('outerHeight', $el.outerHeight());

        // Update data attribute for offset top.
        $el.data('offsetTop', $el.offset().top);

        // If transform is smaller than rightmax, make it rightmax.
        if ($el.data('transformX') <= $el.data('rightMax')) {
            $el.data('contentWrapper').css({
                'transform': 'translate3d(' + $el.data('rightMax') + 'px, 0, 0)',
            });
        }
    }

    var $horizontalScrollSections = $('.horizontal-scroll-section');
    var $horizontalScrollSectionsTriggers = $horizontalScrollSections.find('.trigger');

    // Each function - set variables ready for scrolling functionality. Call horizontal scroll functions on load and resize.
    $horizontalScrollSections.each(function(i, el) {

        var $thisSection = $(this);

        $(this).data('elDom', $(this).get(0));

        // Set up horizontal scrolling data attributes and show section all have been computed.
        setUpHorizontalScroll($(this));

        // Now we're ready, call setScene on load that adds classes based on scroll position.
        setScene($(this));

        // Resize function
        $(window).on('resize', function() {
            // Reset horizontal scrolling data attributes and transform content wrapper if transform is bigger than scroll width.
            resetHorizontalScroll($thisSection);
            // Reset scene positioning.
            setScene($thisSection);
        });

    });

    function setupHorizontalTriggers($el, section) {
        var parent = $el.parent();
        var positionLeft = parent.position().left;
        var positionLeftMinus = -(positionLeft);
        var triggerOffset = $el.data('triggerOffset');
        triggerOffset = !triggerOffset ? 0.5 : triggerOffset = triggerOffset;
        $el.data('triggerOffset', triggerOffset);
        $el.data('triggerPositionLeft', positionLeftMinus);
        $el.data('triggerSection', section);
    }

    function useHorizontalTriggers($el) {
        if ($el.data('triggerSection').data('transformX') <= ($el.data('triggerPositionLeft') * $el.data('triggerOffset'))) {
            $el.data('triggerSection').addClass($el.data('class'));
        } else {
            if ($el.data('remove-class') !== false) {
                $el.data('triggerSection').removeClass($el.data('class'));
            }
        }
    }

    $horizontalScrollSectionsTriggers.each(function(i, el) {
        setupHorizontalTriggers($(this), $(this).closest('.horizontal-scroll-section'));
    });

    function transformBasedOnScrollHorizontalScroll($el) {

        // Get amount scrolled variables.
        var amountScrolledContainer = winScrollTop - $el.data('offsetTop');
        var amountScrolledThrough = (amountScrolledContainer / ($el.data('outerHeight') - (winHeight - winWidth)));

        // Add transform value variable based on amount scrolled through multiplied by scroll width of content.
        var toTransform = (amountScrolledThrough * $el.data('contentWrapperScrollWidth'));

        // Add transform value for minus (as we're transforming opposite direction).
        var toTransformMinus = -(toTransform);

        // If transform value is bigger or equal than 0, set value to 0.
        toTransformMinus = Math.min(0, toTransformMinus);

        // If transform value is smaller or equal than rightMax, set value to rightMax.
        toTransformMinus = Math.max(toTransformMinus, $el.data('rightMax'));

        // Update transformX data variable for section.
        $el.data('transformX', Number(toTransformMinus));

        // If section has been initalized, apply transform.
        if ($el.data('initalized') == true) {
            $el.data('contentWrapper').css({
                'transform': 'translate3d(' + $el.data('transformX') + 'px, 0, 0)'
            });
        }
    }

    // 
    $(window).on('scroll', function() {

        // Get window scroll top.
        winScrollTop = $(window).scrollTop();

        // Each function in horizontal scroll sections.
        $horizontalScrollSections.each(function(i, el) {
            transformBasedOnScrollHorizontalScroll($(this));
            setScene($(this));
        });

        // Each function for horizontal scroll section triggers.
        $horizontalScrollSectionsTriggers.each(function(i, el) {
            useHorizontalTriggers($(this));
        });

    });

});



function botonRequisitos() {
    $("#listado-requisitos").toggleClass("none")
}

function cerrarMenumovil() {
    $("#menu-movil").toggleClass("none")
}

function abrirVideoGeneral() {
    $("#pop-up-video-general").removeClass("none");
    var media = $("#video-general").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideoGeneral() {
    $("#pop-up-video-general").addClass("none");
    var media = $("#video-general").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo1() {
    $("#pop-up-video1").removeClass("none");
    var media = $("#video1").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo1() {
    $("#pop-up-video1").addClass("none");
    var media = $("#video1").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo2() {
    $("#pop-up-video2").removeClass("none");
    var media = $("#video2").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo2() {
    $("#pop-up-video2").addClass("none");
    var media = $("#video2").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo3() {
    $("#pop-up-video3").removeClass("none");
    var media = $("#video3").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo3() {
    $("#pop-up-video3").addClass("none");
    var media = $("#video3").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo4() {
    $("#pop-up-video4").removeClass("none");
    var media = $("#video4").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo4() {
    $("#pop-up-video4").addClass("none");
    var media = $("#video4").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo5() {
    $("#pop-up-video5").removeClass("none");
    var media = $("#video5").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo5() {
    $("#pop-up-video5").addClass("none");
    var media = $("#video5").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo6() {
    $("#pop-up-video6").removeClass("none");
    var media = $("#video6").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo6() {
    $("#pop-up-video6").addClass("none");
    var media = $("#video6").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideoGeneralMovil() {
    $("#pop-up-video-general-movil").removeClass("none");
    var media = $("#video-general-movil").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideoGeneralMovil() {
    $("#pop-up-video-general-movil").addClass("none");
    var media = $("#video-general-movil").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo1movil() {
    $("#pop-up-video1-movil").removeClass("none");
    var media = $("#video1-movil").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo1movil() {
    $("#pop-up-video1-movil").addClass("none");
    var media = $("#video1-movil").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo2movil() {
    $("#pop-up-video2-movil").removeClass("none");
    var media = $("#video2-movil").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo2movil() {
    $("#pop-up-video2-movil").addClass("none");
    var media = $("#video2-movil").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo3movil() {
    $("#pop-up-video3-movil").removeClass("none");
    var media = $("#video3-movil").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo3movil() {
    $("#pop-up-video3-movil").addClass("none");
    var media = $("#video3-movil").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo4movil() {
    $("#pop-up-video4-movil").removeClass("none");
    var media = $("#video4-movil").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo4movil() {
    $("#pop-up-video4-movil").addClass("none");
    var media = $("#video4-movil").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo5movil() {
    $("#pop-up-video5-movil").removeClass("none");
    var media = $("#video5-movil").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo5movil() {
    $("#pop-up-video5-movil").addClass("none");
    var media = $("#video5-movil").get(0);
    media.pause();
    media.currentTime = 0;
}

function abrirVideo6movil() {
    $("#pop-up-video6-movil").removeClass("none");
    var media = $("#video6-movil").get(0);
    media.play();
    media.currentTime = 0;
}

function cerrarVideo6movil() {
    $("#pop-up-video6-movil").addClass("none");
    var media = $("#video6-movil").get(0);
    media.pause();
    media.currentTime = 0;
}