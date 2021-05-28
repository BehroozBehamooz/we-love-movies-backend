const lodash=require("lodash");
// var object = {
//     'a': [{ 'b': 2 }, { 'd': 4 }]
//   };
   
//   var other = {
//     'a': [{ 'c': 3 }, { 'e': 5 }]
//   };

var object = {
    'title':'title1',
    'about':'about movie',
    'a': [{ 'b': 2 }, { 'd': 4 }]
  };
   
  var other = {
    'title':'title1',  
    'a': [{}, {}, { 'c': 3 }, { 'e': 5 }]
  };
   
  const merged=lodash.merge(object, other);

  console.log(merged);