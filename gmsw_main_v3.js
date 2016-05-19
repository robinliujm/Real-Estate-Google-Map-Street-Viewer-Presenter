
// define a javascript namespace for the object to prevent script collisions
GMSW = (typeof GMSW == "undefined") ? {} : GMSW;

// this is the Google Maps API developer key, unique to every domain. 
//more info: http://code.google.com/intl/sk/apis/maps/signup.html
GMSW.Key = "AIzaSyAeoWbu69WNABKko9bPeBv9KMl48Xp_gIA";  
// GoogleMaps URL with key and callback fuction.
GMSW.GoogleMapsURL = "https://maps.googleapis.com/maps/api/js?key=" + GMSW.Key + "&callback={CALLBACK}";


// default map type. can be G_NORMAL_MAP, G_SATELLITE_MAP, G_HYBRID_MAP, G_TERRAIN_MAP
GMSW.DefaultMapType = "G_NORMAL_MAP";

// the default width of the map and street view window
GMSW.DefaultViewWidth = "400px";
// the default height of the map window
GMSW.DefaultMapHeight = "300px";
// default height of the street view window
GMSW.DefaultStreetViewHeight = "300px";
// default max width of info window for marker.
GMSW.DefaultMaxWidthOfInfoWindow = 200;
//Border Color of Button(or image) Selected;
GMSW.DefaultColorSelected = "#F2B360";
//Border Color of Button(or image) Unselected;
GMSW.DefaultColorUnselected = "#cccccc";

GMSW.DefaultStartingYaw = 0;
GMSW.DefaultStartingPitch = 10;
GMSW.DefaultStreetViewMaxDistance = 100;
// the default map view zoom level (map zoom: 0-19, optimal is ~16.  
GMSW.DefaultMapZoomLevel = 15;
// the default street view zoom: 0-4, 1 is the default and optimal)
GMSW.DefaultStreetZoomLevel = 1.5;
// set 'true' to allow capturing of current yaw and pitch
GMSW.DefaultCaptureYP = true;

// the default id for the map DIV. 
//note that the result id will have the form gmsw_mapX, where X is the instance counter
GMSW.MapHolder = "gmsw_map";
// the default id for the street view DIV. 
//note that the result id will have the form gmsw_streetviewX, where X is the instance counter
GMSW.StreetViewHolder = "gmsw_streetview";

GMSW.MapControlHolder = "gmsw_mapcontrol";
GMSW.StreetControlHolder = "gmsw_streetcontrol";
GMSW.MapStreetControlHolder = "gmsw_mapstreetcontrol";

// default class name for the map DIV
GMSW.MapClass = "gmsw_map";
// default class name for the street view DIV
GMSW.StreetViewClass = "gmsw_streetview";
// default class name for the DIV that holds map and street view
GMSW.LayerClass = "gmsw_default";


