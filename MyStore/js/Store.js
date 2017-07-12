$(document).ready(function() {

	var navbarVisible = false;

	$(window).scroll(function(){

		var ht = $("header").height()+70;
		if ($(this).scrollTop() >= ht) {

			if (!navbarVisible) {
				$(".navbar").addClass("navbar-fixed-top")
					.hide()
					.fadeTo("slow","1");

				$(".content:first").css("padding-top", "5px");
				navbarVisible = true;
			};
		} else {
			$(".navbar").removeClass("navbar-fixed-top").removeAttr("style");
			$("content:first").css("padding-top", "0px");
			navbarVisible = false;
		}
	});
});