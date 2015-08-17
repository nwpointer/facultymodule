(function ($){

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

App.programs.populate = function(){
  $(".ms-drop.bottom").empty();
  
  foreachCatagory(function(catagories){
    validSelections[catagories] = [];
    dropdownof(catagories).empty();
  });

  App.requestPrograms(function(){
    App.programs.add(program);
    App.programs.search($("input.search").val());
    App.programs.sort('priority', { order: "asc" });
    // App.programs.update();
    // updateList();

    // update mulit-select
    for (var property in program) {
      if(validSelections[property] && validSelections[property].indexOf(program[property]) == -1){
        console.log();
        validSelections[property].push(program[property]);
        $(function(){
          item = program[property];
          $("." + property + "_s").append('<option class="'+ item +'"value="'+item+'">'+ item +'</option>');
        });
      }
    };

    $('select').each(function(){
      $(this).multipleSelect({
        onClick: updateList,
        selectAll: true,
        placeholder: $(this).data('placeholder')
      });
    });
    // App.programList.search($("input.search").val());
  });
}

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

App.programs.sort('priority', { order: "desc" });

// var msdrops = $(".ms-parent ul");
// $.each(msdrops, function(i){
//   console.log(i);
// })

// console.log('offff');

$(function(){
  App.staticUpdate = function(){
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
          onClick: updateList,
          selectAll: false,
          placeholder: $(this).data('placeholder')
        });
      });

    });
    App.programs.sort('priority', { order: "asc" });
  }
  // App.staticUpdate();

});

})(jQuery);