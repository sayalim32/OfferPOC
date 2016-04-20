angular.module('starter.services', ['ngStorage'])

.factory('$routeParams', function($stateParams) {
  return $stateParams;
})


.factory('GeoAlert', function($http,$cordovaLocalNotification,$rootScope,$state) {
   console.log('GeoAlert service instantiated');
   var interval;
   var duration = 60000;
   var long, lat;
   var custLat;
   var custLong;
   var processing = false;
   var callback;
   var minDistance = 0.25;
   var offercategories ="";
   var offerList =[];
   var datetime = new Date();
   var offerCatArr = [
{ catId : 'C001', catText : 'Food & Dining' , catEnabled : 'YES'
},
{ catId : 'C002', catText : 'Health & Beauty' , catEnabled : 'YES'
},
{ catId : 'C003', catText : 'Clothing & Fashion' , catEnabled : 'YES'
},
{ catId : 'C004', catText : 'Home & Electronics' , catEnabled : 'YES'
}
];

   function getCategories () {
      var i = 0;
      var validCat ="";
      offerCatArr.forEach(function(category) {
        var isEnabled = localStorage.getItem(category.catId);
        if (isEnabled === 'YES') { 
          validCat = validCat.concat(category.catId,',');
          }
        console.log('category:',isEnabled,category.catId);
       offerCatArr[i].catEnabled  = isEnabled;
        i=i+1;

      })
offercategories = validCat;
    }
   
   function success(pos){
    var crd = pos.coords;

  console.log('Your current position is:');
  custLat = crd.latitude;
  custLong = crd.longitude;
   var pullOffURL ='http://mopstub-anpadhi.rhcloud.com/api/offerLocations/pulloffers?custLat=';
        pullOffURL= pullOffURL.concat(custLat,'&custLong=',custLong); 
         $http.get(pullOffURL)
    .success(function(response){
       console.log('response recieved',processing);
      var flag = true;
      angular.forEach(response, function(offer){
        if (offercategories.includes(offer.categoryType) && flag === true){
           offerList.push(offer);
            flag = false;
        }
      });

      if(offerList.length>0){
          console.log('offerlist>0');
          processing = true;
          offerList=[];
          datetime = new Date();
          //var notText = "";
          //notText=notText.concat(offerList.offerDescription);
          $cordovaLocalNotification.schedule({
          id: 2,
          text: 'Click to view exciting offer in nearby stores!',
          title: 'CitiBankOffers',
          icon: 'res://drawable-hdpi/icon.png'
        }).then(function (result) {
          console.log('Notification sent');
        });
          
        }


});
    
   }

   function error(err){
console.warn('ERROR(' + err.code + '): ' + err.message);
   }
  
   function hb() {
      console.log('hb running');
        var options = {
       enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
        };

      if(processing){
        var now = new Date();
        var _4hoursbeforenow = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), datetime.getHours(), datetime.getMinutes() +5);
        console.log('now :' ,now);
        console.log('4hoursfromnow: ', _4hoursbeforenow);
        if(_4hoursbeforenow <= now){
          console.log('setting processing false');
          processing =false;
        }
        else {
          console.log('inside else');
          return;
        }
      } 
      //processing = true;
      if(localStorage.getItem('enablePush')==='YES'){
        console.log('inside scheduleNotification');
        getCategories();
        navigator.geolocation.getCurrentPosition(success, error);

    }
    else
    {
      console.log('Push Notification disabled');
    }
     $rootScope.$on('$cordovaLocalNotification:click',
      function (event, notification, state) {

      console.log('Notification clicked');
      $state.go('app.pushoffernotify');
    });
   }

   
   return {
     begin:function(lt,lg,cb) {
       long = lg;
       lat = lt;
      // callback = cb;
       interval = window.setInterval(hb, duration);
       hb();
     }, 
     end: function() {
       window.clearInterval(interval);
     },
     setTarget: function(lg,lt) {
       long = lg;
       lat = lt;
     }
   };
   
})

