// e.visibleItems

(function($, _){
	// alert("foo");
	var options = { 
		valueNames: [ 'name', 'country', 'title', 'bio', 'myear', 'uyear', 'dyear', 'minst', 'uinst', 'dinst', 'mafield', 'uafield', 'dafield', 'email', 'website' ],
	};
	programList = new List('programList', options);

	programList.on("updated", function(){
		$("#controls #found").html(programList.visibleItems.length);
	});

	//weird cross filter empty list bug fix... 
	programList.on("filterComplete", function(e){
		if(!e.visibleItems){e.filter();e.update()}
		$("body img").unveil();
	});

	$(".ms-parent.reset a").click(function(e){
		(e.preventDefault());
		programList.filter();
		$("select").multipleSelect('uncheckAll');
	})

	function updateLogList(){
		updateList();
		//console.log(programList.visibleItems.length);
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
		values.myear = $(".myear_s").val();
		values.uyear = $(".uyear_s").val();
		values.dyear = $(".dyear_s").val();

		values.minst = $(".minst_s").val();
		values.uinst = $(".uinst_s").val();
		values.dinst = $(".dinst_s").val();

		values.mafield = $(".mafield_s").val();
		values.uafield = $(".uafield_s").val();
		values.dafield = $(".dafield_s").val();
		console.log(values);

		programList.filter(function(item) {
			return (_(values.minst).contains(item.values().minst) || !values.minst)
				&& (_(values.uinst).contains(item.values().uinst) || !values.uinst)
				&& (_(values.dinst).contains(item.values().dinst) || !values.dinst)
				&& (_(values.mafield).contains(item.values().mafield) || !values.mafield)
				&& (_(values.uafield).contains(item.values().uafield) || !values.uafield)
				&& (_(values.dafield).contains(item.values().dafield) || !values.dafield)
				&& (_(values.myear).contains(item.values().myear) || !values.myear)
				&& (_(values.uyear).contains(item.values().uyear) || !values.uyear)
				&& (_(values.dyear).contains(item.values().dyear) || !values.dyear)
		})

		// values.discipline = $(".discipline_s").val();
		// values.country = $(".country_s").val();
		// values.term = $(".term_s").val();
		// values.price = $(".price_s").val();
		// values.region = $(".region_s").val();
		// values.type = $(".type_s").val();
		
		// values.priority = $(".priority_s").val();

		// window.val = values;

		// programList.filter(function(item) {
		// 	var usertype = getCookie("usertype");
		// 	//console.log(programMatches(values.type, item.values().type));
		// 	// PRICE CONDITION && (_(values.price).contains(item.values().price) || !values.price)
		// 	// && (_(values.priority).contains(item.values().priority) || !values.priority)
		//     return (programMatches(values.discipline, item.values().discipline) || !values.discipline)
		// 			&& (programMatches(values.country, item.values().country) || !values.country)
		// 			&& (programMatches(values.term, item.values().term) || !values.term)
		// 			&& (programMatches(values.type, item.values().type) || !values.type)
		// 			&& (_(values.region).contains(item.values().region) || !values.region);
		// });

		// if(getCookie("usertype")){
		// 	intUserType = getCookie("usertype") == "UO students" ? 1 : 0 ;

		// 	allCountry = Object.keys(_.countBy(_.pluck(_.pluck(programList.items, "_values"), "country")))
		// 	visCountry = Object.keys(_.countBy(_.filter(_.pluck(programList.items, "_values"), function(v){return v.enrollment_required == intUserType || intUserType }), "country"));
		// 	hidCountry = seperateAndCleanCountries($(allCountry).not(visCountry).get());
			
		// 	removeCountriesFromMultiSelect(hidCountry);
		// }
	}

	

	function checkUserType(){
		$('#question').hide();
		$('#programList').show();
		$('#enrollment_notice').hide();
		//$('#enrollment_notice').find("span").html(getCookie("usertype"));
	    // usertypeIsSet = getCookie("usertype") != "";
	    // if(usertypeIsSet){
	    //     $('#question').hide();
	    //     $('#programList').show();
	    //     $('#enrollment_notice').show();
	    //     $('#enrollment_notice').find("span").html(getCookie("usertype"));
	    // }else{
	    //     $('#question').show();
	    //     $('#programList').hide();
	    // }
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
		//registerUsertypeAnswer();
		//filterBySearchUrl();




		// $('#enrollment_notice').click(function(){
		// 	eraseCookie("usertype");
		// });



		// runs through all program multiselect options and trigers filter on change
		$('select').each(function(){
			console.log()
		    $(this).multipleSelect({
		      	onClick: updateList,
		      	selectAll: false,
		     	placeholder: $(this).data('placeholder')
		    	});
	  	});

		updateList();
	  	//programList.search($("input.search").val());
		//programList.sort('priority', { order: "asc" });

	});

	

})(jQuery, _);

// jQuery(".discipline_s").val()