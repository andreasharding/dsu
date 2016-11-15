/*
 * Simple demo to run from node js
 * 1. cd to main directory: 
 	$ cd /path/to/dsu/
 * 2. run in node: 
 	$ node demos/smote_map.js
 *
*/

var parsed_data, geo_sample = [];

var fs = require('fs'),
	dsu = require('../node/dsu_node.js');

var data_file = './data/thefuelcardcompany.json';

fs.readFile(data_file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  parsed_data = JSON.parse(data);
  parsed_data.features.forEach(function (e, i) {
  	geo_sample.push(e.geometry.coordinates);
  });
  
	dsu.set_data(geo_sample).smote(geo_sample.length, 100, 5);

  fs.writeFile('./test_output/smote_2d.json', JSON.stringify(dsu.set_data(geo_sample).smote(geo_sample.length, 100, 5)), function (err) {
	  if (err) return console.log(err);
	  console.log('2D smote file written');
	});
});