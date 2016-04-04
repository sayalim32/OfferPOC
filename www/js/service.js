angular.module('starter.services', [])

.factory('$routeParams', function($stateParams) {
  return $stateParams;
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
        var isEnabled = localStorage.getItem(category.catId);
        console.log('category:',isEnabled,category.catId);
        if (isEnabled === 'YES') { 
          validCat = validCat.concat(category.catId,',');
          }
      })
      console.log('validcat :' ,validCat );
      return validCat;
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
});