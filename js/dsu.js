/**
 * Data Science Utilities
 * Implements techniques that may be useful in manipulating datasets
 * Some functions copied from other sources - see further details in function description
 * May implement various elements of weka, if the need arises
 * @see {@link http://weka.sourceforge.net/doc.dev/weka/filters/Filter.html?is-external=true}
 *
 * @module dsu
 *
 * 
 */

// need to polish up module structure: https://addyosmani.com/writing-modular-js/
// in particular to reinstate `module.exports = ` for node.js

var dsu = (function () {

	this.data = [];
	// var dsu = {};
	// var dsu = Object.create( null );
	// dsu.prototype.set_data = function(d) {
	// 	this.data = d;
	// 	return this;
	// };



	// might be nice to fake function overloading so getter is data() and setter is data(d)
	// see http://stackoverflow.com/questions/456177/function-overloading-in-javascript-best-practices#457589

	/**
	 * Setter for raw data to operate on
	 *
	 * @function set_data
	 * 
	 * @param {Array} d     The array containing the items
	 * @return {Object}     this (to allow for method chaining)
	 */

	var set_data = function(d) {
		this.data = d;
		return this;
	};



	/**
	 * Getter for stored data
	 *
	 * @function get_data
	 * 
	 * @return {Array}     The data array
	 */

	var get_data = function() {
		return this.data;
	};



	/**
	 * Shuffles array in place.
	 *
	 * @function shuffle
	 * 
	 * @param {Array} a     The array containing the items
	 * @see {@link http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript}
	 * usage:
		var myArray = ['1','2','3','4','5','6','7','8','9'];
		shuffle(myArray);
	 */
 
	var shuffle = function  (a) {
		var j, x, i;
		for (i = a.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = a[i - 1];
			a[i - 1] = a[j];
			a[j] = x;
		}
	};




	/**
	 * Randomly selects a given quantity of elements from an array.
	 * Uses Fisher-Yates shuffle for selecting the random sample.
	 *
	 * @function getRandomSubarray
	 * 
	 * @param {Array} arr       items The array containing the items
	 * @param {Number} size     number of elements to include in subarray
	 * @see {@link http://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array}
	 * usage:
		var x = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
		var fiveRandomMembers = getRandomSubarray(x, 5);
	 */
 
	var getRandomSubarray = function (arr, size) {
		var shuffled = arr.slice(0), i = arr.length, temp, index;
		while (i--) {
			index = Math.floor((i + 1) * Math.random());
			temp = shuffled[index];
			shuffled[index] = shuffled[i];
			shuffled[i] = temp;
		}
		return shuffled.slice(0, size);
	};





	/**
	 * Calculates distance between points
	 * (can be in n-dimensional space)
	 *
	 * @function _measure
	 * 
	 * @param {Array} a     Array containing the coordinates of point a
	 * @param {Array} b     Array containing the coordinates of point b
	 *
	 * @return {Number}     Distance, d, between points a and b
	 */


	var _measure = function (a, b) {
		// points can be in n dimensions, e.g. for 3 it would be ([x0, y0, z0], [x1, y1, z1])
		var dist_sum = 0;
		var d = a.length; // number of dimensions; have to check both points will have equal dimensions
		if (d == b.length) {
			for (var i = 0; i < d; i++) {
				dist_sum += Math.pow((b[i] - a[i]), 2);
			}
		} else { return null; }
		
		return Math.sqrt(dist_sum);
	};


	/**
	 * Calculates distance between points
	 * (simplified special case for 2-dimensional space)
	 *
	 * @function __measure
	 * 
	 * @param {Array} a     Array containing the coordinates of point a
	 * @param {Array} b     Array containing the coordinates of point b
	 *
	 * @return {Number}     Distance, d, between points a and b
	 */

	var __measure = function (a, b) {
		return d = Math.sqrt(Math.pow((b[0] - a[0]), 2) + Math.pow((b[1] - a[1]), 2));
	};



	/**
	 * Synthetic Minority Over-sampling Technique
	 * An approach to the construction of classifiers from imbalanced datasets
	 * 
	 * This is a much simpler implementation than for instance at {@link http://weka.sourceforge.net/doc.stable/weka/filters/supervised/instance/SMOTE.html}
	 * as it follows the algorithm as originally described fairly directly (Journal of Artificial Intelligence Research 16 (2002) 321–357)
	 * without needing to implement the superstructure that has little to do with the algorithm itself.
	 * @see {@link http://arxiv.org/pdf/1106.1813.pdf}
	 *
	 * @function _smote
	 *
	 * @param {Array} sample   Array of arrays consisting of n-dimensional coordinates
	 * @param {Number} T       Number of minority class samples
	 * @param {Number} N       Amount of SMOTE %; 
	 * @param {Number} k       Number of nearest neighbors
	 * 
	 * @return {Array}         An array of ( N/100 ) * T synthetic minority class samples
	 * 
	 */


	var _smote = function (sample, T, N, k) {
		/* If N is less than 100%, randomize the minority class samples as 
		only a random percent of them will be SMOTEd. */
	
		if (N < 100) {
			//Randomize the T minority class samples - i.e. select random sample
			sample = getRandomSubarray(sample, T);
			T = ~~((N/100) * T);
			N = 100;
		}
	
		N = ~~( N / 100 ); // The amount of SMOTE is assumed to be in integral multiples of 100.
		var n_count = N; // counter 
		var numattrs = sample[0].length; //Number of attributes - e.g. for geojson coordinates = 2 (lat, lon)
		var newindex = 0;// keeps a count of number of synthetic samples generated, initialized to 0
		var synthetic = []; //array for synthetic samples
		var nnarray = [];
		var nn; // nearest neighbout random selection
		var difx, dify, gap, temp;
	
		// Compute k nearest neighbors for each minority class sample only.
		var j, d;
		for (var i = 0; i < T; i++) {
			// Compute k nearest neighbors for i, and save the indices in the nnarray
			//for (j = (i + 1); j < T; j++) {// this seems more efficient, but will miss the return journey, unfortunately
			for (j = 0; j < T; j++) {
				if (i != j) {
					d = _measure(sample[i], sample[j]);
					if (nnarray.length < k) {nnarray.push([i, j, d]);} else {
						if (d < nnarray[(nnarray.length - 1)][2]) {
							nnarray.push([i, j, d]);
							nnarray.sort(function(a, b) {
								return a[2] - b[2];
							});
							if (nnarray.length > k) {
								nnarray.pop();
							}
						}
					}
				}
			}
		
			// for each point, k nearest neighbours are temporarily stored in nnarray

			//Populate ( N, i, nnarray ) - Function to generate the synthetic samples.
		
			while (n_count !=0) {
				//Choose a random number between 1 and k,call it nn . This step chooses one of the k nearest neighbors of i .
				// randomly select one point from nnarray
				nn = Math.floor(Math.random() * nnarray.length);
				temp = [];
				
				//Compute: gap = random number between 0 and 1
				gap = Math.random();
				for (var attr = 0 ; attr < numattrs; attr++) {
					dif = sample[ nnarray[nn][1] ][attr] - sample[i][attr];
					
					//Synthetic [ newindex ][ attr ]= Sample [ i ][ attr ]+ gap * dif
					temp.push(sample[i][attr] + (gap * dif));
				}
				
				//Compute: dif = Sample [ nnarray [ nn ]][ attr ] − Sample [ i ][ attr ]
							
				newindex++;
				n_count--;
				synthetic.push(temp);
			}
		
			n_count = N;
			nnarray = [];		
		}
		return synthetic; // End of Populate.
	};



	/**
	 * Synthetic Minority Over-sampling Technique
	 * An approach to the construction of classifiers from imbalanced datasets
	 * 
	 * Chainable wrapper function that calls _smote internally
	 *
	 * @function smote
	 *
	 * @param {Number} T       Number of minority class samples
	 * @param {Number} N       Amount of SMOTE %; 
	 * @param {Number} k       Number of nearest neighbors
	 * 
	 * @return {Object}        The current object, suitable for chaining
	 * 
	 */


	var smote = function (T, N, k) {
		if (this.data[0].constructor.name !== 'Array') {
			// assume input format is geojson, so also return geojson
			return make_geojson_from_array(_smote(make_array_from_geojson(this.data), T, N, k));
		} else {
			//assume input format is array, so just return the array returned by _smote
			return _smote(this.data, T, N, k);
		}
	}


	/**
	 * Generates geoJSON file based on array of 2-element arrays representing 
	 * coordinates expressed as [lon, lat]
	 *
	 * @function make_geojson_from_array
	 *
	 * @param {Array} features   Array of [lon, lat] arrays representing geo coordinates
	 * @return {Object} geoJSON representation that incorporates coordinates passed in
	 * 
	 */


	var make_geojson_from_array = function (features) {
		var all_features = [], current_feature;
	
		features.forEach(function (e, i){
			current_feature = {"type": "Feature", 
			"properties": {"name":  'synthetic' , "value": i },
			"geometry": { "type": "Point", "coordinates": [ e[0] , e[1] ] }};
		
			all_features.push(current_feature);
		});
	
		return {"type": "FeatureCollection", "features":  all_features };
	};



	/**
	 * Generates array of 2-element arrays representing 
	 * coordinates expressed as [lon, lat] from geoJSON object's features array
	 *
	 * @function make_array_from_geojson
	 *
	 * @param {Object} geoJSON representation that incorporates coordinates passed in (features)
	 * @return {Array} features   Array of [lon, lat] arrays representing geo coordinates
	 * 
	 */


	var make_array_from_geojson = function (geoJSON) {
		var coordinates = [];
	
		geoJSON.forEach(function (e, i){
			coordinates.push([parseFloat(e.geometry.coordinates[0]), parseFloat(e.geometry.coordinates[1])]);
		});
	
		return coordinates;
	};





  
  return {
  	set_data: set_data,
    smote: smote,
    make_geojson_from_array: make_geojson_from_array
  };







})();








