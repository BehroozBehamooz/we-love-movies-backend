const lodash = require("lodash");
const mapProperties = require("./map-properties");

/**
 * Generates a custom map-properties configuration for the current row in the data set.
 * @param configuration
 *  the reduce-properties configuration where every value must be an array.
 *  Any `null` elements in the configuration values are replaced with the length of the previous value.
 * 
 *  `null` cannot be the first value in the value array.
 * @param previousRow
 *  the previous row data or an empty object
 * @returns {{}}
 *  the same configuration with any `null` values mapped to the length of the previous property in the previousRow object.
 *
 * @example
 *
 * getRowMapConfiguration({ "movie_id": ["movies", null, "movie_id"] }, {})
 *                returns { "movie_id": ["movies", "0", "movie_id"] }
 *
 * getRowMapConfiguration({ "movie_id": ["movies", null, "movie_id"] }, { movies: [{}, {}, {}, {}]})
 *  returns { "movie_id": ["movies", "4", "movie_id"] }
 */

function getRowMapConfiguration(configuration, previousRow) {
  return Object.entries(configuration).reduce((accumulator, [key, values]) => {
    accumulator[key] = values.map((value, index, source) =>
      value === null              
        ? lodash.get(previousRow, `${source[index - 1]}.length`, 0)//gets an object and perform a query on it
        : value
    );
    return accumulator;
  }, {});
}


function getRowMapConfiguration1(configuration, previousRow) {
  return Object.entries(configuration).reduce((accumulator, [key, values]) => {
    if (accumulator[key][1]===null){
      accumulator[key][1]=previousRow[accumulator[key][0]].length;//previousRow["movies"].length
    }
    return accumulator;
  }, {});
}

/**
 * Reduces an array of data by mapping properties onto array properties as objects.
 * @param uniqueField {string}
 *  the unique identifier field for the records in the array, this field is used as the key for the reduce operation.
 *  when called, the returned array will include one element for each unique field value.
 * @param configuration {Object}
 *  each key is the source property and the value is an array representing the path to the new property.
 *  Since array index values are not know at configuration time, use `null` to represent unknown index values.
 * @returns {function(*[]): *[]}
 *  a function that accepts an array and when called returns an array with one element for each unique field value.
 */
function reduceProperties(uniqueField, configuration) {
  return (data) => {
    const reducedData = data.reduce((accumulator, row) => {
      const key = row[uniqueField]; // row["theater_id"] which is for example 1
      const rowObject = accumulator[key] || {}; //accumulator[1] || {}

      const rowMapConfiguration = getRowMapConfiguration(
        configuration,
        rowObject
      );

      const rowMapper = mapProperties(rowMapConfiguration);
      const mappedRow=rowMapper(row);
      //console.log("rowObject: ",rowObject);
      //console.log("mappedRow: ",mappedRow);
      accumulator[key] = lodash.merge(rowObject, mappedRow);
      return accumulator;
    }, {});

    return Object.values(reducedData);
  };
}

module.exports = reduceProperties;

/**
* @accumulator examples
*{}
*{
  "1":{
    "theater_id":1,
    "address":"address1",
    "movies":[
      {"movie_id":1,"title":"title1"},
      {"movie_id":2,"title":"title2"},
    ]
  }
  "2":{
    "theater_id":2,
    "address":"address2",
    "movies":[
      {"movie_id":2,"title":"title2"},
    ]
  }
  "3":{}
}
*
*@accumulator [key] or @rowObject examples:
*{}
*{
    "theater_id":3,
    "address":"address3",
    "movies":[
      {"movie_id":1,"title":"title1"},
      {"movie_id":3,"title":"title3"},
    ]
  }
*
* @rowMapper (row) examples
*{
  "theater_id":3,
  "address":"address3",
  "movies":[
    null,
    null,
    {
    movie_id:4,
    title:"title4"
  }]
}
*
*
*At last we merge @rowMapper (row) into @rowObject and update @accumulator [key] to the merged object
*/

/*
/////////////////////////// lodash.merge examples
var object = {
  'a': [{ 'b': 2 }, { 'd': 4 }]
};
 
var other = {
  'a': [{ 'c': 3 }, { 'e': 5 }]
};
 
_.merge(object, other);
// => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
*/

/* 
var object = {
  'a': [{ 'b': 2 }, { 'd': 4 }]
};
 
var other = {
  'a': [{}, {}, { 'c': 3 }, { 'e': 5 }]
};
 
_.merge(object, other);
// => { 'a': [{ 'b': 2 }, { 'd': 4 }, { 'c': 3 }, { 'e': 5 }] }

*/