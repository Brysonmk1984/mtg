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
	factory.getMtgCardTypes = function(){
		return $http.get('http://api.mtgdb.info/cards/types');
	};
	factory.getMtgCardSubtypes = function(){
		return $http.get('http://api.mtgdb.info/cards/subtypes');
	};
	factory.getCard = function(card){
		return $http.get('http://api.mtgdb.info/search/'+ card +'?start=0&limit=0');
	};
	 return factory;
});

mtgApp.controller('cardsterCtrl',['$scope','$http', 'mtgFactory', '$timeout', function($scope, $http, mtgFactory, $timeout){

	var handleCardSet = function(data,status){
		$scope.mtgCardSet = data;
		//console.log($scope.mtgCardSet);
		
	};
	mtgFactory.getMtgCardSet().success(handleCardSet);
	
	var handleCardTypes = function(data,status){
		$scope.mtgCardType = data;

	};
	mtgFactory.getMtgCardTypes().success(handleCardTypes);


	var handleCardSubtypes = function(data,status){
		$scope.mtgCardSubtype = data;
		//console.log($scope.mtgCardSubtype);

	};
	mtgFactory.getMtgCardSubtypes().success(handleCardSubtypes);
	

	/* This is the callback shared by both  AJAX calls below */
	var handleAllCards = function(data,status){
		$scope.mtgData = data;
		//console.log($scope.mtgData);	
	};

	var handleSpecificCard = function(data,status){
		$scope.mtgCard = data;
		handleAllCards($scope.mtgCard);
	};

	/* On load AJAX call */
	mtgFactory.getMtgData().then(handleAllCards);
	
	
	/* On change AJAX call... should do exact same thing the on load AJAX call does */
	$scope.selectSet = function(set){
		$scope.selectedSet = set;
		console.log($scope.selectedSet);
		var selectedSetId = returnSetId($scope.selectedSet);
		
		mtgFactory.getMtgData(selectedSetId).then(handleAllCards);
	};

	var returnSetId = function(name){
		var name = name;
		var cake;
	
		
		angular.forEach($scope.mtgCardSet, function(key, value){
			//console.log(key);
			if(key.name === name){
				cake =  key.id;
			}

		});

		
		return cake;
	};

	var returnCardInfo = function(cardId){
		var cardId = cardId;
		var cardObj;
		angular.forEach($scope.mtgData.data, function(key, value){
			//console.log(key);
			if(key.id === cardId){
				cardObj = key;
				return;
			}
			

		});

		
		return cardObj;
	};
	
	$scope.getCard = function(card){
		$scope.card = card;
		console.log(card);
		mtgFactory.getCard(card).then(handleSpecificCard)
	};

	$scope.launchModal = function(cardId){
		$scope.cardId = cardId;
		var clickedCardInfo = returnCardInfo($scope.cardId);
		$scope.cardInfo = clickedCardInfo;
		console.log($scope.cardInfo);
		$("#largeCardImageContainer").html('<img id="largeCardImage" src="http://api.mtgdb.info/content/hi_res_card_images/'+ $scope.cardId +'.jpg"/>');
		//$("#extraInfoContainer").html();
		$timeout(function(){
			$('#cardModal').modal();
		}, 300);
		
		
	};
	// $scope.cardFlavor = function(cardId){
	// 	return $scope.cardInfo.flavor;

}]);


