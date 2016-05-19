<p align="center"><strong>Google  Maps &amp; Street View</strong><strong> Presenter For</strong><strong> </strong><strong>Real Estate</strong></p>
<p align="center">(Using <em><strong>Google Maps</strong></em><em><strong> </strong></em>JavaScript&nbsp;<em><strong>API v3</strong></em><em><strong>.</strong></em>)<br />
  Robin Liu - April16,  2016</p>
<p><strong>Description</strong><strong>:</strong><br />
  This is a  general purpose javascript solution for all types of Google maps / street view  combinations. A perfect solution for improving user experience i.e. contact  forms, “about us” boxes etc.</p>
<p><strong>Installation:</strong><br />
  Extract the  archive. Edit the file “GMSW_main_v3.js”. Search for the variable GMSW.Key. Change the variable to whatever  your google maps api key is. For more information about api key generating  visit <a href="http://code.google.com/intl/sk/apis/maps/signup.html">http://code.google.com/intl/sk/apis/maps/signup.html</a><br />
  Run the  examples in the archive and start your own implementation.</p>
<p><strong>Documentation:</strong></p>
<p><strong>1,  </strong><strong>To  create a basic instance, use this syntax:</strong></p>
<p>GMSW.Create  ({Address : &quot;Toronto, Canada&quot;}); </p>
<p>Following  parameters are supported:</p>
<p><strong><u>Address</u></strong>.<br />
  The address  of the map instance. i.e. “Rome,   Italy”.  can accept latitude and longitude separated  by &quot;,&quot;,  for example:  &quot;50.395246, -105.500470&quot;</p>
<p><strong><u>LatLng:</u></strong>   <br />
  example format:  {lat:50.395191,lng:-105.500712}.   if both address and LatLng are provided, use LatLng  to plot map, street view and main marker.</p>
<p><strong><u>StartingYaw:</u></strong><strong>  </strong>Optional.<br />
  startingYaw = 0 : show view towards North<br />
  startingYaw = 90 : show view towards East<br />
  startingYaw = 180 : show view towards South<br />
  startingYaw = 270 : show view towards West<br />
  If StartingYaw is null or not provided, heading will be computed  based on its latitude and longitude.</p>
<p>Reference:<br />
  <em><a href="http://stackoverflow.com/questions/7068365/getting-the-pov-for-google-streetview-api">http://stackoverflow.com/questions/7068365/getting-the-pov-for-google-streetview-api</a></em><br />
  <em>The latLng of the  required address and the latLng of the panorama location (the position of the  streetview car from where images are shot) are not the same. As far as I know,  the API does not set the heading in the right direction of the address latlng,  you will have to set it yourself. This is how I did it, I used the  StreetViewService to find the nearest panorama shot available and then  calculated the Pov heading using the computeHeading method here</em></p>
<p><strong><u>StartingPitch</u></strong><strong>  </strong><br />
  startingPitch = 0 :  directly  forwards<br />
  startingPitch = 90 : directly upwards<br />
  startingPitch = -90 :  directly  downwards</p>
<p><u>Street</u><u>ZoomLevel </u><br />
  The street  view zoom level. street view zoom level: 0-4, 1.5 is the optimal and default.</p>
<p><u>MapType</u><br />
  Can be any  of: G_NORMAL_MAP, G_SATELLITE_MAP, G_HYBRID_MAP<br />
  Default is:  G_NORMAL_MAP</p>
<p><u>Map</u><u>ZoomLevel </u><br />
  The map  zoom level.  map zoom level : 0-19, 16 is the  optimal and default.<br />
  <br />
  <u>ViewWidth:</u><br />
  the width of the map and street view window. default is 400px.</p>
<p><u>MapHeight:</u><br />
  the height of the map view window. default is 300px.</p>
<p><u>StreetViewHeight:</u><br />
  the height of the street view window. default is 300px.</p>
<p><u>Markers</u><br />
  A  collection of markers. <br />
  Address: display the marker  at the location of this  address. <br />
  LatLng:  display the marker at the location of  this  LatLng. <br />
  Text:  the text to display in the popup box when  clicking the marker.<br />
  DisplayText:  if true, display text on marker.<br />
  Directions: if true, display  Address textbox and Get Direction button.<br />
  <strong>Note</strong>: if both  address and latlng are provided, use latlng to display marker.  if none of address and latlng is provided,  use the address or latlng passed (latlng has higher priority) to GMSW.Create()  to plot the marker.</p>
<p><u>CaptureYP</u><u> </u><br />
  set 'true' to allow capturing of current yaw and pitch</p>
<p><u>ControlOptions: </u>       <br />
  {<br />
  ShowMapControl: ,<br />
  ShowStreetControl,                                                                  ShowMapStreetControl: , <br />
  ColorSelected  : ,  <br />
  ColorUnselected : ,<br />
  ControlsOnTop: <br />
  }</p>
<p>                                                                      <br />
  ShowMapControl    (optional)<br />
  if true, show map view control     </p>
