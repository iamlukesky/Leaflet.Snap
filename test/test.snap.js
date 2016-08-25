var assert = chai.assert;
var guideLayers;
var marker;

describe('Start', function() {
    before(function() {
        var map;
        var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; 2013 OpenStreetMap contributors',
        });

        map = L.map('map', { drawControl: true })
                       .setView([48.49, 1.4], 16)
                       .addLayer(osm);

        var guides = L.polyline([[48.505431207150885, 1.3999843597412107], [48.50335551764662, 1.398911476135254], [48.50173471468476, 1.3994693756103516], [48.49974418399956, 1.3991689682006836], [48.49684355649577, 1.3993835449218748], [48.4956206932084, 1.398611068725586], [48.49465375716902, 1.3980531692504883], [48.49419872206354, 1.3975811004638672], [48.492406981637345, 1.3971948623657227], [48.49156797030711, 1.396486759185791], [48.49067206152607, 1.3961219787597656], [48.48988, 1.39638], [48.489342389949364, 1.394963264465332], [48.48864554279267, 1.3944590091705322], [48.487628697617744, 1.3940191268920896], [48.485666057669334, 1.3944482803344727], [48.48541005555473, 1.3942551612854002], [48.48461359626773, 1.3942766189575195], [48.483489998505746, 1.3933539390563965], [48.48164098598135, 1.3928818702697754], [48.480232846617845, 1.3912296295166016], [48.479450530080534, 1.3906073570251463], [48.478511734309954, 1.3902640342712402], [48.47714618217502, 1.389319896697998], [48.47600819398379, 1.388998031616211]],
            {
                weight: 5,
                color: 'red',
                opacity: 1.0
            }).addTo(map);

        marker = L.marker([48.488, 1.395]).addTo(map);
        marker.snapediting = new L.Handler.MarkerSnap(map, marker);
        marker.snapediting.addGuideLayer(guides);
        marker.snapediting.enable();

        var road = L.polyline([[48.48922, 1.40033], [48.48935, 1.39981], [48.48948, 1.3976], [48.48986, 1.39634]],
                              {color: 'green', opacity: 1.0}).addTo(map);

        road.snapediting = new L.Handler.PolylineSnap(map, road);
        road.snapediting.addGuideLayer(guides);
        road.snapediting.enable();

        marker.snapediting.addGuideLayer(road);

        for (var m in road.snapediting._verticesHandlers[0]._markerGroup._layers) {
            road.snapediting._verticesHandlers[0]._markerGroup._layers[m].fire('move');
        }

        var road2 = L.polyline([
          [48.48782, 1.39409],
          [48.48794, 1.39267],
          [48.48801, 1.39175],
          [48.48809, 1.39094],
          [48.48802, 1.39073]
        ], {
          color: 'blue',
          opacity: 1
        })
        .addTo(map);

        marker.snapediting.addGuideLayer(road2);
        road.snapediting.addGuideLayer(road2);

        var snapEdit = new L.EditToolbar.SnapEdit(map, {
          featureGroup: L.featureGroup([road2]),
          snapOptions: {
            guideLayers: [guides]
          }
        });

        // Enable edit from the EditToolBar idem
        // snapEdit.enable();

        guideLayers = [guides, road, road2];
        
        map.drawControl.setDrawingOptions({
            polyline: { guideLayers: guideLayers },
            polygon: { guideLayers: guideLayers, snapDistance: 5 },
            marker: { guideLayers: guideLayers, snapVertices: false },
            rectangle: false,
            circle: false
        });

        map.on('draw:created', function (e) {
            var layer = e.layer;
            map.addLayer(layer);
            guideLayers.push(layer);
        });
    });


    beforeEach(function() {
    });

    afterEach(function() {
        // takeScreenshot()
    });

    // TEST
    describe('Test snap', function() {
        it("Should be a snapped marker", function(done) {
            marker.setLatLng([48.48922, 1.40033]);
            assert.isTrue(L.DomUtil.hasClass(marker._icon, 'marker-snapped') );
            done()
        });
    });

});

function takeScreenshot() {
  if (window.callPhantom) {
    var date = new Date()
    var filename = "screenshots/" + date.getTime()
    console.log("Taking screenshot " + filename)
    callPhantom({'screenshot': filename})
  }
}

// penser à re enleve les http/hhtps
