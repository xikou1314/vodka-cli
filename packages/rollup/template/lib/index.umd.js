(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var sum = function sum(a, b) {
    return a + b;
  };

  console.log(sum(1, 2));

})));
