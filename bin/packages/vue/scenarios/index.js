'use strict';

var scenarios = ['full', 'full-karma-airbnb', 'minimal'];

var index = scenarios.indexOf(process.env.VUE_TEMPL_TEST);

var isTest = exports.isTest = index !== -1;

var scenario = isTest && require('./' + scenarios[index] + '.json');

exports.addTestAnswers = function (metalsmith, options, helpers) {
  Object.assign(metalsmith.metadata(), { isNotTest: !isTest }, isTest ? scenario : {});
};