// internal variables, please do not change until you know what you're doing
// the loading phase of the google maps API. 0 - not loaded, 1 - loading, 2 - loaded
GMSW.APIPhase = 2;  //Synchronously Loading the API,so set initial state to 2.
// instance counter
GMSW.Counter = 0;
// instance holder
GMSW.Instances = new Array();




	//Check if Street View is Available
	GMSW.CheckStreetViewAvailable = function(latLng, distance){
		var streetViewService = new google.maps.StreetViewService();
		streetViewService.getPanoramaByLocation(latLng, distance, function (streetViewPanoramaData, status) {
			if (status === google.maps.StreetViewStatus.OK) {
				// ok
				return true;
			} else {
				alert('no street view available in this range, or some error occurred /n');
				// no street view available in this range, or some error occurred
			}
		});
	}



	
	//convert map types from google map api V2 toV3
	GMSW.ConvertMapType = function (mt) {
		switch (mt) {
			case  "G_ROAD_MAP":
				return google.maps.MapTypeId.ROADMAP;
			case  "G_SATELLITE_MAP":
				return google.maps.MapTypeId.SATELLITE;
			case  "G_HYBRID_MAP":
				return google.maps.MapTypeId.HYBRID;
			case  "G_TERRAIN_MAP":
				return google.maps.MapTypeId.TERRAIN;
			default: 
				return google.maps.MapTypeId.ROADMAP;
		}
	}



	//convert facing direction (ie "southeast") to Yaw value
	GMSW.FacingDirectionToYaw = function (facingDirection){
		var yaw = null;
		typeof facingDirection == "undefined" ? facingDirection = null : facingDirection;
	
		if (facingDirection != null){
			switch(facingDirection.toLowerCase()) {
			case "north":
				yaw = 180;
				break;
			case "northeast":
				yaw = 225;
				break;
			case "east":
				yaw = 270;
				break;
			case "southeast":
				yaw = 315;
				break;
			case "south":
				yaw = 0;
				break;
			case "southwest":
				yaw = 45;
				break;
			case "west":
				yaw = 90;
				break;
			case "northwest":
				yaw = 135;
				break;
			default:
				yaw = null; //let the plugin to compute the heading based on its  latitude and longitude(or address)
			}  
		}
		return yaw;
	}
	


	//show map view, hide street view, and update map and street buttons (or images).
	GMSW.showMap =	function(index){
		
		typeof index == "undefined" ? index=0 : index;
		
		var MapObj = document.getElementById(GMSW.MapHolder + index);
		var StreetObj = document.getElementById(GMSW.StreetViewHolder + index);
		if (MapObj == null || StreetObj == null){ return false;}
		
		//get view controls for the map view, street view and Map &Street view. button (or image) element
		var btnMap = document.getElementById(GMSW.MapControlHolder + index); 
		var btnStreet = document.getElementById(GMSW.StreetControlHolder + index);  
		var btnMapStreet = document.getElementById(GMSW.MapStreetControlHolder + index); 
		if (btnMap == null || btnStreet == null || btnMapStreet == null){ return false;}
		
		if (GMSW.Instances[index].StartingLatLng == null){
			btnMap.style.opacity = 0.4;
			alert("No valid address or latitude and longitude to plot map. Returned message: " + GMSW.Instances[index].ReturnMessage);
			return false;
		}

		if (!GMSW.Instances[index].MapViewAvailable){
			btnMap.style.opacity = 0.4;
			//no map view available, display error messsage. GMSW.Instances[index].ReturnMessage:  return parameter. 
			alert("no map view available! Message returned: " + GMSW.Instances[index].ReturnMessage);
			return false;
		}
		btnMap.style.opacity = 1;

		if (MapObj.style.display != "none"){
						
			GMSW.Instances[index].GoogleMap.setCenter(GMSW.Instances[index].StartingLatLng);
			GMSW.Instances[index].GoogleMap.setZoom(GMSW.Instances[index].MapZoomLevel)
			GMSW.Instances[index].GoogleStreet.setPosition(GMSW.Instances[index].StartingLatLng);
			GMSW.Instances[index].GoogleStreet.setPov({
				heading: GMSW.Instances[index].StartingYaw,
				zoom: GMSW.Instances[index].StreetZoomLevel,
				pitch: GMSW.Instances[index].StartingPitch
			});
		}
		
		GMSW.ShowViews(true, false,index)
		btnMap.style.borderColor = GMSW.Instances[index].ControlOptions.ColorSelected;
		btnStreet.style.borderColor = GMSW.Instances[index].ControlOptions.ColorUnselected;
		btnMapStreet.style.borderColor = GMSW.Instances[index].ControlOptions.ColorUnselected;
		return true;
	}
	
	//show street view, hide map view, and update map and street buttons (or images).
	GMSW.showStreet =	function(index){
		
		typeof index == "undefined" ? index=0 : index;
		
		var MapObj = document.getElementById(GMSW.MapHolder + index);
		var StreetObj = document.getElementById(GMSW.StreetViewHolder + index);
		if (MapObj == null || StreetObj == null){ return false;}

		//get view controls for the map view, street view and Map &Street view. button (or image) element
		var btnMap = document.getElementById(GMSW.MapControlHolder + index); 
		var btnStreet = document.getElementById(GMSW.StreetControlHolder + index);  
		var btnMapStreet = document.getElementById(GMSW.MapStreetControlHolder + index); 
		if (btnMap == null || btnStreet == null || btnMapStreet == null){ return false;}

		if (GMSW.Instances[index].StartingLatLng == null){
			btnStreet.style.opacity = 0.4;
			alert("No valid address or latitude and longitude to plot street view. Returned message: " + GMSW.Instances[index].ReturnMessage);
			return false;
		}

		if (!GMSW.Instances[index].StreetViewAvailable){
			btnStreet.style.opacity = 0.4;
			//no street view available, display error messsage. GMSW.Instances[index].ReturnMessage:  return parameter. 
			alert("no street view available! Message returned: " + GMSW.Instances[index].ReturnMessage);
			return false;
		}
		btnStreet.style.opacity = 1;

		GMSW.ShowViews(false, true,index);		
		btnMap.style.borderColor = GMSW.Instances[index].ControlOptions.ColorUnselected;
		btnStreet.style.borderColor = GMSW.Instances[index].ControlOptions.ColorSelected;
		btnMapStreet.style.borderColor = GMSW.Instances[index].ControlOptions.ColorUnselected;
		
		return true;
	}


	//show map view, hide street view, and update map and street buttons (or images).
	GMSW.showMapStreet = function(index){
		
		typeof index == "undefined" ? index=0 : index;

		var MapObj = document.getElementById(GMSW.MapHolder + index);
		var StreetObj = document.getElementById(GMSW.StreetViewHolder + index);
		if (MapObj == null || StreetObj == null){ return false;}
		
		//get view controls for the map view, street view and Map &Street view. button (or image) element
		var btnMap = document.getElementById(GMSW.MapControlHolder + index); 
		var btnStreet = document.getElementById(GMSW.StreetControlHolder + index);  
		var btnMapStreet = document.getElementById(GMSW.MapStreetControlHolder + index); 
		if (btnMap == null || btnStreet == null || btnMapStreet == null){ return false;}
		
		if (GMSW.Instances[index].StartingLatLng == null){
			btnMapStreet.style.opacity = 0.4;
			alert("No valid address or latitude and longitude to plot map and street view. Returned message: " + GMSW.Instances[index].ReturnMessage);
			return false;
		}

		// If both map view and street view are not available , return false
		if (!GMSW.Instances[index].MapViewAvailable && !GMSW.Instances[index].StreetViewAvailable){
			btnMapStreet.style.opacity = 0.4;
			//GMSW.Instances[index].ReturnMessage:  return parameter.  "" is successful.
			var msg = "No map view available! Message returned: " + GMSW.Instances[index].ReturnMessage;
			msg += "\n No street view available! Message returned: " + GMSW.Instances[index].ReturnMessage;
			alert(msg);
			return false;
		}
		btnMapStreet.style.opacity = 1;

		MapObj.style.display = 'block';		
		if (typeof(google) != 'undefined'){
			//when map view div is in hidden and window size changes, the map view will not show properly.
			//so resize window event has to be fired, to let the map view div get the new window size.		
			google.maps.event.trigger(GMSW.Instances[index].GoogleMap, 'resize');
		}

		StreetObj.style.display = 'block';
		if (typeof(google) != 'undefined'){
			//when street view div is in hidden and window size changes, the map street will not show properly.
			//so resize window event has to be fired, to let the street view div get the new window size.		
			google.maps.event.trigger(GMSW.Instances[index].GoogleStreet, 'resize');
		}

		GMSW.Instances[index].GoogleMap.setCenter(GMSW.Instances[index].StartingLatLng);

		btnMap.style.borderColor = GMSW.Instances[index].ControlOptions.ColorUnselected;
		btnStreet.style.borderColor = GMSW.Instances[index].ControlOptions.ColorUnselected;
		btnMapStreet.style.borderColor = GMSW.Instances[index].ControlOptions.ColorSelected;


		if (!GMSW.Instances[index].MapViewAvailable){
			alert("No map view available! Message returned: " + GMSW.Instances[index].ReturnMessage);
		}else if (!GMSW.Instances[index].StreetViewAvailable){
			alert("No street view available! Message returned: " + GMSW.Instances[index].ReturnMessage);
		}

		return true;
	}
	
		
	
	//show map view or street view, or both or none. 
	GMSW.ShowViews = function(bMapView, //if true, show map view
							  bStreetView,  //if true, show street view
							  index  //GMSW instance index
							  ){	
		typeof index == "undefined" ? index=0 : index;

		var MapObj = document.getElementById(GMSW.MapHolder + index);
		var StreetObj = document.getElementById(GMSW.StreetViewHolder + index);
		if (MapObj == null || StreetObj == null){ return false;}

		if (bMapView){
			MapObj.style.display='block';
			//when street view div is in hidden and window size changes, the street view will not show properly.
			//so resize window event has to be fired, to let the street view div get the new window size.
			if (typeof(google) != 'undefined'){
				google.maps.event.trigger(GMSW.Instances[index].GoogleMap, 'resize');
			}
			if (GMSW.Instances[index].StartingLatLng != null){
				GMSW.Instances[index].GoogleMap.setCenter(GMSW.Instances[index].StartingLatLng);
			}
		}
		else{
			MapObj.style.display='none';
		}

		if (bStreetView){

			StreetObj.style.display='block';
			//when street view div is in hidden and window size changes, the street view will not show properly.
			//so resize window event has to be fired, to let the street view div get the new window size.
			try{
				google.maps.event.trigger(GMSW.Instances[index].GoogleStreet, 'resize');
			}catch(err) {}
		}
		else{
			StreetObj.style.display='none';
		}
		
		return true;
	}
		

