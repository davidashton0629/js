$(function() {
	$("img").ready(function() {
		
		/* #################### */
		
		/**
		
			Sets slider up to begin work. Moves all slides to proper starting position, changes background colors to compensate for CSS overworking
		
		**/
		
		var canActivate = true;
		var isAuto = true;
		
		
		var totalSlides = $(".slide").length;
		//console.log(totalSlides);
		
		$("div.slide").first().addClass('active-slide');
		$("div.slide").each(function() { $(this).hide() });
		
		var currentSlide = $("div.active-slide");
		var temp = $(currentSlide).clone();
		$(currentSlide).remove();
		$("div#slides").append($(temp));
		
		currentSlide = $("div.active-slide");
		
		$(currentSlide).show(function() {
			$("div#shadower").attr("style","background-color: rgba(0,0,0,0);");
		});
		
		if(isAuto) {
			setInterval(function() {
				if(canActivate) {
					$("a.next").trigger("click");
				}
			}, 10000);
		}
		
		/* #################### */
		
		
		/* #################### */
		
		/**
		
			Initiates slider next button, takes awaiting slide and moves it to front, displays, hides old slide
		
		**/
		
		$("a.next").click(function(e)
		{
			
			e.preventDefault();
			
			if(canActivate) {
				if($(this).hasClass('disabled')) {
					return false;
				}
				
				$("a.next, a.last").addClass("disabled");
				
				currentSlide = $("div.active-slide");
				canActivate=false;
				
				var currentSlideIDs = getClasses($(currentSlide));
				var currentSlideID = parseInt(currentSlideIDs[1].replace('slide-',''));
				
				var newSlide;
				
				if(currentSlideID == totalSlides) {
					newSlide = $("div.slide-1");
				} else {
					newSlide = $("div.slide-" + (currentSlideID + 1));
				}
				
				$(newSlide).addClass('new-slide');
				
				currentSlide = $("div.active-slide");
				temp = $(newSlide).clone();
				
				$(newSlide).remove();
				$("div#slides").append($(temp));
				
				if($("div.active-slide").css("z-index") > 1) {
					$("div.active-slide").css("z-index", -1);
				}
				
				$("div.new-slide").show('slide',{direction: 'left'}, function() {
					$(currentSlide).hide().removeClass('active-slide');
					$(this).addClass('active-slide').removeClass('new-slide');
				});
				
				setTimeout(function() {
					$("a.next, a.last").removeClass("disabled");
					canActivate=true;
				}, 1000);
			}
			
		});
		
		/* #################### */
		
		/* #################### */
		
		/**
		
			Initiates slider last button, translates slide class to find "previous" slide and moves it to front, displays, hides old slide
		
		**/
		$("a.last").click(function(e){
			
			e.preventDefault();
			
			if($(this).hasClass('disabled')) {
				return false;
			}
			
			if(canActivate) {
			
    			$("a.next, a.last").addClass("disabled");
    			canActivate=false;
    			
    			currentSlide = $("div.active-slide");
    			var currentSlideIDs = getClasses($(currentSlide));
    			var currentSlideID = parseInt(currentSlideIDs[1].replace('slide-',''));
    			
    			var newSlide;
    			
    			if(currentSlideID == 1) {
    				newSlide = $("div.slide-" + totalSlides);
    			} else {
    				newSlide = $("div.slide-" + (currentSlideID - 1));
    			}
    			
    			$(newSlide).addClass('new-slide');
    			
    			currentSlide = $("div.active-slide");
    			temp = $(newSlide).clone();
    			
    			$(newSlide).remove();
    			$("div#slides").append($(temp));
    			
    			$("div.new-slide").show('slide',{direction: 'right'}, function() {
    				$(currentSlide).hide().removeClass('active-slide');
    				$(this).addClass('active-slide').removeClass('new-slide');
    			});
    			
    			setTimeout(function() {
    				$("a.next, a.last").removeClass("disabled");
    				canActivate=true;
    			}, 1000);
			}
		});
			
		/* #################### */
		
	});
});
