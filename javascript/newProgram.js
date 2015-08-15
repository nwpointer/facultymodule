(function($, _){
	// alert("foo");
	var options = { valueNames: [ 'discipline', 'country', 'term', 'price', 'region', 'type', 'title' , 'priority', 'enrollment_required', 'tags'] };
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
		var matches = false;
		_.each(arr, function(has){
			matches = matches || _(requirements).contains(has)
		});
		return matches;

	}


	// clear out countries with no entries
	function removeCountriesFromMultiSelect(countries){
		countries.forEach(function(country){
			$('input[value="'+country+'"]').parent().remove();
		})
	}

	function cleanCountry(arr){
		arr.forEach(function(v,i){
			arr[i] = v.replace("amp;", "")
		})
		return arr;
	}

	function seperateAndCleanCountries(arr){
		var n = [];
		arr.forEach(function(v,i){
			c = v.split(", ");
			n = n.concat(cleanCountry(c))
		})
		return n;
	}
	

	function updateList(){
		var values = {}
		values.discipline = $(".discipline_s").val();
		values.country = $(".country_s").val();
		values.term = $(".term_s").val();
		values.price = $(".price_s").val();
		values.region = $(".region_s").val();
		values.type = $(".type_s").val();
		
		values.priority = $(".priority_s").val();
		console.log(values);

		programList.filter(); programList.update();
		programList.filter(function(item) {
			var usertype = getCookie("usertype");
			//console.log(programMatches(values.type, item.values().type));
			// PRICE CONDITION && (_(values.price).contains(item.values().price) || !values.price)
			// && (_(values.priority).contains(item.values().priority) || !values.priority)
		    return (programMatches(values.discipline, item.values().discipline) || !values.discipline)
					&& (programMatches(values.country, item.values().country) || !values.country)
					&& (programMatches(values.term, item.values().term) || !values.term)
					&& (programMatches(values.type, item.values().type) || !values.type)
					&& (_(values.region).contains(item.values().region) || !values.region)
					
					&& ((item.values().enrollment_required == 0 && usertype == "Non-UO students")
					|| (usertype == "UO students"));
		});

		if(getCookie("usertype")){
			intUserType = getCookie("usertype") == "UO students" ? 1 : 0 ;

			allCountry = Object.keys(_.countBy(_.pluck(_.pluck(programList.items, "_values"), "country")))
			visCountry = Object.keys(_.countBy(_.filter(_.pluck(programList.items, "_values"), function(v){return v.enrollment_required == intUserType || intUserType }), "country"));
			hidCountry = seperateAndCleanCountries($(allCountry).not(visCountry).get());
			
			removeCountriesFromMultiSelect(hidCountry);
		}
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

	});

	

})(jQuery, _);

// jQuery(".discipline_s").val()