
$(document).ready(function() {
      $("#owl-demo").owlCarousel({
        autoPlay: 5000,
        stopOnHover: true,
        paginationSpeed: 1000,
        goToFirstSpeed: 3000,
        singleItem: true,
        transitionStyle: "fade"
      });
    });
	
$("#owl-client-reviews").owlCarousel({
		autoPlay: 7000,
        items:1,
        loop:true,
        autoHeight: false,
		stopOnHover: true,
		slideSpeed: 1500,
		paginationSpeed: 2000,
		rewindSpeed: 2000,
		lazyEffect: "fade",
        autoHeightClass: 'owl-height',
        dots:false,
        nav:true,
        navText:[
            "<i class='fa fa-angle-left fa-2x'></i>",
            "<i class='fa fa-angle-right fa-2x'></i>"
        ]
    });
	
$(document).ready(function() {
 
  var owl = $("#owl-clients");
 
  owl.owlCarousel({
      items: 8, //10 items above 1000px browser width
	  autoPlay: 3000,
      itemsDesktop: [1000,5], //5 items between 1000px and 901px
      itemsDesktopSmall: [900,3], // between 900px and 601px
      itemsTablet: [600,2], //2 items between 600 and 0
      itemsMobile: false // itemsMobile disabled - inherit from itemsTablet option
  });
 
  // Custom Navigation Events
  $(".next").click(function(){
    owl.trigger('owl.next');
  })
  $(".prev").click(function(){
    owl.trigger('owl.prev');
  })
  $(".play").click(function(){
    owl.trigger('owl.play',3000); //owl.play event accept autoPlay speed as second parameter
  })
  $(".stop").click(function(){
    owl.trigger('owl.stop');
  })
 
});	