.service('PlaylistService', function($q) {
  return {
    playlists: [
      {
        id: 'C005',
        name: 'Home & Electronics',
      },
      {
        id: 'C003',
        name: 'Food & Dining',
      },
      {
        id: 'C002',
        name: 'Clothing & Fashion',
      }
    ],
    getPlaylists: function() {
      return this.playlists
    },
    getPlaylist: function(playlistId) {
      var dfd = $q.defer()
      this.playlists.forEach(function(playlist) {
        if (playlist.id === playlistId) dfd.resolve(playlist)
      })
      return dfd.promise
    }

  }
})

.service('PullOffersService', function(){

 var custLat ;
 var custLong;
 var currlocation = function(){
        navigator.geolocation.getCurrentPosition(function(position) {
        processing = false;
       // console.log(lat, long);
        custLat =position.coords.latitude;
        custLong = position.coords.longitude;
        console.log('custlat :custlong ',custLat, custLong);

      });
 };

 var getcurrlocation = function(){
  var custLatLong ="";
  custLatLong = custLatLong.concat(custLat,',',custLong);
  console.log('inside getcurlocation: ' ,custLatLong);
  return custLatLong;
 };

 var pullofferURL = function(){
  /*
var latLong = PullOffersService.getcurrlocation();
$scope.categories = SettingsService.getCategories();
console.log('categories:' ,$scope.categories);
console.log(latLong);
var lat = latLong.substring(0,latLong.indexOf(','));
var long = latLong.substring(latLong.indexOf(',')+1,latLong.length);*/
console.log('latitude :' ,custLat,' ',custLong);
 var pullOffURL ='http://mopstub-anpadhi.rhcloud.com/api/offerLocations/pulloffers?custLat=';
pullOffURL= pullOffURL.concat(custLat,'&custLong=',custLong); 
console.log(pullOffURL);
return pullOffURL;
};

 return {
   currlocation : currlocation,
   getcurrlocation : getcurrlocation,
   pullofferURL : pullofferURL
}
})

.service('SettingsService',function($q){
  return{
    offerCatArr : [
{ catId : 'C001', catText : 'Food & Dining' , catEnabled : 'YES'
},
{ catId : 'C002', catText : 'Health & Beauty' , catEnabled : 'YES'
},
{ catId : 'C003', catText : 'Clothing & Fashion' , catEnabled : 'YES'
},
{ catId : 'C004', catText : 'Home & Electronics' , catEnabled : 'YES'
}
],
  setCategories : function(offercategories){
    angular.forEach(offercategories, function(category){
    localStorage.setItem(category.catId, category.catEnabled);  
    });   
    offerCatArr = offercategories;
    //console.log(offerCatArr[0].catEnabled);
    },

    getCategories: function() {
      var validCat ="";
      this.offerCatArr.forEach(function(category) {
        var isEnabled = localStorage.getItem(category.catId)||'YES';
        console.log('category:',isEnabled,category.catId);
        if (isEnabled === 'YES') { 
          validCat = validCat.concat(category.catId,',');
          }
      })
      console.log('validcat :' ,validCat );
      return validCat;
    },
    setPushNotification : function(enablePush){
      console.log('inside setPushNotification');
      localStorage.setItem('enablePush',enablePush);
    }
    ,
    getPushNotification : function(){
       var enPush = localStorage.getItem('enablePush')||'YES';
       console.log('enablePush', enPush);
       return enPush;
    }
  }
})

.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (name == 'user' && pw == '1234') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.factory ('StorageService', function ($localStorage) {

var savedoffer = localStorage.getItem("savedoffer")||""; 
  $localStorage = $localStorage.$default({
  things: []
});
var _getAll = function () {
  return $localStorage.things;
};
var _add = function (thing) {
  console.log('inside add thing');
  $localStorage.things.push(thing);
  var jsonObj = thing;
    savedoffer = localStorage.getItem("savedoffer");
    savedoffer= savedoffer.concat(jsonObj.offerID,',');
    localStorage.setItem("savedoffer",savedoffer);
    console.log('savedoffer string: ',savedoffer);
    return savedoffer;
    
}
var _remove = function (thing) {
  console.log('inside remove thing');
  var jsonObj = thing;
    savedoffer= localStorage.getItem("savedoffer");
    savedoffer=savedoffer.replace(jsonObj.offerID+',','');
    localStorage.setItem("savedoffer",savedoffer);
    console.log('remove:', savedoffer);
  $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
  return savedoffer;
}

return {
    getAll: _getAll,
    add: _add,
    remove: _remove
  };
});