// this function handles the queue for google maps instance creation. the instances can't load parallel
// because the asynchronous ajax calls terminates map loading in some cases (firefox)

GMSW.Queue = function(){
    // if google API is loading, skip execution
	if (GMSW.APIPhase==1)
    {
        return;
    }

	// traverse the instances
	for (i in GMSW.Instances)
    {
        // if a instance is not executed, execute it
		if (!GMSW.Instances[i]._isExecuted)
        {
            GMSW.Instances[i].LoadAPI();
            break;
        }
    }
}



// this function creates a Marker with a specified text
// if directions == true, it will add a link for directions
GMSW.CreateMarker = function(m, //marker constructor
							 forMap,  //if true, create marker for map, otherwise for street view
							 index //GMSW instance index
							 ){
	typeof index == "undefined" ? index=0 : index;
	
	var marker =  new google.maps.Marker({
			position: m.position,
			title:m.Text
		  });
	
	var infowindow = new google.maps.InfoWindow({maxWidth: GMSW.DefaultMaxWidthOfInfoWindow});
		
	var out = "";
	out += m.content.html;
	if (m.Directions)
	{
		out += "<form action='http://maps.google.com/maps' method='get' target='_blank'>" +
			   "<br/>Get directions from address:<br/>" +
			   "<input type='text' size='20' maxlength='40' name='saddr'' id='saddr' value='' /><br/>" +
			   "<input value='Get Directions' type='submit'>" +
			   "<input type='hidden' name='daddr' value='" + m.position.lat() + "," + m.position.lng() + "'/></form>";
	}
	
	marker.content = out;

	if (forMap){
		marker.setMap(GMSW.Instances[index].GoogleMap);
	}else{
		marker.setMap(GMSW.Instances[index].GoogleStreet);
	}
	
	
	if (m.DisplayText)
		{
		  google.maps.event.addDomListener(marker, 'click', function(e) {
				infowindow.setPosition(this.position); // set the position of infowindow
				infowindow.setContent(this.content); // set the content of infowindow
				if (forMap){
					infowindow.open(GMSW.Instances[index].GoogleMap, this);
				}else{
					infowindow.open(GMSW.Instances[index].GoogleStreet, this);
				}
		  });
		}

	return marker;
}


