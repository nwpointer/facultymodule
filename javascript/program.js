//list.js initializations
var options = { 
  valueNames: [ 'discipline', 'country', 'term', 'price', 'region', 'type', 'priority'],
  // item: '<li><a class="discipline"></a> <br /><span class="url"></span><p class="country"></p></li>'//,
  item: '<li class="card"><a class="url"><div class="img-wrap"><img class="image"></div><div class="content"><h5 class="title"></h5><p class="term"></p><p class="discipline"></p></div></a></li>'
};

var catagories = {}; // the catagories user can use from
var validSelections = {}; // selectable options in select dropdown
// initialize validSelections
foreachCatagory(function(catagories){
  validSelections[catagories] = [];
});

App.programs = new List('programList', options);

var updateList = function(){
      App.programs.filter(function(item) {
        filter = true;
        foreachCatagory(function(option){
          catagories[option] = dropdownof(option).val();
          filter = filter && (_(catagories[option]).contains(item.values()[option]) || !catagories[option]);
        });
        return filter;
      });
    };
    App.updateList = updateList;


    function foreachCatagory(f){
      options.valueNames.forEach(function(option){
        f(option);
      });
    }

    function dropdownof(option){
      return $("." + option + "_s");
    }
App.staticMsActivate = function(){
  alert("ms");
}

App.staticUpdate = function(){
    // helper functions 
    var updateList = function(){
      App.programs.filter(function(item) {
        filter = true;
        foreachCatagory(function(option){
          catagories[option] = dropdownof(option).val();
          filter = filter && (_(catagories[option]).contains(item.values()[option]) || !catagories[option]);
        });
        return filter;
      });
    };
    App.updateList = updateList;


    function foreachCatagory(f){
      options.valueNames.forEach(function(option){
        f(option);
      });
    }

    function dropdownof(option){
      return $("." + option + "_s");
    }

    
    var options = { 
      valueNames: [ 'discipline', 'country', 'term', 'price', 'region', 'type', 'priority'],
      // item: '<li><a class="discipline"></a> <br /><span class="url"></span><p class="country"></p></li>'//,
      item: '<li class="card"><a class="url"><div class="img-wrap"><img class="image"></div><div class="content"><h5 class="title"></h5><p class="term"></p><p class="discipline"></p></div></a></li>'
    };
    var catagories = {}; // the catagories user can use from
    var validSelections = {}; // selectable options in select dropdown
    // initialize validSelections
    foreachCatagory(function(catagories){
      validSelections[catagories] = [];
    });

    App.updateList();

    foreachCatagory(function(catagories){
      validSelections[catagories] = [];
      dropdownof(catagories).empty();
    });

    App.programs.get().forEach(function(program){
      program = program.values();
      // console.log(program);

      App.programs.search($("input.search").val());
      App.programs.sort('priority', { order: "asc" });

      for (var property in program) {
        if(validSelections[property] && validSelections[property].indexOf(program[property]) == -1){
          console.log();
          validSelections[property].push(program[property]);

          item = program[property];
          $("." + property + "_s").append('<option class="'+ item +'"value="'+item+'">'+ item +'</option>');

        }
      };

      $('select').each(function(){
        $(this).multipleSelect({
          onClick: App.updateList,
          selectAll: false,
          placeholder: $(this).data('placeholder')
        });
      });

    });
    App.programs.sort('priority', { order: "asc" });

    
  }

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

(function ($) {
  // check for cookie
  enrolled = App.getCookie("enrolled");

  function updateNotice(){
    $('#enrollment_notice').show();
    $('#enrollment_notice span').text(App.enrolled ? 'UO students' : 'All students');
  }

  if(enrolled == ""){
    $('#question').show();    
  }else{
    updateNotice();
    $('#programList').show();

    setTimeout(function () {
      // App.staticUpdate();
      App.staticMsActivate();
    }, 10);
    
    // $('#programList').show(0, function(){
    //   // App.staticUpdate();
    // });
  }

  // ask for enrollment status & set enrollment varaible
  $('#yes').click(function(){
    App.setCookie("enrolled", true, 7);
    location.reload();
    // console.log('true!!!')
  });
  $('#no').click(function(){
    App.setCookie("enrolled", true, 7);
    location.reload();
  });

  $('#change').click(function(){
    App.setCookie("enrolled", "");
    location.reload();
    // $('#programList .list').empty();
    // App.programs.clear();
    // $(".ms-drop.bottom ul").empty();
    // $('#enrollment_notice').hide();
    // $('#question').show();
    // $('#programList').hide();
  });




  // hide enrollment questioner
  // show filtered results
  function showSearchResult(enrolled){
    
    App.setCookie("enrolled", enrolled, 7);
    if(enrolled != App.enrolled){
      App.enrolled = enrolled;
    }
  }

  // search
  $("input.search").val(getParameterByName('searchterm'));

  App.programs.on('updated', function(){
    $('#found').html(App.programs.visibleItems.length);
  });

  // var options = {
  //   valueNames: [ "title", "country" ],
  //   item: '<li><a class="url"><div class="img-wrap"><img class="image"></div><div class="content"><h3 class="title"></h3><p class="term"></p><p class="discipline"></p></div></a></li>'//,
  //   //page: 6,
  //   //plugins: [ ListPagination({}) ]
  // };

  // App.programList = new List("programs", options);
  

  // App.programView.render = function(){
  //   App.programList.add(program);
  //   // App.programList.add(program); 
  //   // App.programList.add(program);
  //   // App.programList.add(program);
  //   // App.programList.search($("input.search").val());
  //   // $('#programs li:last-child a.program').attr('href', program.path);
  //   // $('#programs li:last-child img').attr('src', program.image);
  // }

  

 // $('#discipline').change(function() {
 //   console.log( this.value); // or $(this).val()
 //   selection = this;
 //   if(this.value =='null'){
 //    App.programList.filter();
 //   }else{
 //    App.programList.filter(function(item){
 //      return item.values().discipline == selection.value;
 //    });
 //   }
 // });

 // $('#term').change(function() {
 //   console.log( this.value); // or $(this).val()
 //   selection = this;
 //   if(this.value =='null'){
 //    App.programList.filter();
 //   }else{
 //    App.programList.filter(function(item){
 //      return item.values().term == selection.value;
 //    });
 //   }
 // });

 // $('.catagories select:not(#filter, #placeholder)').toggle();

 // $('#filter').change( function() {
 //    $('#placeholder').hide();
 //    $('select:not(#filter)').hide();

 //    var catagory = $(this).val();
 //    $('#' + catagory).show();

 //    if($(this).val() == 'reset'){
 //      App.programList.filter();
 //      $('#filter').val('null');
 //    }
 // });
 // App.programList.filter(function(item){
 //  if (item.values().id > 1) {
 //         return true;
 //     } else {
 //         return false;
 //     }
 // });

})(jQuery);