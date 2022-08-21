import jQuery from 'jquery';

jQuery(function($){

    const $effectElements = $('.jc-effect');

    const handleEffect = () => {
        
        const winTop = $(window).scrollTop();
        const winBottom = $(window).scrollTop() + $(window).height();

        $effectElements.each(function(){
            const $element = $(this); 
            if ($element.offset().top >= winTop && $element.offset().top  < winBottom) {
                $element.css('animation-duration', '1s').addClass('jc-animate');
                setTimeout( function() {
                    $element.addClass('jc-animated').css('animation-duration', '');
                }, 1000 );
            }   
        });
    }

    $(window).on('scroll resize', handleEffect);
    handleEffect();

});
