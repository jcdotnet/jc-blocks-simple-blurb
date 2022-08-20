jQuery(function($){
    
    const $effectElements = $('.jc-effect');

    const handleEffect = () => {
        
        const winTop = $(window).scrollTop();
        const winBottom = $(window).scrollTop() + $(window).height();

        $effectElements.each(function(){
            if ($(this).offset().top >= winTop && $(this).offset().top  < winBottom)
                $(this).addClass('jc-animate');
        });
    }

    $(window).on('scroll resize', handleEffect);
    handleEffect();

});
