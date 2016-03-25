angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope,PullOffersService) {
  console.log('inside PlaylistsCtrl');
  $scope.playlists = [   
    { title: 'Food & Dining', id: 'C001' },
    { title: 'Health & Beauty', id: 'C002' },
    { title: 'Clothing & Fashion', id: 'C003' },
    { title: 'Home & Electronics', id: 'C004' }
   // { title: 'Challenger', id: 4 },
   // { title: 'Harvey Norman', id: 5 },
   // { title: 'Courts', id: 6 }
  ];
  PullOffersService.currlocation();
})

.controller('SettingsCtrl',function($scope,$ionicModal,SettingsService){
console.log('inside SettingsCtrl');

 $scope.offerCategories = [
{ catId : 'C001', catText : 'Food & Dining' , catEnabled : 'YES'
},
{ catId : 'C002', catText : 'Health & Beauty' , catEnabled : 'YES'
},
{ catId : 'C003', catText : 'Clothing & Fashion' , catEnabled : 'YES'
},
{ catId : 'C004', catText : 'Home & Electronics' , catEnabled : 'YES'
}
];

  

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeSettings = function() {
    console.log('inside closesettings function');
    SettingsService.setCategories($scope.offerCategories);
    SettingsService.getCategories();
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openSettings = function() {
    console.log('inside opensetting function');
    var i =0;
    angular.forEach($scope.offerCategories, function(category){

      var isEnabled = localStorage.getItem(category.catId);
      $scope.offerCategories[i].catEnabled  = isEnabled;
      i=i+1;
      
    });
    $scope.modal.show();
  };

})

.factory('$cordovaGeolocation', ['$q', function ($q) {

    return {
      getCurrentPosition: function (options) {
        var q = $q.defer();

        navigator.geolocation.getCurrentPosition(function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        }, options);

        return q.promise;
      }
    };
  }])



.controller('PlaylistCtrl', function($scope, $http, $routeParams) {
  $scope.offerList =[];
  console.log($routeParams);
  //url: 'http://mopstub-anpadhi.rhcloud.com/api'
  

  $http.get('http://mopstub-anpadhi.rhcloud.com/api/offers')
    .success(function(response){
      angular.forEach(response, function(offer){
        if ($routeParams.playlistId==offer.categoryType){
          $scope.offerList.push(offer);
        }
      });
    });
})


.controller('PlaylistCtrlTargated', function($scope, $http, $routeParams,PullOffersService) {
  $scope.offerList =[];

  //url: 'http://mopstub-anpadhi.rhcloud.com/api'

$scope.pullofferURL = function(){
var latLong = PullOffersService.getcurrlocation();
console.log(latLong);
var lat = latLong.substring(0,latLong.indexOf(','));
var long = latLong.substring(latLong.indexOf(',')+1,latLong.length);
console.log('latitude :' ,lat,' ',long);
 var pullOffURL ='http://mopstub-anpadhi.rhcloud.com/api/offerLocations/pullOffers?custLat=';
 console.log(pullOffURL);
pullOffURL= pullOffURL.concat(lat,'&custLong=',long); 
return pullOffURL;
};


  $http.get($scope.pullofferURL())
    .success(function(response){
      angular.forEach(response, function(offer){
        if ($routeParams.playlistId==offer.categoryType){
          $scope.offerList.push(offer);
        }
      });
    });
})

