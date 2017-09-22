var map;
var currentCoords = { };
var service;
var infoWindow;
var markers = [];
var placesfound = [];

function displayLocation(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
  
	var pLocation = document.getElementById("location");
	pLocation.innerHTML = latitude + ", " + longitude;
  
	showMap(position.coords);
}

function showMap(coords) {
	currentCoords.latitude = coords.latitude;
	currentCoords.longitude = coords.longitude;

	var googleLatLong = new google.maps.LatLng(coords.latitude, coords.longitude);
	var mapOptions = {
		zoom: 11,
		center: googleLatLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
	service = new google.maps.places.PlacesService(map);
	infoWindow = new google.maps.InfoWindow();

	google.maps.event.addListener(map, "click", function(event) {
		var latitude = event.latLng.lat();
		var longitude = event.latLng.lng();
		currentCoords.latitude = latitude;
		currentCoords.longitude = longitude;

		var pLocation = document.getElementById("location");
		pLocation.innerHTML = latitude + ", " + longitude;
		map.panTo(event.latLng);
	});

	showForm();
}

function makePlacesRequest(lat, lng) {
    var query = document.getElementById("query").value;
    var resultsize = document.getElementById("numOfPlaces");
	if (query) {
		var placesRequest = {
			location: new google.maps.LatLng(lat, lng),
			radius: 10000,
			keyword: query
		};
		service.nearbySearch(placesRequest, function(results, status) {
		    if (status == google.maps.places.PlacesServiceStatus.OK) {
		        placesfound = results;
		        resultsize.innerHTML = placesfound.resultsize;
				results.forEach(function(place) {
					createMarker(place);
					//console.log(place);
				});
			} 
		});

	} else {
		console.log("No query entered for places search");
	}
}

function createMarker(place) {
	markerOptions = {
		position: place.geometry.location,
		map: map,
		clickable: true
	};

	var marker = new google.maps.Marker(markerOptions);
	markers.push(marker);

	google.maps.event.addListener(marker, "click", function(place, marker) {
		return function() {
			if (place.vicinity) {
						var contentStr = 		  
			  '<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>'; 
	
					if (!!place.vicinity) 
                  contentStr += place.vicinity + '<br>' ;

	
				 if (!!place.formatted_phone_number) 
				      contentStr += '<a href=tel:' + place.formatted_phone_number + '>' + place.formatted_phone_number + '</a>' + '<br>'; 	
						
				if (!!place.formatted_address) 
                  contentStr += place.formatted_address + '<br>' ;
				
				 if (!!place.website) {
				   contentStr += '<a href=' + place.website + '>website</a>' + '<br>' ; 
				 }
				place.types + '<br>' +
				 '</div>';
			infoWindow.setContent(contentStr);
						  
						  console.log(place);
	/*		
				infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
				'<a href=tel:' + place.formatted_phone_number + '>' + place.formatted_phone_number + '</a>' + '<br>' +				
                place.formatted_address + '<br>' +
				'<a href=' + place.website + '>website</a>' + '<br>' +
				place.types + '<br>' +
				 '</div>');
				 */
			} else {
				infoWindow.setContent(place.name);
			}
			infoWindow.open(map, marker);
		};
	}(place, marker));
}

function clearMarkers() {
	markers.forEach(function(marker) { marker.setMap(null); });
	markers = [];
}

function showForm() {
	var searchForm = document.getElementById("search");
	searchForm.style.visibility = "visible";
	var button = document.querySelector("button");
	button.onclick = function(e) {
		e.preventDefault();
		clearMarkers();
		makePlacesRequest(currentCoords.latitude, currentCoords.longitude);
	};
}

function displayError(error) {
	var errors = ["Unknown error", "Permission denied by user", "Position not available", "Timeout error"];
	var message = errors[error.code];
	console.warn("Error in getting your location: " + message, error.message);
}

window.onload = function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayLocation, displayError);
	} else {
		alert("Sorry, this browser doesn't support geolocation!");
	}
}









