function findRoute(method, startX, startY, endX, endY, callback) {
	var url="/cgi-bin/naver_route_api.py?by=" + method + "&startX=" + startX + "&startY=" + startY + 
		"&endX=" + endX + "&endY=" + endY;
	$.ajax(url).done(
			function(data) {
				if (method == 'car' || method == 'bicycle') {
					try {
						var sec = data["routes"][0]["summary"]["duration"]; 
						callback( sec );
					} catch (e) {
						callback( -1 );
					}
				}
				else if (method == 'bmw') {
					try {
						var min = data["result"]["path"][0]["info"]["totalTime"]; 
						callback( min * 60 );
					} catch (e){
						callback( -1 );
					}
				}
			})
}

var appleFlag=false;

function appleCheck(startX, startY, x, y, by, direction) {
	if (appleFlag && x < 5 && y < 5) {
		var lat = startY + y * 0.01;
		var lng = startX + x * 0.01;
		findRoute(by, startX, startY, lng, lat, function(t) {
			//console.log('lat: ' + lat + ' lng:' + lng + ' x:' + x + ' y:' + y + ' t:' + t);
			displayDistance(startY, startX, lat, lng, t, by);
		});

		var nextX = x;
		var nextY = y;
		var nextDirection = direction;
		if (direction == 'right') {
			nextX = x + 1;
			nextY = y;
			if (nextX == nextY) {
				nextDirection = 'down';
			}
		}
		else if (direction == 'down') {
			nextX = x;
			nextY = y - 1;
			if (nextX == -nextY) {
				nextDirection = 'left';
			}
		}
		else if (direction == 'left') {
			nextX = x - 1;
			nextY = y;
			if (nextX == nextY) {
				nextDirection = 'up';
			}
		}
		else if (direction == 'up') {
			nextX = x;
			nextY = y + 1;
			if (nextX == -(nextY-1)) {
				nextDirection = 'right';
			}
		}
		window.setTimeout(function() {
			appleCheck(startX, startY, nextX, nextY, by, nextDirection);
		}, 300);
	}
}

function checkOne(startX, startY, lng, lat, by) {
	findRoute(by, startX, startY, lng, lat, function(t) {
		displayDistance(startY, startX, lat, lng, t, by);
	});
}

var unique_id=0;

function makeURL(slat, slng, elat, elng, by) {
	var by_code = 0;
	if (by == 'bmw') by_code = 1;
	else if (by == 'bicycle') by_code = 2;
	return "http://map.naver.com/?mobile&menu=route&mapMode=1&lat=" +
		slat + "&lng=" + slng + "&slng=" + slng + "&slat=" + slat + "&elng=" +
		elng + "&elat=" + elat + "&pathType=" + by_code ;
}

function displayDistance(slat, slng, elat, elng, t, by) {
	++unique_id;
	var fadeOut = false;
	var oPoint = new nhn.api.map.LatLng(elat, elng);

	var label;
	var min = Math.round(t / 60);
	if ( t < 0) {
		fadeOut = true;
		label = "<span id='dist" + unique_id + "' style='color:#000000;'>X</span>"
	}
	else {
		var color = '#000000';
		if ( by == 'car' && min <= 20 || min <= 30 ) {
			color = '#00ff00';
		}
		else if ( by == 'car' && min <= 40 || min <= 60 ) {
			color = '#ffff00';
		}
		else  {
			color = '#ff0000';
		}
		url = makeURL(slat, slng, elat, elng, by);
		label = "<span style='background-color:#000000'><a style='color:" + color + ";' href='" + url + "'>" + min + "</a></span>"
	}

	var oInfo = new nhn.api.map.InfoWindow({
		point: oPoint,
		content: label
	});

	oMap.addOverlay(oInfo);
	oInfo.setVisible(true);

	if (fadeOut) {
		$("#dist"+unique_id).fadeOut("slow");
	}
}


var oSize = new nhn.api.map.Size(28, 37);
var oOffset = new nhn.api.map.Size(14, 37);
var oIcon = new nhn.api.map.Icon('http://static.naver.com/maps2/icons/pin_spot2.png', oSize, oOffset);
var oMarker = new nhn.api.map.Marker(oIcon, { title: '관심 위치' });

function setMarker(x, y) {
  var op1 = new nhn.api.map.LatLng(y, x);
  oMarker.setPoint(op1);
  oMap.addOverlay(oMarker);
}

function naverSearch(text, callback) {
	var url="/cgi-bin/naver_map_search_api.py?q=" + encodeURI(text);

	$.ajax(url).done(
			function(data) {
				var l1, l2;
				if (data.result.address) {
					l1 = data.result.address.list;
				}
				else {
					l1 = new Array();
				}

				if (data.result.site) {
					l2 = data.result.site.list;
				}
				else {
					l2 = new Array();
				}
			
				callback(l1, l2);
			}
			);
}
