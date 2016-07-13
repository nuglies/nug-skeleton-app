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
	var customerid = $scope.nugProfile[0].customer_id;
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

function getSensors(sensorFeed) {

//sensorObj = sensor feed

asyncSensors.getSensorsForCompany(customerid).then(function(sensorData) {


    //console.log(sensorData);

    //for demo purposes only, run through feedLooper for each Sensor in sensorlist


    //console.log($scope.settingsObj);

    var chartArr = {};
    for(var i=0;i<sensorData.length;i++) {


        var sensorGS = sensorData[i].growState.toLowerCase();




        for(var x=0;x<$scope.settingsObj.length;x++) {

            if($scope.settingsObj[x].growState.toLowerCase() == sensorGS) {

            //console.log("sensorGS: " + sensorGS + " is key: " + x);
            var gsKey = x;

            }

        }



        chartArr[sensorGS] = feedLooper(sensorData[i],sensorFeed,gsKey);
    }

    console.log(chartArr);

    $scope.chartData = chartArr;

  	//return sensorData;


    });


}




function lightCycle(settingsObj,sensorFeed) {



    var dateOnly = sensorFeed.dateTime.split("T");
    //console.log(sensorFeed);

    var lightsOff = new Date(dateOnly[0] + " " +settingsObj.lightsOff.time);
    var settingsHourOff = lightsOff.getHours();

    var lightsOn = new Date(dateOnly[0] + " " +settingsObj.lightsOn.time);

    var settingsHourOn = lightsOn.getHours();


    var recDate =   new Date(sensorFeed.dateTime);
    var recTime = recDate.getHours();

    //if lightsOn time is later than lightsOff time than do we need to flip the logic????
    if(settingsHourOn > settingsHourOff) {

        var setForDark = true;

    } else {
        var setForDark = false;
    }

    var lightsOnRsp = 0;

    if(recTime > settingsHourOn && recTime < settingsHourOff) {
       // console.log(recTime);
       // console.log("is between");
       // console.log(" turn on: " + settingsHourOn + " and turn off: " + settingsHourOff )


        if(setForDark == true) {

           // console.log("should be dark");
            lightsOnRsp = 0;
        } else {

            //console.log("should be light");
            lightsOnRsp = 1;

        }




    } else if (recTime == settingsHourOn) {
      //  console.log(recTime + " hour equals " + settingsHourOn + " on - compare minutes");

        var settingsMinOn = lightsOn.getMinutes();
        var settingsMinOff = lightsOff.getMinutes();
        var recMin = recDate.getMinutes();
       // console.log(settingsMinOn + " " + recMin + " " + settingsMinOff);
        //lights should turn on this hour
        //as long as the record minutes are greater than the setting minutes

        if(recMin > settingsMinOn) {
            lightsOnRsp = 1;
        } else {
            lightsOnRsp = 0;
        }




    } else if (recTime == settingsHourOff) {
       // console.log(recTime+ " hour equals " + settingsHourOff + " off - compare minutes");

        var settingsMinOn = lightsOn.getMinutes();
        var settingsMinOff = lightsOff.getMinutes();
        var recMin = recDate.getMinutes();

       // console.log(settingsMinOn + " " + recMin + " " + settingsMinOff);
        //lights should turn off this hour
        //as long as the record minutes are greater than the settings minutes

        if(recMin > settingsMinOn) {
            lightsOnRsp = 0;
        } else {
            lightsOnRsp = 1;
        }



    } else {

    /*
        console.log(recTime);
        console.log("not between");
        console.log(" turn on: " + settingsHourOn+ " and turn off:" + settingsHourOff )
    */

        if(setForDark == true) {

           // console.log("should be dark");
            lightsOnRsp = 0;
        } else {

           // console.log("should be light");
            lightsOnRsp = 1;

        }
    }
    return lightsOnRsp;
}


function nugsLightComposite (sensorFeed) {
    var RGB = sensorFeed.RGB;
    var R = RGB.R;
    var G = RGB.G;
    var B = RGB.B;

    var W = RGB.R + RGB.G + RGB.B;


   // var par_R = parCalc(R);
   // var H = oneColorHSV(R,G,B);

    //console.log("white" + W);

    if (W <= 100) {
        recLight = 0;
    } else if (W > 100 && W <= 400) {

        //light levels are low - could be an error
       var recLight = -1;


    } else {
        //lights are on
       var recLight = 1;
    }
    //console.log("recLight: " + recLight);
    return recLight;
}


function chartObject (metaData, lightErr, tempErr, humidityErr) {
    this.metaData = metaData;
    this.lightErr = lightErr;
    this.tempErr = tempErr;
    this.humidityErr = humidityErr;

}

function feedLooper(sensorData,sensorFeed,gsKey) {


    //use gsKey (grow state of sensor to determine key for settings

    var settingsObj = $scope.settingsObj[gsKey];

   // console.log(settingsObj);





    var curDate = new Date();
    //for the first result get the dateTime for last update status

    var feed2Date =   new Date(sensorFeed[0].dateTime);
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

    var chartArr = {};
    var humidityArr = [];
    var tempArr = [];
    var lightArr = [];
    //chartArr[sensorData.growState] = [];
    for(var i=0;i<14;i++) {
    //loop through sensorFeed

    var recLight = nugsLightComposite(sensorFeed[i]);
    //console.log(recLight);



    var lightsOn = lightCycle(settingsObj.settings[0],sensorFeed[i]);

    if(lightsOn == 1) {
        var workingSettings =  settingsObj.settings[0].lightsOn;
    } else {
        var workingSettings = settingsObj.settings[0].lightsOff;
    }

    if(lightsOn == recLight) {
        var lightErr = 0;
    } else {
        var lightErr = 1;
    }

    lightArr[i] = lightErr;
    //console.log(workingSettings);


    var tempF = sensorFeed[i].tempF;


    if(tempF > workingSettings.heat[0].min && tempF < workingSettings.heat[0].max) {

        var tempErr = 0;
    } else {
        var tempErr = 1;

    }

    tempArr[i] = tempErr;

    var humidity = sensorFeed[i].humidity;

    if(humidity > workingSettings.humidity[0].min && humidity < workingSettings.humidity[0].max) {

        var humidityErr = 0;
    } else {
        var humidityErr = 1;
    }

    humidityArr[i] = humidityErr;

    //chartArr[sensorData.growState][i]['humidity'] = humidityErr;

    //we can make metaData a string and pass it to object to use as alt text


    //chartArr[i] = new chartObject(sensorData.sensorName, lightErr, tempErr, humidityErr);
    //console.log(chartData);

   /*
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

    */





    } //loop


    chartArr['temp'] = tempArr;
    chartArr['humidity'] = humidityArr;
    chartArr['light'] = lightArr;


    //console.log(chartArr);
    //var stages = Object.keys(chartArr);
    //console.log(stages);

    return chartArr;

}

function getSettings(sensorFeed) {
// called after sensorFeed returned
  asyncSensorSettings.getSettingsForCompany(customerid).then(function(sensorSettings) {
  	    $scope.sensorsettings = sensorSettings;

        console.log("sensorSettings");
        console.log(sensorSettings);
    	$scope.lightObj =  sensorSettings.data.par[0];
		var settingsObj =  sensorSettings.data.growStates;
		//console.log(settingsObj);

		//make it globally available
		$scope.settingsObj = settingsObj;


    var sensorFP =    JSON.parse(sensorFeed, function(k, v) {
      return v;        // return everything else unchanged
    });


    //for demo purposes only, run through feedLooper for each Sensor in sensorlist

    getSensors(sensorFP);


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
