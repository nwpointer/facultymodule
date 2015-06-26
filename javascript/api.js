window.App = {};
App.terms = [];
App.programView = {};
window.Api = window.location.origin + '/rest';

App.dynamic = false;

App.pCount = 0;


(function ($) {
  // if search term added input into search box
  $(function(){
    var searchTerm = window.location.href.split("/").slice(-1)[0];
    searchTerm = searchTerm =='programs' ? "" : searchTerm;
    $("#controls .search").val(searchTerm);
  });
  

  function request(url, callback){
    $.ajax(url, {
      success: function(data){
         if(typeof callback === "function"){
          callback(data);
         }
      },
      error: function(){
        console.log(url + "fail");
      }
    });
  };
  function synchronousRequest(url, callback){
    $.ajax(url, {
      success: function(data){
         if(typeof callback === "function"){
          response = callback(data);
         }
      },
      error: function(){
        console.log(url + "fail");
      },
      async: false
    });
  };

  App.requestPrograms = function(callback){
    url = Api + '/node';
    request(url, function(data){
      if(App.dynamic){
        // console.log(data);
        data = _.select(data, function(node){ return node.type == "program";});
        App.programUrls = _.pluck(data, "uri");
        // _.each(App.programUrls, App.requestProgram);
        App.programUrls.forEach(App.requestProgram.bind({callback:callback}));
      }
    });
  }

  App.requestProgram = function(url){
    callback = this.callback;
    request(url, function(data){
      // converts data to consumable format 
      program = {
        country: getTermName(data.field_country),
        term: getTermName(data.field_term),
        type: getTermName(data.field_program_type) || "uncatagorized",
        priority: getPriority(data.field_3d_party_provider_program),
        title: data.title,
        discipline: getTermName(data.field_discipline),
        url: data.path,
        academicStanding: getCustomfield(data.field_academic_standing),
        image: getBackground(data.field_header_background),
        enrollment_required: getCustomfield(data.field_enrollment_required),
        price: getPricefield(data.field_program_fee),
        region: getTermName(data.field_continent)
      };

      App.pCount +=1;

      App.programs.list.setAttribute("class", App.programs.list.className + " loaded");
      
      if(App.enrolled || program.enrollment_required == '0'){
        this.callback();
      }
    });
  }

  function getBackground(field){
      if(typeof field.und === 'undefined'){
        bk = 'http://abhijit67.blog.com/files/2012/02/mount-everast.jpg';
      }else{
        baseLocation = 'http://geo.local:8083/sites/geo.local/files/';
        filename = field.und[0].filename;
        bk = baseLocation + filename;
      }
     return bk;
  }

  function getEl(items){
    item = items[items.length -1];
    return $(item.elm);
  }

  function getPriority(field){
    return field && field.und ? parseInt(field.und[0].value) : 0;
  }

  function getCustomfield(field){
    // conso
    foo = field && field.und ? field.und[0].value : "";
      return foo;
  }

  function getPricefield(field){
    price = parseInt(getCustomfield(field).replace(/\D/g,''));
    if(price < 6000){
      return "$6,000";
    }else if( price < 10000){
      return "$6,000-$10,000";
    } else {
      return "$10,000+";
    }
  }

  function getTermName(field){
    term = getTerm(field);
    return term ? term.name : null;
  }
  function getTerm(field){
    tid= field && field.und ? field.und[0].tid : null;
    url = Api + '/term/' + tid;
    if(typeof App.terms[tid] === "undefined"){
      synchronousRequest(url, function(data){
        App.terms[data.tid] = data;
      });
    }
    return App.terms[tid];
  }

  // function render(){
  //   programs = window.programs;
  //   for(i=0; i<programs.length; i++){
  //     window.userList.add(programs[i]);
  //   }
  // }
})(jQuery);