// this is the main function for map creation. for full description look at the start of this file or in the documentation
GMSW.Create = function(o)
{
    // define a new instance of the map/sw object

	this._obj = {
        Address : null,  // also accept string of latitude and longitude separated by ",",  for exmplae: "50.395246, -105.500470"
		LatLng : null,  //if nyll will use address to plot map view, street view and marker.
		
		StreetZoomLevel : GMSW.DefaultStreetZoomLevel, //street view zoom: 0-4, 1.5 is the default and optimal
        MapType : GMSW.DefaultMapType,
        MapZoomLevel : GMSW.DefaultMapZoomLevel,  //map zoom: 0-19, 16 is is the default and optimal

        ViewWidth : GMSW.DefaultViewWidth,
		MapHeight : GMSW.DefaultMapHeight,
        StreetViewHeight : GMSW.DefaultStreetViewHeight,
		CaptureYP : GMSW.DefaultCaptureYP, // set 'true' to allow capturing of current yaw and pitch

		Markers : {},


		// startingYaw = 0 : show view towards North
		// startingYaw = 90 : show view towards East
		// startingYaw = 180 : show view towards South
		// startingYaw = 270 : show view towards West
		StartingYaw : null,   //returned parameter
				
		// startingPitch = 0 : directly forwards
		// startingPitch = 90 : directly upwards
		// startingPitch = -90 : directly downwards
		StartingPitch : GMSW.DefaultStartingPitch,
		
		
		MainMarker: null,   //returned parameter
		CurrentYaw : -1, //return parameter. Current Yaw.
		CurrentPitch : -1,  //return parameter. Current Pitch.
		ReturnMessage : "",  //return parameter. error message
		StreetViewAvailable : false,  //return parameter. true: street view is available
		MapViewAvailable : false,  //return parameter. true: map view is available
		GoogleStreet : null,   //Google Panorama Object
		GoogleMap : null,  //Google Map Object
		StartingLatLng : null,  //return parameter.  Starting LatLng.



		ControlOptions : {
			ShowMapControl: true,
			ShowStreetControl: true,
			ShowMapStreetControl: true,
			ColorSelected: GMSW.DefaultColorSelected,
			ColorUnselected: GMSW.DefaultColorUnselected,
			ControlsOnTop: true,
		},



		// this is the url for google maps api
        _GoogleMapsURL: GMSW.GoogleMapsURL,
		_instance : "GMSW_" + GMSW.Counter,
		_counter : GMSW.Counter,
		_isExecuted : false,
    
        // this function will try to load the google maps API
		LoadAPI : function(){
           
			// add the new instance to the window object to be avaliable for callbacks
			eval("window." + this._instance + " = this;");

			// if google api is loaded, skip new loading and initialize the instance            
			if (GMSW.APIPhase==2)
			{
                this.Initialize();
				return;
			}
            else if (GMSW.APIPhase==1) // if the api is still loading, terminate
            {
                return;
            }
            else // if the api is not loaded, load it
            {
				GMSW.APIPhase = 1; // api is loading
                //load google maps api on demand
				var script = document.createElement("script");
                script.src = this._GoogleMapsURL.replace("{CALLBACK}", this._instance + ".Initialize");
                script.type = "text/javascript";
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        },


        // this function initializes the google maps api
		Initialize : function(){
         	//console.log(this);
			GMSW.APIPhase = 2; // api is loaded
			
			var self = eval("window." + this._instance);
			this._self = self;
		
			typeof self.Address == "undefined" ? self.Address = null : self.Address;
			typeof self.LatLng == "undefined" ? self.LatLng = null : self.LatLng;
			
			var z = self.MapZoomLevel;
			if(self.LatLng != null){
				var c = self.LatLng;
				self.StartingLatLng = new google.maps.LatLng(c)
				self.CreateMap(c,z);






				if (self.Address == 'undefined'|| self.Address == null || self.Address == "")
				{
					var geocoder = new google.maps.Geocoder;
					geocoder.geocode({latLng: self.LatLng }, function(responses){     
						if (responses && responses.length > 0) 
						{        
							self.Address = responses[0].formatted_address;
						} 
						else 
						{       
							alert('Not getting Any address for given latitude and longitude.');     
						}   
					});
				}





			}
			else if(self.Address != null && self.Address != "")
			{
				self.CreateGeo(self.Address,function(results,status){
					if(status === google.maps.GeocoderStatus.OK){
						var c = results[0].geometry.location;
						self.StartingLatLng = c;
						self.CreateMap(c,z);
					}else{
						self.ReturnMessage += 'Geocode was not successful for the following reason: ' + status + '\n';
						alert(self.ReturnMessage);
					}
				});
			}else{
				self.ReturnMessage += 'No valid address or latitude longitude provided' + '\n';
			}
			
			self._isExecuted = true; // the instance is executed
			GMSW.Queue(); // continue the queue 
		},
		
		//create google map object
		CreateMap : function(c,z){
			var self = eval("window." + this._instance);	
			var mO = {
                zoom: z,
				center: c,
                mapTypeId: GMSW.ConvertMapType(self.MapType)
			};
			self.GoogleMap = new google.maps.Map(document.getElementById(GMSW.MapHolder + self._counter),mO);
			google.maps.event.addListenerOnce(self.GoogleMap, 'idle', function(){
				self.MapViewAvailable = true;													
				self.CreateUI();
			});
		},
		
		// this function will create the actual map and street view
		CreateUI : function(){
			var self = eval("window." + this._instance);
			
			var mapHolder = document.getElementById(GMSW.MapHolder + GMSW.Counter);
			
			//center map to address or lat lng
			if (self.LatLng != null){
				self.StartingLatLng = new google.maps.LatLng(self.LatLng); 
			}
			if (self.StartingLatLng != null) {
				self.GoogleMap.setCenter(self.StartingLatLng);
			}
			
			// display markers
			var msg = "";
			for (i in self.Markers)
			{
				var m = self.Markers[i];
					typeof m.Text == "undefined" ? m.Text = "" : void(0);
					typeof m.Directions == "undefined" ? m.Directions = false : void(0);
					m.content = {html : m.Text};

				typeof self.LatLng == "undefined" ? self.LatLng = null : self.LatLng;
				typeof self.StartingLatLng == "undefined" ? self.StartingLatLng = null : self.StartingLatLng;
				
				if(m.LatLng != null){
					m.position = new google.maps.LatLng(m.LatLng);
					GMSW.CreateMarker(m, true,self._counter);
				}
				else if(m.Address != null){
					var m2 = m; 
					self.CreateGeo(m.Address,function(results,status){
						if(status === google.maps.GeocoderStatus.OK){
							m2.position = results[0].geometry.location;
							GMSW.CreateMarker(m2,true,self._counter);
						}
						else {
							alert("Could not geocode address: '" + m2.Address + "' for markers. this marker is not placed on map");
						}						
					})
				} 
				else { //no addr or latlng found, this is the main marker.
					if (self.LatLng != null){
						m.position = new google.maps.LatLng(self.LatLng);
						self.MainMarker = m;
						GMSW.CreateMarker(m,true,self._counter);
					}else if (self.StartingLatLng != null) {
						m.position = self.StartingLatLng;
						self.MainMarker = m;
						GMSW.CreateMarker(m,true,self._counter);
					}else {
						self.MainMarker = null;
						msg += "marker[" + i + "],";
					}						
				}
			}
			if (msg != ""){
				msg = "No valid address or latitude & longitudde for: " + msg + "these markers are not placed on map.";
				alert(msg);
			}
			
			// draw stree view
			self.CreateStreet(); 

		},
		
		CreateGeo : function(address,callback){
			var geocoder = new google.maps.Geocoder;
			geocoder.geocode({ 'address': address}, function(results,status){
				var arg = new Array(results,status)
					callback.apply(null,arg);
			});
		},
		
		CreateStreet : function(){
			var self = eval("window." + this._instance);
			var swHolder = document.getElementById(GMSW.StreetViewHolder + GMSW.Counter);
			
			var point;
			typeof self.LatLng == "undefined" ? self.LatLng = null : self.LatLng;
			if (self.LatLng != null){
				point = new google.maps.LatLng(self.LatLng);	
			}

			else{
				point = self.StartingLatLng;
			}			
			
			typeof self.StartingPitch == "undefined" ? self.StartingPitch = GMSW.DefaultStartingPitch : self.StartingPitch;
			
			var myPano = new google.maps.StreetViewPanorama(document.getElementById(GMSW.StreetViewHolder + self._counter));

			//add the street view overlay
			self.GoogleMap.setStreetView(myPano);
				
			// add a click handler to the map for street view
			google.maps.event.addListener(self.GoogleMap, 'click', function(e){
										myPano.setPosition(e.latLng); 
										});

			// compute the heading based on its latitude and longitude
			var streetViewPanoramaData;
			var streetViewService = new google.maps.StreetViewService();
			streetViewService.getPanoramaByLocation(point, GMSW.DefaultStreetViewMaxDistance, function (streetViewPanoramaData, status) {					
				if(status === google.maps.StreetViewStatus.OK){						
					
					myPano.setPosition(point);
					
					typeof self.MainMarker == "undefined" ? self.MainMarker = null : self.MainMarker;
					if (self.MainMarker != null)
					{
						//add main marker to street view
						self.MainMarker.position = point;
						GMSW.CreateMarker(self.MainMarker, false,self._counter);
					}

					
					typeof self.StartingYaw == "undefined" ? self.StartingYaw = null : self.StartingYaw;

					// if StartingYaw is given when calling the plugin, use it to set the heading of the street view
					if (self.StartingYaw != null)
					{
						myPano.setPov({
							heading: self.StartingYaw,
							zoom: self.StreetZoomLevel,
							pitch: self.StartingPitch
						});
					}
					else
					{
						var oldPoint = point;						
						var newpoint = streetViewPanoramaData.location.latLng;
						var heading = google.maps.geometry.spherical.computeHeading(newpoint,oldPoint);
						if (heading == null) {
							heading = GMSW.DefaultStartingYaw;
						}
						
						self.StartingYaw = heading;

						myPano.setPov({
							heading: heading,
							zoom: self.StreetZoomLevel,
							pitch: self.StartingPitch
						});
					}
					myPano.setVisible(true);	
					self.StreetViewAvailable = true;
				}
				else
				{
					// no street view available in this range, or some error occurred
					self.ReturnMessage += 'no street view available in this range, or some error occurred \n';
					alert(self.ReturnMessage);
				}
			});	

			if (self.CaptureYP)
			{
				self.CurrentYaw = self.StartingYaw;
				self.CurrentPitch = self.StartingPitch;
				// listener reacts to the yawchanged event on the streetview panorama
				myPano.addListener( "pov_changed", function() {
					self.CurrentYaw = myPano.getPov().heading;
					self.CurrentPitch = myPano.getPov().pitch;
				});
			}

			self.GoogleStreet = myPano;
						
		},  // end of CreateStreet

	}  // end of _obj
	
	
	// check if the parameter is a object
	if (typeof(o)=="object")
	{
		// dynamicly change attributes
		for (param in o)
		{
			try
			{
				eval("this._obj." + param + " = o[param];");
			}
			catch(ex)
			{
				// an error occured, check settings
				// debugger;
			}
		}
	}
	
	var htmlControls = "";
	// check if the layers for map/sv are already avaliable. if not, create them
	if (
		(!document.getElementById(GMSW.MapControlHolder + this._obj._counter))
		|| (!document.getElementById(GMSW.StreetControlHolder + this._obj._counter))
		|| (!document.getElementById(GMSW.MapStreetControlHolder + this._obj._counter))						 
		)
	{
		var style = "";
		if (this._obj.ControlOptions.ControlsOnTop)	{
			style += "border-bottom: none; ";
		}else{
			style += "border-top: none; ";
		}
		style +=  "border-color: " + this._obj.ControlOptions.ColorUnselected + "; ";
	
		//create view controls, available are: map view control, street view control, map & street view control
		htmlControls = "<div class='gmsw_button_group'>";
		
		if (!document.getElementById(GMSW.MapControlHolder + this._obj._counter)){
			var mStyle = this._obj.ControlOptions.ShowMapControl ? style + "display: table-cell;" : style + "display: none;";
			htmlControls += "<div id='" + GMSW.MapControlHolder + this._obj._counter;
			htmlControls += "' class='gmsw_button gmsw_map_button' style='" + mStyle + "'></div>";
		}
		
		if (!document.getElementById(GMSW.StreetControlHolder + this._obj._counter)){
			var sStyle = this._obj.ControlOptions.ShowStreetControl ? style + "display: table-cell;" : style + "display: none;";
			htmlControls += "<div id='" + GMSW.StreetControlHolder + this._obj._counter;
			htmlControls += "' class='gmsw_button gmsw_street_button' style='" + sStyle + "'></div>";
		}
			
		if (!document.getElementById(GMSW.MapStreetControlHolder + this._obj._counter)){
			var msStyle = this._obj.ControlOptions.ShowMapStreetControl ? style + "display: table-cell;" : style + "display: none;";
			htmlControls += "<div id='" + GMSW.MapStreetControlHolder + this._obj._counter;
			htmlControls += "' class='gmsw_button gmsw_map_street_button' style='" + msStyle + "'></div>";
		}
		
		htmlControls += "</div>";
	}
		
	var htmViews = "";
	// check if the layers for map/sv are already avaliable. if not, create them
	if ((!document.getElementById(GMSW.MapHolder + this._obj._counter))
		|| (!document.getElementById(GMSW.StreetViewHolder + this._obj._counter)))
	{
		var style = "style='max-width: " + this._obj.ViewWidth + "'";
		htmViews = "<div class='" + GMSW.LayerClass + "' " + style + ">";
		if (!document.getElementById(GMSW.MapHolder + this._obj._counter))
		{
			htmViews += "<div id='" + GMSW.MapHolder + this._obj._counter + "' class='" + GMSW.MapClass;
			htmViews += "' style='height: " + this._obj.MapHeight + "'></div>";
		}
		
		if (!document.getElementById(GMSW.StreetViewHolder + this._obj._counter))
		{
			htmViews += "<div id='" + GMSW.StreetViewHolder + this._obj._counter + "' class='" + GMSW.StreetViewClass;
			htmViews += "' style='height: " + this._obj.StreetViewHeight + "'></div>";
		}
		htmViews += "</div>"
	}



	if (htmlControls != "" || htmViews != "")
	{
		if (this._obj.ControlOptions.ControlsOnTop)	{
			document.write(htmlControls);
			document.write(htmViews);
		}else{
			document.write(htmViews);
			document.write(htmlControls);
		}
	}



	//get view controls for the map view, street view and Map &Street view. button (or image) element
	var btnMap = document.getElementById(GMSW.MapControlHolder + this._obj._counter); 
	var btnStreet = document.getElementById(GMSW.StreetControlHolder + this._obj._counter);  
	var btnMapStreet = document.getElementById(GMSW.MapStreetControlHolder + this._obj._counter); 


	var index = this._obj._counter;
	//when page is loaded, add click event listener for two buttons.
	window.addEventListener("load", function(){
		if (btnMap != null)	{								 
			//add click listener for map button
			btnMap.addEventListener("click", function(){GMSW.showMap(index);});
		}
		if (btnMap != null)	{								 
			//add click listener for street button
			btnStreet.addEventListener("click", function(){GMSW.showStreet(index);});
		}
		if (btnMap != null)	{								 
			//add click listener for map_street button
			btnMapStreet.addEventListener("click", function(){GMSW.showMapStreet(index);});
		}
	});		

	
	// push the new instance to the queue
	GMSW.Instances.push(this._obj);
    GMSW.Counter++;
    // execute workflow
	this._obj.LoadAPI();
	// return the new instance
	return this._obj;
	
} // end of GMSW.Create
