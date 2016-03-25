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

.run(function($ionicPlatform, $rootScope, $timeout, GeoAlert) {
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

    var plot = cordova.require("cordova/plugin/plot");
        plot.init();
        console.log('after plot init');
    plot.isEnabled(function(enabled) {
    var plotEnabledState = enabled ? "enabled" : "disabled";
    console.log("Plot is " + plotEnabledState);
}, function (err) {
    console.log("Failed to determine whether Plot is enabled: " + err);
});
    //------------Track Geo location
       //Begin the service
    //hard coded 'target'
   /*
    var lat = 19.187632;
    var long = 73.223518;
    function onConfirm(idx) {
      console.log('button '+idx+' pressed');
    }
    
    GeoAlert.begin(lat,long, function() {
      
      console.log('TARGET');
      GeoAlert.end();
      navigator.notification.confirm(
        'You are near a target!',
        onConfirm,
        'Target!',
        ['Cancel','View']
      );
      
    });
    */
    //------------Track Geo location end


    //----------------

   /* if (window.cordova) {
        document.addEventListener("deviceready", function() {
        window.plugin.notification.local.onadd = onReminderAdd : function(id, state, json) {
          $timeout(function() {
            $rootScope.$broadcast('onReminderAdded', id, state, json)
          }, 100);
        };
        window.plugin.notification.local.onclick = onReminderClick: function(id, state, json) {
          $timeout(function() {
            $rootScope.$broadcast('onReminderClick', id, state, json)
          }, 100);
        };
        window.plugin.notification.local.oncancel = onReminderCancel: function(id, state, json) {
          $timeout(function() {
            $rootScope.$broadcast('onReminderCancel', id, state, json)
          }, 100);
        }; 
        window.plugin.notification.local.ontrigger = onReminderTrigger: function(id, state, json) {
          $timeout(function() {
            $rootScope.$broadcast('onReminderTrigger', id, state, json)
          }, 100);
        };
     }, false); */
      
    $rootScope.$on('$cordovaLocalNotification:schedule',
      function (event, notification, state) {
        console.log("SCHEDULE");
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
      });

    $rootScope.$on('$cordovaLocalNotification:trigger',
      function (event, notification, state) {
        console.log("TRIGGER");
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
      });

    $rootScope.$on('$cordovaLocalNotification:update',
      function (event, notification, state) {
        console.log('UPDATE');
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
      });

    $rootScope.$on('$cordovaLocalNotification:cancel',
      function (event, notification, state) {
        console.log('CANCEL');
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
      });

    //----------------

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
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
