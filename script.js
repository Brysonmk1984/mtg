var mtgApp = angular.module('mtgApp', []);

mtgApp.factory('mtgFactory', function($http){
	var factory = {};
	// SERVICE - AUTO - Gets all card sets
	factory.getMtgCardSet = function(){
		return $http.get('backend/setOptions.json');
	};
	// SERVICE - AUTO & MANUAL - Gets data from specific set
	factory.getMtgData = function(selectedSet){
		return $http.get('backend/mtgGenData/'+selectedSet+'.json');
	};
	//SERVICE - AUTO - Get specific card price
	factory.getPriceJson = function(){
		return $http.get('backend/master_prices.json');
		
	};
	 return factory;
});

mtgApp.controller('cardsterCtrl',['$scope','$http', 'mtgFactory', '$timeout', function($scope, $http, mtgFactory, $timeout){
	if(window.innerWidth <= 765){
		$scope.mobileShowFilters = false;
	}else{
		$scope.mobileShowFilters = true;
	}
	$scope.toggleFilters = function(){
		if($scope.mobileShowFilters){
			$scope.mobileShowFilters = false;console.log($scope.mobileShowFilters);
		}else{
			$scope.mobileShowFilters = true;console.log($scope.mobileShowFilters);
		}
	};
	/* This is the callback shared by both  AJAX calls below */
	var handleAllCards = function(data){
		$scope.loadingSpinner = false
		$scope.mtgData = data;
		$scope.setCount = data.data.length;
		console.log($scope.mtgData);
		$scope.pagination();
	};



	/* ON LOAD AJAX calls - first gets a list of sets, then on success, gets the data of the latest set */
	mtgFactory.getMtgCardSet().success(function(data){
		var defaultSet = 'soi';
		$scope.setOptions = data;
		console.log($scope.setOptions);
		var selectedSet = $.grep($scope.setOptions,function(item){
			if(item.id === defaultSet){
				return item;
			}
			
		});
		console.log('ss', selectedSet);
		$scope.select.set = selectedSet[0].id;

		mtgFactory.getMtgData($scope.select.set).then(handleAllCards);
	});
	
	/* ON CHANGE AJAX call... should do exact same thing the on load AJAX call does */
	$scope.loadSet = function(){
		$scope.loadingSpinner = true;
		mtgFactory.getMtgData($scope.select.set).then(handleAllCards);
		//resetPagination();
	};


	var handleCardTypes = function(data){
		$scope.mtgCardType = data;
	};
	// Another Ajax call to get card types

	var handlePriceObject = function(data){
		cardPriceObj = data;
		console.log(data);

	};
	//AJAX call to get local json object
	mtgFactory.getPriceJson().success(handlePriceObject);

	var handleSpecificCard = function(data){
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
	
	// Get a specific card
	$scope.getCard = function(card){
		$scope.card = card;
		mtgFactory.getCard(card).then(handleSpecificCard);
		//resetPagination();
	};
	/* JSON data */
	var cardPriceObj = {};
	var getSpecificPrice = function(set,card){
		if(typeof cardPriceObj[set][card] === 'undefined'){
			$scope.mtgCardPrice = 'Unavailable';
		}else{
			$scope.mtgCardPrice = cardPriceObj[set][card];
		}
	};

	$scope.select = {
		set : ""
	};
	
	// Functionality for more card info modal
	$scope.launchModal = function(card){
		$scope.loadingSpinner = true;
		$scope.cardInfo = card;
		console.log('clicked card', card);
		


		var cardConvertedName = $scope.cardInfo.title.replace(/ /g,"-").replace(/'|,/g,"").toLowerCase();

	
	
		var setCode = $scope.cardInfo.set;
			console.log(cardConvertedName,setCode);

		var setTitle = $.grep($scope.setOptions,function(item){
			if(item.id === card.set){
				return item;
			}
			
		})[0].name;

		console.log('set title, card title',setTitle, $scope.cardInfo.title);

		getSpecificPrice(setTitle, $scope.cardInfo.title);

		$("#largeCardImageContainer").html('<img id="largeCardImage" src="'+ $scope.cardInfo.src +'"/>');
		$timeout(function(){
			$scope.loadingSpinner = false;
			$('#cardModal').modal();
		}, 300);


	
		console.log($scope.cardInfo);
		
	};

	/* Color Dropdown */
	$scope.normalize = {
		colors : [
		{label : "White", value : "w"},
		{label : "Black", value : "b"},
		{label : "Red", value : "r"},
		{label : "Blue", value : "u"},
		{label : "Green", value : "g"},
		{label : "Colorless", value : "A"},
		{label : "Multicolored", value : "M"},
		],
		rarity : [
		{label : "Common", value : "c"},
		{label : "Uncommon", value : "u"},
		{label : "Rare", value : "r"},
		{label : "Mythic Rare", value : "m"},
		{label : "Land", value : "l"}
		],
		type : [
		{label : "Creature", value : "Creature"},
		{label : "Instant", value : "Instant"},
		{label : "Sorcery", value : "Sorcery"},
		{label : "Enchantment", value : "Enchantment"},
		{label : "Equipment", value : "Equipment"},
		{label : "Artifact", value : "Artifact"},
		{label : "Land", value : "Land"}
		],


		getColor : function(code){
			var color;
			if(code === "w"){
				color = "white";
			}else if(code === "b"){
				color = "black";
			}else if(code === "r"){
				color = "red";
			}else if(code === "g"){
				color = "green";
			}else if(code === "u"){
				color = "blue";
			}else if(code === "c"){
				color = "colorless";
			}
			return color;
		}
	};

	//Pagination function - Enables pagination on app
	$scope.pagination = function(){//console.log($scope.filteredSet.length);
		$scope.currentPage = 0;
	    $scope.pageSize = 50;
	    $scope.data = [];
	    $scope.numberOfPages=function(){
	        return Math.ceil($scope.data.length/$scope.pageSize);                
	    }
	    //console.log(setCount);
	    for (var i=0; i<$scope.setCount; i++) {
	        $scope.data.push("Item "+i);
	    }
	};

	// Reset pagination function used when a new set is selected or a user searches for a specific card
	$scope.resetPagination = function(){
		return $scope.currentPage = 0;
	}	

}]);
	
//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter

mtgApp.filter('startFrom', function() {
    return function(input, start) {
    	input = input || [0];
        start = +start || 0; //parse to int
        //console.log(input,start);
        return input.slice(start);
    }
});

