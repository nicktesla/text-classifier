/**
classify.js
~~~~~~~~~~~~~
A neural network classifier based on/inspired by Michael Nielsen's version in python.
Parameters are learned via stochastic gradient descent and stochastic gradient descent is computed via backpropagation. 
**/

var _, numnode, random, sigmoid_vec, sigmoid_prime_vec;

// Import node modules
_ = require("underscore");
numnode = require("./numnode");

function Network(sizes) {
	/**The list ``sizes`` contains the number of neurons in the
	respective layers of the network.  For example, if the list
	was [2, 3, 1] then it would be a three-layer network, with the
	first layer containing 2 neurons, the second layer 3 neurons,
	and the third layer 1 neuron.  The biases and weights for the
	network are initialized randomly, using a Gaussian
	distribution with mean 0, and variance 1.  Note that the first
	layer is assumed to be an input layer, and by convention we
	won't set any biases for those neurons, since biases are only
	ever used in computing the outputs from later layers.**/
	this.num_layers = sizes.length;
	this.sizes =  sizes;
	this.biases = _.map(_.rest(sizes), function(size) {return numnode.random.randn(size.length, 1);});
	this.weights =_.map(_.zip(_.initial(sizes), _.rest(sizes)), function(sizePair) {return numnode.random.randn(sizePair[0], sizePair[1]);});
}

Network.prototype.feedforward = function(a) {
	//Return the output of the network is 'a' is input
	_.each(_.zip(this.biases, this.weights), function(biasWeight){
		a = sigmoid_vec(numnode.dot(biasWeight[1], a) + biasWeight[0]);
	});
	return a;
};

Network.prototype.SGD = function(training_data, epochs, mini_batch_size, eta, test_data) {
	/**Train the neural network using mini-batch stochastic
	gradient descent.  The ``training_data`` is a list of tuples
	``(x, y)`` representing the training inputs and the desired
	outputs.  The other non-optional parameters are
	self-explanatory.  If ``test_data`` is provided then the
	network will be evaluated against the test data after each
	epoch, and partial progress printed out.  This is useful for
	tracking progress, but slows things down substantially.**/
	var n_test, n, mini_batches;
	if(test_data) {
		n_test = test_data.length;
	}
	n = training_data.length;
	
	_.each(_.range(epochs), function(epoch){
			_.shuffle(training_data);

			mini_batches = _.map(_.range(0, n, mini_batch_size), function(batchNum) {
				return training_data.slice(batchNum,batchNum+mini_batch_size);
			});
			_.each(mini_batches, function(mini_batch) {
				this.backprop(mini_batch, n, eta);
			});
			if(test_data) {
				console.log("Epoch ", epoch, ": ", this.evaluate(test_data), "/", n_test);
			}
			else {
				console.log("Epoch ", epoch, " complete");
			}
	});
};

Network.prototype.backprop = function(training_data, n, eta) {
	/**Update the network's weights and biases by applying a
	single iteration of gradient descent using backpropagation.
	The ``training_data`` is a list of tuples ``(x, y)``.  It need
	not include the entire training data set --- it might be a
	mini-batch, or even a single training example.  ``n`` is the
	size of the total training set (which may not be the same as
	the size of ``training_data``).  The other parameters are
	self-explanatory. **/
	var nabla_b = _.map(this.biases, function(b){
		return numnode.zeros(b.shape);
	});
	var nabla_w = _.map(this.weights, function(w){
		return numnode.zeros(w.shape);
	});
	_.each(training_data, function(item) {
		//feedforward
		var x, y, activation, activations, zs, weightBiases, b, w, z, delta, nabla_b, nabla_w, spv;
		x = item[0];
		y = item[1];
		activation = x;
		activations = [x]; // list to store all the activations
		zs = []; // list to store all the z vectors
		weightBiases = _.zip(this.biases, this.weights);
		_.each(weightBiases, function(weightBias) {
			b = weightBias[0];
			w = weightBias[1];
			z = numnode.dot(w, activation);
			zs.push(z);
			activation = sigmoid_vec(z);
			activations.push(activation);
		});
		// backward pass
		delta = this.cost_derivative(_.last(activations),y)*sigmoid_prime_vec(_.last(zs));
		nabla_b[nabla_b.length-1] += delta;
		nabla_w[nabla_w.length-1] += numnode.dot(delta, transpose(activations[activations.length-2])); // TODO: implement transpose
		// Note that the variable l in the loop below is used a
		// little differently to the notation in Chapter 2 of the book.
		// Here, l = 1 means the last layer of neurons, l = 2 is the
		// second-last layer, and so on.  It's a renumbering of the
		// scheme used in the book, used here to take advantage of the
		// fact that Python can use negative indices in lists.
		layers = _.range(2,this.num_layers);
		_.each(layers, function(layer){
			z = zs[layer];
			spv = sigmoid_prime_vec(z);
			delta = numnode.dot(this.weights[-layers+1].transpose(), delta)*spv; //TODO: fix this line
			nabla_b[-l] += delta;
			nabla_w[-l] += numnode.dot(delta, activations[-layers-1].transpose()); //TODO: fix this line
		});
	});
	this.weights = _.map(_.zip(this.weights, nabla_w), function(pair) {
		var w = pair[0];
		var nw = pair[1];
		return w-eta*nw;
	});
	this.biases = _.map(_.zip(this.biases, nabla_b), function(pair) {
		var b = pair[0];
		var nb = pair[1];
		return b-eta*nb;
	});   
};

Network.prototype.evaluate = function(test_data) {
	/**Return the number of test inputs for which the neural
	network outputs the correct result. Note that the neural
	network's output is assumed to be the index of whichever
	neuron in the final layer has the highest activation.**/
	var test_results = _.map(test_data, function(item) {
		return numnode.argmax(this.feedforward(item[0]), item[1]);
	});
	return _.filter(test_results, function(test_result) {return test_result[0]==test_result[1]}).length;   
};

Network.prototype.cost_derivative = function(output_activations, y) {
	/**Return the vector of partial derivatives \partial C_x /
	\partial a for the output activations, ``a``.**/
	return (output_activations-y); 	
};


// Miscellaneous functions
function sigmoid(z) {
	//The sigmoid function.
	return 1.0/(1.0+numnode.exp(-z));
}

sigmoid_vec = numnode.vectorize(sigmoid);

function sigmoid_prime(z) {
	//Derivative of the sigmoid function.
	return sigmoid(z)*(1-sigmoid(z));
}

sigmoid_prime_vec = numnode.vectorize(sigmoid_prime);
