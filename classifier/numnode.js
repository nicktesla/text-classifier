var numnode;

numnode = {

	random: {
		//generates a random matrix with dim1 rows and dim2 columns
		randn: function(dim1, dim2) {
			var matrix = [];
			//generate a random row of dim2 and push dim1 times to the matrix list
			for(var i = 0; i < dim1; i++) {
				var row = [];				
				for(var j = 0; j < dim2; j++) {
					var randElem = Math.random(); // TODO: this should be coming from a gaussian distribution
					row.push(randElem);
				}
				matrix.push(row);
			}
			return matrix;
		}

	},
	exp: function(param) {
		//TODO: Implement this
		return param;
	},
	vectorize: function(scalarFunction) {
		//TODO: implement this
		return scalarFunction;
	}, 
	dot: function(vector1, vector2) {
		//TODO: implement this
		return;
	}, 
	zeros: function(input) {
		//TODO: implement this
		return;
	}
};

console.log("the matrix is: ", numnode.random.randn(2,2)); // move this to the tests module

module.exports = numnode;