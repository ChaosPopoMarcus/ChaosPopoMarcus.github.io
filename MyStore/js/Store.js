var slideIndex = 1;
	showDivs(slideIndex);

	function plusDivs(n) {
		showDivs(slideIndex +=n)
	}

	function showDivs(n) {
		var i;
		var x = document.getElementsByClassName("mySlides");
		var dots = document.getElementsByClassName("demo");
		if (n > x.length) {slideIndex = 1}
		if (n < 1) {slideIndex = x.length}
		for (var i = 0; i < x.length; i++) {
			x[i].style.display = "none";
		}
		for (i = 0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(" w3-white", "");
		} 
		if (slideIndex > x.length) {slideIndex = 1}
		x[slideIndex-1].style.display = "block";
		dots[slideIndex-1].className += " w3-white";
		setTimeout(showDivs, 4000);
		slideIndex++
	};
var slideIndex2 = 1;
	showDivs2(slideIndex2);

	function plusDivs2(t) {
		showDivs2(slideIndex2 +=t)
	}

	function showDivs2(t) {
		var y;
		var u = document.getElementsByClassName("mySlides2");
		var dotstwo = document.getElementsByClassName("demo2");
		if (t > u.length) {slideIndex2 = 1}
		if (t < 1) {slideIndex2 = u.length}
		for (var y = 0; y < u.length; y++) {
			u[y].style.display = "none";
		}
		for (y = 0; y < dotstwo.length; y++) {
			dotstwo[y].className = dotstwo[y].className.replace(" w3-white", "");
		} 
		if (slideIndex2 > u.length) {slideIndex2 = 1}
		u[slideIndex2-1].style.display = "block";
		dotstwo[slideIndex2-1].className += " w3-white";
		setTimeout(showDivs2, 4000);
		slideIndex2++
	};
var slideIndex3 = 1;
	showDivs3(slideIndex3);

	function plusDivs3(o) {
		showDivs3(slideIndex3 +=o)
	}

	function showDivs3(o) {
		var p;
		var l = document.getElementsByClassName("mySlides3");
		var dotsthree = document.getElementsByClassName("demo3");
		if (o > l.length) {slideIndex3 = 1}
		if (o < 1) {slideIndex3 = l.length}
		for (var p = 0; p < l.length; p++) {
			l[p].style.display = "none";
		}
		for (p = 0; p < dotsthree.length; p++) {
			dotsthree[p].className = dotsthree[p].className.replace(" w3-white", "");
		} 
		if (slideIndex3 > l.length) {slideIndex3 = 1}
		l[slideIndex3-1].style.display = "block";
		dotsthree[slideIndex3-1].className += " w3-white";
		setTimeout(showDivs3, 4000);
		slideIndex3++
	};

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