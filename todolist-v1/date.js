//jshint esversion:6

exports.getDate = function(){
    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      
      var today = new Date();
      
      return today.toLocaleDateString("hi-IN", options);
};

exports.getDay = function(){
    var options = {
        weekday: "long",
      };
      
      var today = new Date();
      
      return today.toLocaleDateString("hi-IN", options);
};