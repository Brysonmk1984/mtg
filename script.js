var mtgApp = angular.module('mtgApp', []);

mtgApp.factory('mtgFactory', function($http){
	var factory = {};
	// SERVICE - AUTO - Gets all card sets
	factory.getMtgCardSet = function(){
		return $http.get('http://api.mtgdb.info/sets/');
	};
	// SERVICE - AUTO & MANUAL - Gets data from specific set
	factory.getMtgData = function(selectedSet){
		var defaultSet = "lea"
		var selectedSet = selectedSet || defaultSet;
		return $http.get('http://api.mtgdb.info/sets/'+ selectedSet +'/cards/');
	};
	// SERVICE - AUTO -  Gets all card types
	factory.getMtgCardTypes = function(){
		return $http.get('http://api.mtgdb.info/cards/types');
	};
	// SERVICE - MANUAL - Gets a specific card in entire MTG database
	factory.getCard = function(card){
		return $http.get('http://api.mtgdb.info/search/'+ card +'?start=0&limit=0');
	};
	//SERVICE - AUTO - Get specific card price
	factory.getPriceJson = function(){
		return $http.get('/backend/master_prices.json');
		
	};
	/*
	//SERVICE - MANUAL - Get specific card price
	factory.getPrice = function(cardConvertedName){
		return $http.get('/mtg/backend/master_prices.json');
		
	};*/
	 return factory;
});

mtgApp.controller('cardsterCtrl',['$scope','$http', 'mtgFactory', '$timeout', function($scope, $http, mtgFactory, $timeout){
	/* This is the callback shared by both  AJAX calls below */
	var handleAllCards = function(data,status){
		$scope.loadingSpinner = false
		$scope.mtgData = data;
		$scope.setCount = data.data.length;
		//console.log($scope.mtgData);
		$scope.pagination($scope.setCount);
	};


	/* Gets the data of the latest set, then  handles the data */
	var handleCardSet = function(data,status){
		$scope.mtgCardSet = data;
		console.log($scope.mtgCardSet);
		var latestSetNum = $scope.mtgCardSet.length -1;
		$scope.random = $scope.mtgCardSet[latestSetNum].name;
		//console.log($scope.mtgCardSet);
		var latestSetId = $scope.mtgCardSet[latestSetNum].id;
		//console.log(latestSetId);
		$scope.loadingSpinner = true;

		mtgFactory.getMtgData(latestSetId).then(handleAllCards);
		
	};

	/* ON LOAD AJAX calls - first gets a list of sets, then on success, gets the data of the latest set */
	mtgFactory.getMtgCardSet().success(handleCardSet);
	
	/* ON CHANGE AJAX call... should do exact same thing the on load AJAX call does */
	$scope.selectSet = function(set){
		$scope.loadingSpinner = true;
		$scope.selectedSet = set;
		//console.log($scope.selectedSet);
		var selectedSetId = returnSetId($scope.selectedSet);
		//console.log(selectedSetId);
		mtgFactory.getMtgData(selectedSetId).then(handleAllCards);
		resetPagination();
	};


	var handleCardTypes = function(data,status){
		$scope.mtgCardType = data;
	};
	// Another Ajax call to get card types
	mtgFactory.getMtgCardTypes().success(handleCardTypes);

	var handlePriceObject = function(data,status){
		cardPriceObj = data;
		console.log(data);
		console.log(111,cardPriceObj);
	};
	//AJAX call to get local json object
	mtgFactory.getPriceJson().success(handlePriceObject);

	var handleSpecificCard = function(data,status){
		$scope.mtgCard = data;
		handleAllCards($scope.mtgCard);
	};

	// Utility function to return the set id based on its name
	var returnSetId = function(name){
		var name = name;
		var setId;
		angular.forEach($scope.mtgCardSet, function(key, value){
			//console.log(key);
			if(key.name === name){
				setId =  key.id;
			}
		});
		return setId;
	};

	
	// Utility function for retrieving the card data from the cached object
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
	
	// Get a specific card
	$scope.getCard = function(card){
		$scope.card = card;
		mtgFactory.getCard(card).then(handleSpecificCard);
		resetPagination();
	};
	/* JSON data */
	var cardPriceObj;
	var getSpecificPrice = function(set,card){
		//console.log(card);
		$scope.mtgCardPrice = cardPriceObj[set][card];
		console.log(222, $scope.mtgCardPrice)
	};
	
	// Functionality for more card info modal
	$scope.launchModal = function(cardId){

		$scope.loadingSpinner = true;
		$scope.cardId = cardId;
		var clickedCardInfo = returnCardInfo($scope.cardId);
		$scope.cardInfo = clickedCardInfo;


		

		//$scope.cardInfo.description = $scope.cardInfo.description.replace(/\{|}/g,' ');
		//console.log($scope.cardName);
		//console.log($scope.cardInfo);
		//console.log($scope.cardInfo.name);
		var cardConvertedName = $scope.cardInfo.name.replace(/ /g,"-").replace(/'|,/g,"").toLowerCase();
		//console.log(cardConvertedName);

	
		//console.log(cardPriceObj);
		
		getSpecificPrice($scope.cardInfo.cardSetName, $scope.cardInfo.name);

		$("#largeCardImageContainer").html('<img id="largeCardImage" src="http://api.mtgdb.info/content/hi_res_card_images/'+ $scope.cardId +'.jpg"/>');
		$timeout(function(){
			$scope.loadingSpinner = false;
			$('#cardModal').modal();
		}, 300);


	

		
	};
	
	//Pagination function - Enables pagination on app
	$scope.pagination = function(setCount){
		$scope.currentPage = 0;
	    $scope.pageSize = 50;
	    $scope.data = [];
	    $scope.numberOfPages=function(){
	        return Math.ceil($scope.data.length/$scope.pageSize);                
	    }
	    //console.log(setCount);
	    for (var i=0; i<setCount; i++) {
	        $scope.data.push("Item "+i);
	    }
	};

	// Reset pagination function used when a new set is selected or a user searches for a specific card
	$scope.resetPagination = function(){
		return $scope.currentPage = 0;
	}	
	
	// setTimeout(function(){
	// 	console.log($scope.random[0].value);
	// },4000)
}]);
	
//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
mtgApp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});