.controller('PushOfferCtrl', function($scope, $http,$ionicModal,PullOffersService,SettingsService) {

$scope.offerList =[];

  //url: 'http://mopstub-anpadhi.rhcloud.com/api'
console.log('inside pushofferctrl');
$scope.categories = "";
$scope.pullofferURL = function(){
var latLong = PullOffersService.getcurrlocation();
$scope.categories = SettingsService.getCategories();
console.log('categories:' ,$scope.categories);
console.log(latLong);
var lat = latLong.substring(0,latLong.indexOf(','));
var long = latLong.substring(latLong.indexOf(',')+1,latLong.length);
console.log('latitude :' ,lat,' ',long);
 var pullOffURL ='http://mopstub-anpadhi.rhcloud.com/api/offerLocations/pulloffers?custLat=';
 console.log(pullOffURL);
pullOffURL= pullOffURL.concat(lat,'&custLong=',long); 
return pullOffURL;
};

  $ionicModal.fromTemplateUrl('templates/pushoffer.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeOffer = function() {
    console.log('inside closeoffer function');
    $scope.offerList =[];
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openOffer = function() {
    console.log('inside openoffer function');
    $http.get($scope.pullofferURL())
    .success(function(response){
      var flag = true;
      angular.forEach(response, function(offer){
        if ($scope.categories.includes(offer.categoryType) && flag === true){
            $scope.offerList.push(offer);
            flag = false;
        }
      });
    });
    $scope.modal.show();
  };
})
/*
.controller('PushOfferCtrl', function($scope, $http,PullOffersService,SettingsService) {
  $scope.offerList =[];

  //url: 'http://mopstub-anpadhi.rhcloud.com/api'
console.log('inside pushofferctrl');
$scope.categories = "";
$scope.pullofferURL = function(){
var latLong = PullOffersService.getcurrlocation();
$scope.categories = SettingsService.getCategories();
console.log('categories:' ,$scope.categories);
console.log(latLong);
var lat = latLong.substring(0,latLong.indexOf(','));
var long = latLong.substring(latLong.indexOf(',')+1,latLong.length);
console.log('latitude :' ,lat,' ',long);
 var pullOffURL ='http://mopstub-anpadhi.rhcloud.com/api/offerLocations/pulloffers?custLat=';
 console.log(pullOffURL);
pullOffURL= pullOffURL.concat(lat,'&custLong=',long); 
return pullOffURL;
};


  $http.get($scope.pullofferURL())
    .success(function(response){
      var flag = true;
      angular.forEach(response, function(offer){
        if ($scope.categories.includes(offer.categoryType) && flag === true){
            $scope.offerList.push(offer);
            flag = false;
        }
      });
    });
})
*/

.controller('SampleController',
  function ($scope, $cordovaLocalNotification, $ionicPlatform, $cordovaGeolocation) {
    $ionicPlatform.ready(function () {

  if (ionic.Platform.isWebView()) {

    function showMap(coords) {
      var mapOptions = {
        center: { lat: coords.latitude, lng: coords.longitude},
        zoom: 8
      };
      var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    }
    var longitude;
    var latitude;
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    

      $scope.scheduleInstantNotification = function () {
        $cordovaLocalNotification.schedule({
          id: 1,
          text: 'Instant Notification',
          title: 'Instant'
        }).then(function () {
          alert("Instant Notification set");
        });;
      };

      $scope.scheduleDelayedNotification = function () {
        var now = new Date().getMilliseconds();
        var _5SecondsFromNow = new Date(now + 5000);

        $cordovaLocalNotification.schedule({
          id: 2,
          at: _5SecondsFromNow,
          text: 'Notification After 5 Seconds Has Been Triggered',
          title: 'After 5 Seconds'
        }).then(function (result) {
          console.log('After 5 sec Notification Set');
        });
      };

      //Scheduled Every X Seconds / Minutes
      //Every Options: second, minute, hour, day, week, month, year
      $scope.scheduleEveryMinuteNotification = function () {

        $cordovaLocalNotification.schedule({
          id: 3,
          title: 'Your location',
          text: "longitude: " + longitude + " latitude: " + latitude,
          every: 'minute'
        }).then(function (result) {
          console.log('Every Minute Notification Set');
        });

      };


      // Update a Scheduled Notification
      $scope.updateNotificationText = function () {
        $cordovaLocalNotification.isPresent(3).then(function (present) {
          if (present) {
            $cordovaLocalNotification.update({
              id: 3,
              title: 'Notificaton  Update',
              text: 'Notification Update Details'
            }).then(function (result) {
              console.log('Updated Notification Text');
            });
          } else {
            alert("Must Schedule Every Minute First");
          }
        });
      };

      $scope.updateNotificationEvery = function () {
        $cordovaLocalNotification.isPresent(3).then(function (present) {
          if (present) {
            $cordovaLocalNotification.update({
              id: 3,
              title: 'Notification  Update',
              text: 'Every Minute change to second',
              every: 'second'

            }).then(function (result) {
              console.log('Updated Notification Every');
            });
          } else {
            alert("Must Schedule Every Minute First");
          }
        });
      };

      //Cancel a Notification
      $scope.cancelNotification = function () {
        $cordovaLocalNotification.isPresent(3).then(function (present) {
          if (present) {
            $cordovaLocalNotification.cancel(3).then(function (result) {
              console.log('Notification EveryMinute Cancelled');
              alert('Cancelled Offer Notification');
            });
          } else {
            alert("Must Schedule Every Minute First");
          }
        });
      };
    }
    });
  });