<p>ShowStreetControl   (optional)<br />
  if true, show street view control</p>
<p>ShowMapStreetControl   (optional)<br />
  if true, show map &amp; street view controls</p>
<p>ColorSelected   (optional)<br />
  border color of selected view control </p>
<p>ColorUnselected    (optional)<br />
  border color of unselected view control </p>
<p>ControlsOnTop  (optional)<br />
  If true, view controls bill be on top of views, otherwise following the  views. </p>
<p>Return<br />
  return a same constructor as the parameter constructor.</p>
<p><strong><u>Return Paremeters </u></strong></p>
<p><u>GMSW.StreetViewAvailable</u><br />
  return parameter.  true: street view is available</p>
<p><u>GMSW.MapViewAvailable</u><br />
  return parameter.  true: map view is available</p>
<p><u>GMSW.ReturnMessage</u><br />
  return parameter.  &quot;&quot;: successful. other value: error  message.</p>
<p><u>GMSW.CurrentYaw</u><br />
  return parameter.  current heading.</p>
<p><u>GMSW.CurrentPitch</u><br />
  return parameter.  current pitch.</p>
<p><u>Google</u><u>Map</u><br />
  Gets the GMap object from the GMSW  instance.<br />
  <br />
  <u>Google</u><u>StreetView</u><br />
  Gets the StreetView object from the  GMSW instance.</p>
<p><u>MainMarker</u>:<br />
  the main  marker that will be place at the point of address or lat lng of map view.</p>
<p><u>StartingLatLng</u>: <br />
  the point  of address or lat lng that is used to plot initial map view and initial  street view.</p>
<p><strong>2</strong><strong>,  Utility  Functions</strong></p>
<p><u>ConvertMapType(mapType)</u><br />
  convert map types from google map api V2 toV3 .<br />
  case  &quot;G_NORMAL_MAP&quot;:  google.maps.MapTypeId.ROADMAP;<br />
  case  &quot;G_SATELLITE_MAP&quot;:  google.maps.MapTypeId.SATELLITE;<br />
  case  &quot;G_HYBRID_MAP&quot;:  google.maps.MapTypeId.HYBRID;<br />
  case  &quot;G_TERRAIN_MAP&quot;:  google.maps.MapTypeId.TERRAIN;<br />
  default:  google.maps.MapTypeId.ROADMAP;</p>
<p><u>GMSW.FacingDirectionToYaw</u><u>( </u>FacingDirection <u>)</u><br />
  Convert  Facing Direction To Yaw. Conversion Table:<br />
  &quot;north&quot;: 180<br />
  &quot;northeast&quot;: 225<br />
  &quot;east&quot;: 270<br />
  &quot;southeast&quot;: 315<br />
  &quot;south&quot; : 0 <br />
  &quot;southwest&quot;: 45 <br />
  &quot;west&quot;: 90,<br />
  &quot;northwest&quot;: 135</p>
<p><u>GMSW.ShowView</u><u>s(bMapView,  bStreetView, index)</u><br />
  show map  view or street view, or both, or none. </p>
<p><u>bMapView</u><br />
  if true, show Map View, otherwise  hide Map View.<br />
  <u>bStreetView</u> <br />
  if true, show Street View, otherwise hide Street View.<br />
  index: the index  of GMSW  instance. the index for the first instance is 0.<br />
  Return:<br />
  true: views shown successful.   false: error occurred (map view or street view does not exist).</p>
<p><u>GMSW.showMap (index)</u><br />
  show map view, hide street view, and update the status of map and street  buttons (or images).<br />
  index: the index  of GMSW  instance. the index for the first instance is 0.<br />
  return:<br />
  true: map view showed.  false: map  view did not show, or error occurred</p>
<p><u>GMSW.showStreet (index)</u><br />
  show street view, hide map view, and update the status of map and street  buttons (or images).<br />
  index: the index  of GMSW  instance. the index for the first instance is 0.<br />
  return:<br />
  true: street view showed.  false:  Street view did not show, or error occurred</p>
<p><u>GMSW.showMapStreet (index)</u><br />
  show map and street view, and update the status of map and street  buttons (or images).<br />
  index: the index  of GMSW  instance. the index for the first instance is 0.<br />
  return:<br />
  true:  map view or street view or  both showed.  false: both map view and  street view did not show, or error occurred</p>
<p><u>CreateMarker (marker, forMap, index)</u><br />
  marker: a collection of markers. <br />
  Address: display the marker  at the location of this  address. <br />
  LatLng:  display the marker at the location of  this  LatLng. <br />
  Text:  the text to display in the popup box when  clicking the marker.<br />
  DisplayText:  if true, display text on marker.<br />
  Directions: if true, display  Address textbox and Get Direction button.<br />
  forMap:  if true, create marker  and place it on map view, otherwise place it on street view.<br />
  index: the index of GMSW instance to create marker for. the index for  the first instance is 0.</p>
<p><stro
