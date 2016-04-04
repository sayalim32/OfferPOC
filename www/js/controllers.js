angular.module('starter.controllers', ['starter.services'])


.factory('UserService', function ($rootScope, $q) {
        return {
            isAuthorized: function () {
              console.log('inside isauth function');
                if (window.sessionStorage.getItem('user') === null ) {
                    $rootScope.$broadcast('user.notAuthorized'); 
                    return false;
                }
                return true;
            },

            authorize: function (email, password) {
                deffered = $q.defer();
                // ...
                return deffered.promise;
            }
        };
    })

/*
.controller('AppCtrl', function($scope,$ionicModal, $timeout) {

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
*/
.controller('LoginCtrl', function ($scope, $state,UserService,$ionicPopup, $ionicModal,LoginService) {
  console.log('inside loginctrl');
  $scope.data = {};
  $scope.reportAppLaunched = function() {
    console.log("App Launched Via Custom URL");
   $state.go('app.pushoffernotify');
  }
        var initialized = false;

        $ionicModal.fromTemplateUrl('templates/login.html', function(modal) {
            $scope.modal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Open our new task modal
        $scope.openLogin = function() {
            $scope.modal.show();
        };

        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        $scope.doLogOut = function() {
          window.sessionStorage.setItem("user", null);
          var isauth= window.sessionStorage.getItem("user");
              console.log('logout: ', isauth);
            $scope.modal.show();
        };

    $scope.doLogin = function() {
      console.log('inside doLogin function');
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $scope.modal.hide();
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
        $scope.$on('user.notAuthorized', function(e) {
            if (!initialized) {
                initialized = true;
                //$scope.openModal();
                setTimeout( function() {$scope.openLogin()}, 500);
               window.sessionStorage.setItem("user", "AUTH");
               var isauth= window.sessionStorage.getItem("user");
              console.log('isauth: ', isauth);
               

            }
        });

        UserService.isAuthorized();
    })

/*
.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    console.log('inside loginctrl');
    $scope.data = {};
 
    $scope.login = function() {
      console.log('inside login1 function');
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('app');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})
*/
.controller("MainController", [ '$scope','$state',function($scope,$state) {

  $scope.reportAppLaunched = function() {
    console.log("App Launched Via Custom URL");
   $state.go('app.pushoffernotify');
  }

}])

.controller('PlaylistsCtrl', function($scope,PullOffersService) {
  console.log('inside PlaylistsCtrl');

 
  $scope.playlists = [   
    { title: 'Food & Dining', id: 'C001' },
    { title: 'Health & Beauty', id: 'C002' },
    { title: 'Clothing & Fashion', id: 'C003' },
    { title: 'Home & Electronics', id: 'C004' }
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

      var isEnabled = localStorage.getItem(category.catId)||'YES';
      $scope.offerCategories[i].catEnabled  = isEnabled;
      i=i+1;
      
    });
    $scope.modal.show();
  };

})

.controller('PlaylistCtrlTargated', function($scope, $http,$routeParams,PullOffersService,$ionicLoading,$timeout) {
  $scope.offerList =[];
  $scope.pulloffURL="";
   $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading..',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 200,
      showDelay: 500
  });
   $timeout(function () {
$ionicLoading.hide();
  }, 5000);
  $scope.$on('$ionicView.enter', function(e) {
     $http.get(PullOffersService.pullofferURL())
    .success(function(response){
      $ionicLoading.hide();
      console.log('response recieved');
      angular.forEach(response, function(offer){
        if ($routeParams.playlistId==offer.categoryType){
          $scope.offerList.push(offer);
        }
      });
    });
  });
 
})

.controller('PushOfferCtrl', function($scope, $http,$ionicModal,PullOffersService,SettingsService) {

$scope.offerList =[];

  //url: 'http://mopstub-anpadhi.rhcloud.com/api'
console.log('inside pushofferctrl');

$scope.categories = "";
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
    $scope.categories=SettingsService.getCategories();
    console.log('inside openoffer function');
    $http.get(PullOffersService.pullofferURL())
    .success(function(response){
      console.log('response recieved');
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

.controller('PushOfferNotifyCtrl', function($scope, $http,PullOffersService,SettingsService,$ionicLoading,$timeout) {
  $scope.offerList =[];

console.log('inside pushoffernotifyctrl');
 $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading..',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 200,
      showDelay: 500
  });
   $timeout(function () {
$ionicLoading.hide();
  }, 5000);
PullOffersService.currlocation();
$scope.categories = "";
$scope.$on('$ionicView.enter', function(e) {
  $scope.categories = SettingsService.getCategories();
  $http.get(PullOffersService.pullofferURL())
    .success(function(response){
      $ionicLoading.hide();
      console.log('response recieved');
      var flag = true;
      angular.forEach(response, function(offer){
        if ($scope.categories.includes(offer.categoryType) && flag === true){
            $scope.offerList.push(offer);
            flag = false;
        }
      });
    });
  });
});