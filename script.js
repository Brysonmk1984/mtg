var mtgApp = angular.module('mtgApp', []);
mtgApp.factory('mtgFactory', function($http){
	var factory = {};
	factory.getMtgCardSet = function(){
		return $http.get('http://api.mtgdb.info/sets/');
	};
	factory.getMtgData = function(selectedSet){
		var defaultSet = "m10"
		var selectedSet = selectedSet || defaultSet;
		return $http.get('http://api.mtgdb.info/sets/'+ selectedSet +'/cards/');
	};
	/*factory.getMtgCardTypes = function(){
		return $http.get('http://api.mtgdb.info/cards/types');
	};
	factory.getMtgCardSubtypes = function(){
		return $http.get('http://api.mtgdb.info/cards/subtypes');
	};*/
	 return factory;
});

mtgApp.controller('cardsterCtrl',['$scope','$http', 'mtgFactory', function($scope, $http, mtgFactory){

	var handleCardSet = function(data,status){
		$scope.mtgCardSet = data;
		//console.log($scope.cardSet = data);
	};
	mtgFactory.getMtgCardSet().success(handleCardSet);
	
	var handleCardTypes = function(data,status){
		$scope.mtgCardType = data;

	};
	//mtgFactory.getMtgCardTypes().success(handleCardTypes);


	var handleCardSubtypes = function(data,status){
		console.log("shit made it");
		$scope.mtgCardSubtype = data;

	};
	//mtgFactory.getMtgCardSubtypes().success(handleCardSubtypes);
	

	/* This is the callback shared by both  AJAX calls below */
	var handleAllCards = function(data,status){
		$scope.mtgData = data;
		console.log($scope.mtgData);	
	};

	/* On load AJAX call */
	mtgFactory.getMtgData().then(handleAllCards);
	

	/* On change AJAX call... should do exact same thing the on load AJAX call does */
	$scope.selectSet = function(set){
		$scope.selectedSet = set;
		console.log($scope.selectedSet);
		mtgFactory.getMtgData('m12').then(handleAllCards);
	};

	
}]);


