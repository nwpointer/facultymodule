(function($, _){
	// alert("foo");

	var options = { valueNames: [ 'discipline', 'country', 'term', 'price', 'region', 'type', 'title' , 'priority', 'enrollment_required'] };
	programList = new List('programList', options);

	programList.on("updated", function(){
		$("#controls #found").html(programList.visibleItems.length);
	});
	function updateLogList(){
		updateList();
		console.log(programList.visibleItems.length);
	}

	function programMatches(requirements, has){
		var arr = has.split(", ");
		matches = false;
		_.each(arr, function(has){
			matches = matches || _(requirements).contains(has)
		});
		return matches;

	}

	function updateList(){
		var values_discipline = $(".discipline_s").val();
		var values_country = $(".country_s").val();
		var values_term = $(".term_s").val();
		var values_price = $(".price_s").val();
		var values_region = $(".region_s").val();
		var values_type = $(".type_s").val();
		var values_priority = $(".priority_s").val();

		programList.filter(function(item) {
			var usertype = getCookie("usertype");
		    return (programMatches(values_discipline, item.values().discipline) || !values_discipline)
					&& (programMatches(values_country, item.values().country) || !values_country)
					&& (programMatches(values_term, item.values().term) || !values_term)
					&& (programMatches(values_type, item.values().type) || !values_type)
					&& (_(values_price).contains(item.values().price) || !values_price)
					&& (_(values_region).contains(item.values().region) || !values_region)
					&& (_(values_priority).contains(item.values().priority) || !values_priority)
					&& ((item.values().enrollment_required == 0 && usertype == "Non-UO students")
					|| (usertype == "UO students"));
		});
	}

	

	function checkUserType(){
	    usertypeIsSet = getCookie("usertype") != "";
	    if(usertypeIsSet){
	        $('#question').hide();
	        $('#programList').show();
	        $('#enrollment_notice').show();
	        $('#enrollment_notice').find("span").html(getCookie("usertype"));
	    }else{
	        $('#question').show();
	        $('#programList').hide();
	    }
	}

	function registerUsertypeAnswer(){
		$('#question button').click(function(event){
			var userIsUOStudent = $(event.target).attr("id") == "yes" ? "UO students" : "Non-UO students";
			setCookie("usertype", userIsUOStudent, 7);
			$('#question').toggle();
			$('#programList').toggle();
			$('#enrollment_notice').show();
			$('#enrollment_notice').find("span").html(getCookie("usertype"));
			updateList();
		});
	}

	function filterBySearchUrl(){
		// checks url for patern /program/search/$ and filters programs by $ value on page load
		urlcomponents = window.location.href.split("/");
		if(urlcomponents[3] == "programs" && urlcomponents[4] == "search"){
			$("#controls .search").val(unescape(urlcomponents[5]));
		}
	}

	$(function(){


		checkUserType();
		registerUsertypeAnswer();
		filterBySearchUrl();

		$('#enrollment_notice').click(function(){
			eraseCookie("usertype");
		});



		// runs through all program multiselect options and trigers filter on change
		$('select').each(function(){
	    $(this).multipleSelect({
	      	onClick: updateList,
	      	selectAll: false,
	     	placeholder: $(this).data('placeholder')
	    	});
	  	});

		updateList();
	  	programList.search($("input.search").val());
		programList.sort('priority', { order: "asc" });

		console.log(programList.visibleItems.length);
	});

	

})(jQuery, _);

// jQuery(".discipline_s").val()