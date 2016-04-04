// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova', 'starter.controllers', 'starter.services'])

//.constant('ApiEndpoint', {
  //url: 'http://mopstub-anpadhi.rhcloud.com/api'
//})

//console.log('ApiEndpoint'+ApiEndpoint)

.run(function($ionicPlatform, $rootScope, $timeout,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      //org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //window.localStorage.setItem("IsLaunched","YES");
    var plot = cordova.require("cordova/plugin/plot");
        plot.init();
        console.log('after plot init');
    plot.isEnabled(function(enabled) {
    var plotEnabledState = enabled ? "enabled" : "disabled";
    console.log("Plot is " + plotEnabledState);
}, function (err) {
    console.log("Failed to determine whether Plot is enabled: " + err);
});

    if(window.localStorage.getItem("external_load") == "YES"){
      console.log('inside getitem');
      window.localStorage.setItem("external_load","NO");
      var extload = window.localStorage.getItem("external_load");
      console.log("extload: ",extload);
      $state.go('app.pushoffernotify');
      
    };
var isauth= window.sessionStorage.getItem("user");
console.log('isauth startup: ', isauth);
    window.sessionStorage.setItem("IsLaunched","YES");
});

})



.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('app.search', {
    url: '/search',
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller : 'SettingsCtrl'
      }
    }
  })
/*
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller :'LoginCtrl'
      }
    }
  })
*/
  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrlTargated'
      }
    }
  })
  .state('app.pushoffer', { 
    url: '/pushoffer',
    views: {
      'menuContent': {
        templateUrl: 'templates/pushoffer.html'
      }
    }
  })

  .state('app.pushoffernotify', { 
    url: '/pushoffernotify',
    views: {
      'menuContent': {
        templateUrl: 'templates/pushoffernotify.html',
        controller: 'PushOfferNotifyCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});

function handleOpenURL(url) {  
      console.log('recieved url :' ,url);
      if(window.sessionStorage.getItem("IsLaunched")=="YES"){
         console.log("inside launched")
     var body = document.getElementsByTagName("body")[0];
      var mainController = angular.element(body).scope();
        mainController.reportAppLaunched(url);     
    }
    else{
     // console.log("external_load: ", window.localStorage.getitem("external_load"));
      window.localStorage.setItem("external_load","YES");
       
      }
  // write code with the 'url' param
  // to redirect to the corresponding page in your page
}
