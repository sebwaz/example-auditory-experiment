//Sum of scalar and vector
function sv_sum(scalar, vec) {
    let result = new Array(vec.length);
    for (let k = 0; k < vec.length; k++) {
        result[k] = scalar + vec[k];
    }
    return result;
}

//Product of scalar and vector    
function sv_prod(scalar, vec) {
    let result = new Array(vec.length);
    for (let k = 0; k < vec.length; k++) {
        result[k] = scalar * vec[k];
    }
    return result;
}    

//Elementwise product
function ew_prod(vec1, vec2) {
    // For simplicity, assume both vectors are equal in length
    let result = new Array(vec1.length);
    for (let k = 0; k < vec1.length; k++) {
        result[k] = vec1[k] * vec2[k];
    }
    return result;
}

//Elementwise quotient
function ew_quot(vec_num, vec_den) {
    // For simplicity, assume both vectors are equal in length
    let result = new Array(vec_num.length);
    for (let k = 0; k < vec_num.length; k++) {
        result[k] = vec_num[k] / vec_den[k];
    }
    return result;
}

//Apply sine function to all elements in a vector
function sin_vec(vec) {
    let result = new Array(vec.length);
    for (let k = 0; k < vec.length; k++) {
        result[k] = Math.sin(vec[k]);
    }
    return result;
}

//Apply cosine function to all elements in a vector
function cos_vec(vec) {
    let result = new Array(vec.length);
    for (let k = 0; k < vec.length; k++) {
        result[k] = Math.cos(vec[k]);
    }
    return result;
}

//Apply modulo function to all elements in a vector
function mod_vec(vec, d) {
    let result = new Array(vec.length);
    for (let k = 0; k < vec.length; k++) {
        result[k] = vec[k] % d;
    }
    return result;
}

//Create a vector of ones
function ones(len) {
    return new Array(len).fill(1);
}

//Create a vector of zeros
function zeros(len) {
    return new Array(len).fill(0);
}

//Random permuation of digits from 0 to n-1 (source: https://github.com/scijs/random-permutation)
function randperm(n) {
  var result = new Array(n)
  result[0] = 0
  for(var i=1; i<n; ++i) {
    var idx = (Math.random()*(i+1))|0
    if(idx < i) {
      result[i] = result[idx]
    }
    result[idx] = i
  }
  return result
}

//Use vector I to index vector V
function v_i(V, I) {
    var result = new Array(I.length);
    for (let k = 0; k < I.length; k++) {
        result[k] = V[I[k]];
    }
    return result;
}

//Create a vector from 0 to N-1
function consec(N) {
    return Array.from(Array(N).keys());
}