# Real-Estate-Google-Map-Street-Viewer-Presenter
Google Maps & Street View For Real Estate

(Using Google Maps JavaScript API v3.)
Robin Liu - April16, 2016

Description:
This is a general purpose javascript solution for all types of Google maps / street view combinations. A perfect solution for improving user experience i.e. contact forms, “about us” boxes etc.

Installation:
Extract the archive. Edit the file “GMSW_main_v3.js”. Search for the variable GMSW.Key. Change the variable to whatever your google maps api key is. For more information about api key generating visit http://code.google.com/intl/sk/apis/maps/signup.html
Run the examples in the archive and start your own implementation.

Documentation:


1,  To create a basic instance, use this syntax:

GMSW.Create ({Address : "Toronto, Canada"});

Following parameters are supported:

Address.
The address of the map instance. i.e. “Rome, Italy”.  can accept latitude and longitude separated by ",",  for example:  "50.395246, -105.500470"

LatLng:   
example format:  {lat:50.395191,lng:-105.500712}.  if both address and LatLng are provided, use LatLng to plot map, street view and main marker.

StartingYaw:  Optional.
startingYaw = 0 : show view towards North
startingYaw = 90 : show view towards East
startingYaw = 180 : show view towards South
startingYaw = 270 : show view towards West
If StartingYaw is null or not provided, heading will be computed  based on its latitude and longitude.

Reference:
http://stackoverflow.com/questions/7068365/getting-the-pov-for-google-streetview-api
The latLng of the required address and the latLng of the panorama location (the position of the streetview car from where images are shot) are not the same. As far as I know, the API does not set the heading in the right direction of the address latlng, you will have to set it yourself. This is how I did it, I used the StreetViewService to find the nearest panorama shot available and then calculated the Pov heading using the computeHeading method here


StartingPitch  
startingPitch = 0 :  directly forwards
startingPitch = 90 : directly upwards
startingPitch = -90 :  directly downwards

StreetZoomLevel 
The street view zoom level. street view zoom level: 0-4, 1.5 is the optimal and default.

MapType
Can be any of: G_NORMAL_MAP, G_SATELLITE_MAP, G_HYBRID_MAP
Default is: G_NORMAL_MAP

MapZoomLevel 
The map zoom level.  map zoom level : 0-19, 16 is the optimal and default.
        
ViewWidth:
the width of the map and street view window. default is 400px.

MapHeight:
the height of the map view window. default is 300px.

StreetViewHeight:
the height of the street view window. default is 300px.

Markers
A collection of markers. 
	Address: display the marker at the location of this  address. 
	LatLng:  display the marker at the location of this  LatLng. 
	Text:  the text to display in the popup box when clicking the marker.
	DisplayText:  if true, display text on marker.
	Directions: if true, display Address textbox and Get Direction button.
Note: if both address and latlng are provided, use latlng to display marker.  if none of address and latlng is provided, use the address or latlng passed (latlng has higher priority) to GMSW.Create() to plot the marker.


CaptureYP 
set 'true' to allow capturing of current yaw and pitch


ControlOptions: 	
	{
		ShowMapControl: ,
		ShowStreetControl,										ShowMapStreetControl: , 
 		ColorSelected : ,  
		ColorUnselected : ,
		ControlsOnTop: 
	}

										
ShowMapControl    (optional)
 if true, show map view control	

ShowStreetControl   (optional)
if true, show street view control

ShowMapStreetControl   (optional)
if true, show map & street view controls

ColorSelected   (optional)
border color of selected view control 

ColorUnselected    (optional)
border color of unselected view control 

ControlsOnTop  (optional)
If true, view controls bill be on top of views, otherwise following the views. 

Return
return a same constructor as the parameter constructor.


Return Paremeters 

GMSW.StreetViewAvailable
return parameter.  true: street view is available

GMSW.MapViewAvailable
return parameter.  true: map view is available

GMSW.ReturnMessage
return parameter.  "": successful. other value: error message.

GMSW.CurrentYaw
return parameter.  current heading.

GMSW.CurrentPitch
return parameter.  current pitch.

GoogleMap
Gets the GMap object from the GMSW instance.
	
GoogleStreetView
Gets the StreetView object from the GMSW instance.

MainMarker:
the main marker that will be place at the point of address or lat lng of map view.

StartingLatLng: 
the point of address or lat lng that is used to plot initial map view and initial  street view.


2,  Utility Functions

ConvertMapType(mapType)
convert map types from google map api V2 toV3 .
	case  "G_NORMAL_MAP": google.maps.MapTypeId.ROADMAP;
	case  "G_SATELLITE_MAP": google.maps.MapTypeId.SATELLITE;
	case  "G_HYBRID_MAP": google.maps.MapTypeId.HYBRID;
	case  "G_TERRAIN_MAP": google.maps.MapTypeId.TERRAIN;
	default:  google.maps.MapTypeId.ROADMAP;

GMSW.FacingDirectionToYaw( FacingDirection )
Convert Facing Direction To Yaw. Conversion Table:
"north": 180
"northeast": 225
"east": 270
"southeast": 315
"south" : 0
"southwest": 45
"west": 90,
"northwest": 135

GMSW.ShowViews(bMapView, bStreetView, index)
show map view or street view, or both, or none.

bMapView
 if true, show Map View, otherwise hide Map View.
bStreetView 
if true, show Street View, otherwise hide Street View.
index: the index  of GMSW instance. the index for the first instance is 0.
Return:
true: views shown successful.  false: error occurred (map view or street view does not exist).

GMSW.showMap (index)
show map view, hide street view, and update the status of map and street buttons (or images).
index: the index  of GMSW instance. the index for the first instance is 0.
return:
true: map view showed.  false: map view did not show, or error occurred


GMSW.showStreet (index)
show street view, hide map view, and update the status of map and street buttons (or images).
index: the index  of GMSW instance. the index for the first instance is 0.
return:
true: street view showed.  false: Street view did not show, or error occurred

GMSW.showMapStreet (index)
show map and street view, and update the status of map and street buttons (or images).
index: the index  of GMSW instance. the index for the first instance is 0.
return:
true:  map view or street view or both showed.  false: both map view and street view did not show, or error occurred


CreateMarker (marker, forMap, index)
marker: a collection of markers. 
	Address: display the marker at the location of this  address. 
	LatLng:  display the marker at the location of this  LatLng. 
	Text:  the text to display in the popup box when clicking the marker.
	DisplayText:  if true, display text on marker.
	Directions: if true, display Address textbox and Get Direction button.
forMap:  if true, create marker and place it on map view, otherwise place it on street view.
index: the index of GMSW instance to create marker for. the index for the first instance is 0.




For more information read the “GMSW_main_v3.js” file.

History:

-	Converted using Google Maps JavaScript API v3. 
-	added support for Directions getting in markers.
-	added support for direct setting of yaw and pitch for the street view panorama
  -     added support to get the actual, current yaw and pitch. To enable this, set the attribute CaptureYP to true.
