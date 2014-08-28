var mtgApp = angular.module('mtgApp', []);
mtgApp.factory('mtgFactory', function($http){
	var factory = {};
	factory.getMtgCardSet = function(){
		return $http.get('http://api.mtgdb.info/sets/');
	};
	factory.getMtgData = function(selectedSet){
		var defaultSet = "m15"
		var selectedSet = selectedSet || defaultSet;
		return $http.get('http://api.mtgdb.info/sets/'+ selectedSet +'/cards/');
	};
	factory.getMtgCardTypes = function(){
		return $http.get('http://api.mtgdb.info/cards/types');
	};
	/*factory.getMtgCardSubtypes = function(){
		return $http.get('http://api.mtgdb.info/cards/subtypes');
	};*/
	factory.getCard = function(card){
		return $http.get('http://api.mtgdb.info/search/'+ card +'?start=0&limit=0');
	};
	factory.getCardPrice = function(cardName){
		var myUrl = 'http://magictcgprices.appspot.com/api/tcgplayer/price.json?cardname='+cardName+'&callback=JSON_CALLBACK';
		console.log(myUrl);
		return $http.jsonp(myUrl);
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


	/*var handleCardSubtypes = function(data,status){
		$scope.mtgCardSubtype = data;
		//console.log($scope.mtgCardSubtype);

	};
	mtgFactory.getMtgCardSubtypes().success(handleCardSubtypes);*/
	





	/* This is the callback shared by both  AJAX calls below */
	var handleAllCards = function(data,status){
		$scope.loadingSpinner = false
		$scope.mtgData = data;
		$scope.setCount = data.data.length;
		//console.log($scope.mtgData);
		$scope.pagination($scope.setCount);
	};







	var handleSpecificCard = function(data,status){
		$scope.mtgCard = data;
		handleAllCards($scope.mtgCard);
	};

	var handleCardPrice = function(data,status){alert(1);
		$scope.mtgCardPrice = data;
		console.log($scope.mtgCardPrice);
	};

	/* On load AJAX call */
	$scope.loadingSpinner = true;
	mtgFactory.getMtgData().then(handleAllCards);
	
	
	/* On change AJAX call... should do exact same thing the on load AJAX call does */
	$scope.selectSet = function(set){
		$scope.loadingSpinner = true;
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
		mtgFactory.getCard(card).then(handleSpecificCard)
	};

	$scope.launchModal = function(cardId){
		$scope.loadingSpinner = true;
		$scope.cardId = cardId;
		var clickedCardInfo = returnCardInfo($scope.cardId);
		$scope.cardInfo = clickedCardInfo;
		$scope.cardName = $scope.cardInfo.name;
		//console.log($scope.cardName);
		$scope.cardPrice; 
		mtgFactory.getCardPrice($scope.cardName).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
    }).
    error(function(data, status, headers, config) {
      console.log(data);
      console.log(status);
      console.log(headers);
      console.log(config);
    }).then(handleCardPrice);
		

		$("#largeCardImageContainer").html('<img id="largeCardImage" src="http://api.mtgdb.info/content/hi_res_card_images/'+ $scope.cardId +'.jpg"/>');
		$timeout(function(){
			$scope.loadingSpinner = false;
			$('#cardModal').modal();
		}, 300);


	

		
	};
	

	$scope.pagination = function(setCount){
		$scope.currentPage = 0;
	    $scope.pageSize = 50;
	    $scope.data = [];
	    $scope.numberOfPages=function(){
	        return Math.ceil($scope.data.length/$scope.pageSize);                
	    }
	    console.log(setCount);
	    for (var i=0; i<setCount; i++) {
	        $scope.data.push("Item "+i);
	    }
	};
		


}]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
mtgApp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});



