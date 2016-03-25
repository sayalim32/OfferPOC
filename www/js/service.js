angular.module('starter.services', [])

.factory('$routeParams', function($stateParams) {
  return $stateParams;
})

.factory('GeoAlert', function() {
   console.log('GeoAlert service instantiated');
   var interval;
   var duration = 6000;
   var long, lat;
   var custLat;
   var custLong;
   var processing = false;
   var callback;
   var minDistance = 0.25;
    
   // Credit: http://stackoverflow.com/a/27943/52160   
   function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
   }
  
   function deg2rad(deg) {
    return deg * (Math.PI/180)
   }
   
   function hb() {
      console.log('hb running');
      if(processing) return;
      processing = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        processing = false;
        console.log(lat, long);
        custLat =position.coords.latitude;
        custLong = position.coords.longitude;
       // console.log('custlat :custlong ',custLat, custLong);
        var dist = getDistanceFromLatLonInKm(lat, long, position.coords.latitude, position.coords.longitude);
        console.log("dist in km is "+dist);
        if(dist <= minDistance) callback();
      });
   }
   
   return {
     begin:function(lt,lg,cb) {
       long = lg;
       lat = lt;
       callback = cb;
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

.service('PullOffersService', function() {

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
 }
 return {
   currlocation : currlocation,
   getcurrlocation : getcurrlocation
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
    console.log(offerCatArr[0].catEnabled);
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

/*
var offerCatarray = [];

var setCategories = function(){
angular.forEach(cat, function(category){
  if(category.catEnable='true'){
    offerCategories.push(category.catId);
  }
return 'true';  
});
console.log(offerCategories[0]);
};
*/
});