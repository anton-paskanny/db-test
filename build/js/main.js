$(document).ready(function() {

  var navList = $('.nav__list'),
      hamburger = $('.hamburger'),
      sliderControls = $('.slider__controls'),
      sliderItems = $('.slider__items');

  hamburger.on('click', function() {
    navList.toggleClass('nav__list--active');
    $(this).toggleClass('hamburger--active');
  });

  sliderControls.find('li').on('click', function() {
    if (!$(this).hasClass('slider__control--current')) {
      clearInterval(newTimerID);
      var index = $(this).index();

      sliderControls.find('li').removeClass('slider__control--current');
      sliderItems.find('li').removeClass('slider__item--current').fadeOut();
      $(this).addClass('slider__control--current');

      sliderItems.find('li').eq(index).addClass('slider__item--current').fadeIn();

      newTimerID = setInterval(autoplaySlider, 7500);
    }
  });

  var newTimerID = setInterval(autoplaySlider, 7500);
  sliderItems.find('.slider__item--current').css({'display': 'block'});

  function autoplaySlider() {
    var currentSlide = sliderItems.find('.slider__item--current');
    var nextSlide = currentSlide.next();
    var currentDot = sliderControls.find('.slider__control--current');
    var nextDot = currentDot.next();

    if ((nextSlide.length == 0) || (nextDot.length == 0)) {
			nextSlide = sliderItems.find('li').first();
			nextDot = sliderControls.find('li').first();
		}

    currentDot.removeClass('slider__control--current');
		currentSlide.removeClass('slider__item--current').fadeOut();
		nextSlide.addClass('slider__item--current').fadeIn();
		nextDot.addClass('slider__control--current');
  };
});
