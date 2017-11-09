$(document).ready(function() {

  //Stikcy Navigation Appears on Scroll
  $('.jsFeaturesSection').waypoint(function(direction) {

    if (direction == "down") {
      $('nav').addClass('sticky-nav');
    } else {
      $('nav').removeClass('sticky-nav');
    }
  },{
    offset: '10%;'
  });

  $('.jsPlanScroll').click(function() {
    $('html, body').animate({scrollTop: $('.jsPlansSection').offset().top}, 1250);
  });

  $('.jsFeaturesScroll').click(function() {
    $('html, body').animate({scrollTop: $('.jsFeaturesSection').offset().top}, 1250);
  });

  //Link Scroll to Section
    // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
        &&
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000, function() {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
              return false;
            } else {
              $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            };
          });
        }
      }
    });

    //Effects on Scroll
    $('.jsFeaturesWP').waypoint(function(direction) {
      $('.jsFeaturesWP').addClass('animated jackInTheBox');
    },{
      offset: '60%;'
    });

    $('.jsHowToWP').waypoint(function(direction) {
      $('.jsHowToLeft').addClass('animated slideInLeft');
      $('.jsHowToRight').addClass('animated slideInUp');
    },{
      offset: '60%;'
    });

    $('.jsLocationWP').waypoint(function(direction) {
      $('.jsLocationWP').addClass('animated zoomIn');
    },{
      offset: '60%;'
    });

    $('.jsSignUpWP').waypoint(function(direction) {
      $('.jsSignUpWP').addClass('animated shake');
    },{
      offset: '60%;'
    });
});
