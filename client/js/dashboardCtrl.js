'use strict';

nugNgApp.controller('dashboardCtrl', ['$scope', '$http','asyncSensorSettings','asyncSensorFeed','asyncSensors','store', function($scope, $http, asyncSensorSettings,asyncSensorFeed,asyncSensors,store) {

  var init = function() {


  //$scope.things = sensorFeed;

  //var sf = sensorFeed.getAll();
//todo: set customerid
    $scope.isOffline = 0;
    $scope.timeAgo = "";
  	$scope.nugProfile = store.get('nugProfile');
	console.log($scope.nugProfile);
	var customerid = $scope.nugProfile.customerid;
	var userid = $scope.nugProfile.userid;

function formatTimeAgo(dateDiff) {
    var date = new Date(dateDiff);
    var str = 'Last update ';
    str += date.getUTCDate()-1 + " days ";
    str += date.getUTCHours() + " hours ";
    str += date.getUTCMinutes() + " minutes ";
    str += date.getUTCSeconds() + " seconds ";
    //    str += date.getUTCMilliseconds() + " millis";
    str += "ago";
    return str;


}


function oneColorXYZ(R,G,B) {
    var myColor = one.color('rgb('+R+','+ G+','+ B+')');

    var xyz = myColor.xyz();
    //console.log(xyz);
    return xyz;

}


function oneColorHSV(R,G,B) {
    var myColor = one.color('rgb('+R+','+ G+','+ B+')');
    var hsv = myColor.hsv();
    //console.log(hsv);
    return hsv;


}

function oneColorLab(R,G,B) {
    var myColor = one.color('rgb('+R+','+ G+','+ B+')');
    var lab = myColor.lab();
    //console.log(hsv);
    return lab;


}
function xyzToyxy(X,Y,Z) {
    var Y = Y
    var x = X / ( X + Y + Z )
    var y = Y / ( X + Y + Z )

    var yxy = [x,y];

    return yxy;

}

/*
//moved sort to mongo
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
*/

function xyzTocieLuv(X,Y,Z) {
    var var_U = ( 4 * X ) / ( X + ( 15 * Y ) + ( 3 * Z ) );
    var var_V = ( 9 * Y ) / ( X + ( 15 * Y ) + ( 3 * Z ) );

    var var_Y = Y / 100;

    if ( var_Y > 0.008856 )

    {
        var_Y = Math.pow(var_Y ,  1/3 );

    }
    else {
        var_Y = ( 7.787 * var_Y ) + ( 16 / 116 )
    }
    var ref_X =  95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;

    var ref_U = ( 4 * ref_X ) / ( ref_X + ( 15 * ref_Y ) + ( 3 * ref_Z ) );
    var ref_V = ( 9 * ref_Y ) / ( ref_X + ( 15 * ref_Y ) + ( 3 * ref_Z ) );

    var CIEL = ( 116 * var_Y ) - 16;
    var CIEu = 13 * CIEL * ( var_U - ref_U );
    var CIEv = 13 * CIEL * ( var_V - ref_V );

    var CIE = [CIEL,CIEu,CIEv];
    return CIE;
}



function xyzTocieLab(x,y,z) {

    var ref_X = 95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;


    var var_X = x / ref_X;          //ref_X =  95.047
    var var_Y = y / ref_Y;         //ref_Y = 100.000
    var var_Z = z / ref_Z;        //ref_Z = 108.883

    if ( var_X > 0.008856 )

    {
     var_X = Math.pow(var_X , 1/3 );
    }

    else
    {
    var_X = ( 7.787 * var_X ) + ( 16 / 116 );
    }
    if ( var_Y > 0.008856 ) {
     var_Y = Math.pow(var_Y , 1/3 );
     }
    else {
    var_Y = ( 7.787 * var_Y ) + ( 16 / 116 );
    }
    if ( var_Z > 0.008856 ) {
     var_Z = Math.pow(var_Z, 1/3 );
     }
    else  {
                       var_Z = ( 7.787 * var_Z ) + ( 16 / 116 );
                       }


    var CIEL = ( 116 * var_Y ) - 16;
    var CIEa = 500 * ( var_X - var_Y );
    var CIEb = 200 * ( var_Y - var_Z );

    var CIE = [CIEL,CIEa,CIEb];

    return CIE;
}

function getSensors(sensorObj) {

//sensorObj = sensor feed

asyncSensors.getSensorsForCompany(customerid).then(function(sensorData) {


    //console.log(sensorData);

    //for demo purposes only, run through feedLooper for each Sensor in sensorlist

    for(var i=0;i<sensorData.length;i++) {
        feedLooper(sensorData[i],sensorObj);
    }

  	//return sensorData;


    });
}


function feedLooper(sensorData,sensorObj) {
 var curDate = new Date();

    //console.log(curDate);



    //for the first result get the dateTime for last update status

    var feed2Date =   new Date(sensorObj[0].dateTime);
    //console.log(feed2Date);
    var dateDiff = curDate - feed2Date;
    // threshold in hours
    var timeThreshold = 3;
    // multiple time threshold by 1000 (MS) then 60 (seconds) then 60 (minutes);
    var timeThresholdMS = timeThreshold * 1000*60*60;

    if (dateDiff >= timeThresholdMS) {
    // last update is older than max threshold
    // alert alert alert !!! nug is offline
    var timeAgo = formatTimeAgo(dateDiff);
    //console.log(timeAgo);
    $scope.isOffline = 1;
    $scope.timeAgo = timeAgo;

    }
    console.log(sensorData.growState);

    for(var i=0;i<10;i++) {
    //loop through sensorFeed
   // console.log(sensorObj[i]);
    var tempF = sensorObj[i].tempF;
    var humidity = sensorObj[i].humidity;
    var RGB = sensorObj[i].RGB;
    var R = RGB.R;
    var G = RGB.G;
    var B = RGB.B;
   // var par_R = parCalc(R);
   // var H = HSVCalc(R,G,B);
    var colorxyz = oneColorXYZ(R,G,B);
    //console.log(colorxyz);
    var colorlab = oneColorLab(R,G,B);
    //console.log(colorlab);

    var coloryxy = xyzToyxy(colorxyz._x,colorxyz._y,colorxyz._z);

    var colorlab = xyzTocieLab((colorxyz._x*100),(colorxyz._y*100),(colorxyz._z*100));
    //console.log(colorlab);
    var colorluv = xyzTocieLuv((colorxyz._x*100),(colorxyz._y*100),(colorxyz._z*100));
    //console.log("colorluv");
    //console.log(colorluv);


    var sensorGS = sensorData.growState.toLowerCase();
    //var gsKey = $scope.settingsObj.indexOf(sensorGS);


    console.log($scope.settingsObj);

    for(var x=0;x<$scope.settingsObj.length;x++) {

        if($scope.settingsObj[x].growState.toLowerCase() == sensorGS) {

        console.log("sensorGS: " + sensorGS + " is key: " + x);

        }

    }


/*

*/


    }

}

function getSettings(sensorFeed) {
// called after sensorFeed returned
  asyncSensorSettings.getSettingsForCompany(customerid).then(function(sensorSettings) {
  	    $scope.sensorsettings = sensorSettings;
        //console.log(sensorFeed);
    	$scope.lightObj =  sensorSettings.data.par[0];
		var settingsObj =  sensorSettings.data.growStates;
		console.log(settingsObj);

		//make it globally available
		$scope.settingsObj = settingsObj;


    var sensorObj =    JSON.parse(sensorFeed, function(k, v) {
      return v;        // return everything else unchanged
    });


    //for demo purposes only, run through feedLooper for each Sensor in sensorlist

    getSensors(sensorObj);


    //console.log(sensorObj);
	 // console.log($scope.sensorsettings);

    });
}

  asyncSensorFeed.getSensorFeed(customerid).then(function(sensorFeed) {


		//console.log(sensorFeed);
        getSettings(sensorFeed);







      });




  };

  init();

}])




nugNgApp.factory('sensorFeed', ['$http', function($http){

console.log('dashboard factory');
var o = {sensors:[]};

o.get = function(id) {
  return $http.get('/users/' + id).then(function(res){

    console.log(res.data);
    return res.data;
  });
};

o.getAll = function() {
    return $http.get('/dashboard').success(function(data){
      angular.copy(data, o.sensors);
      //console.log("posts data");
      console.log(data);
    });


  };




return o;

}]);


nugNgApp.factory('asyncSensorFeed', function($q, $http) {



  var getSensorFeed = function(customerid) {

    var deferred = $q.defer();

	var durl = "/dashboard";

	//console.log("post this: " + secretcode);
  $http.get(

  durl, {
  params: { customerid: customerid}
	}
  ).then(function(res){


	 deferred.resolve(res.data);

	//    return res.data;
	});
  return deferred.promise;

  };


	//console.log(getMessages);
  return {
    getSensorFeed: getSensorFeed
  };

});
