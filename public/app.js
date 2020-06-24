const apiKey = 'CeuMZT93PcvsA_ih6KUyk9tk2wi9ePXKFMbwhgXgAUc';
const homePoint = 'geo!1.365470,103.842690';
let depots = {
  'bishan': { 'location': 'geo!1.356910,103.852330' },
  'changi': { 'location': 'geo!1.330320,103.956420' },
  'galibatu': { 'location': 'geo!1.398240,103.755530' },
  'kimchuan': { 'location': 'geo!1.340320,103.886710' },
  'sengkang': { 'location': 'geo!1.389870,103.883880' },
  'tuas': { 'location': 'geo!1.338056,103.643667' },
  'ulupandan': { 'location': 'geo!1.333425,103.760142' }
};

const platform = new H.service.Platform({ apikey: apiKey });
const router = platform.getRoutingService();
let distance = {
  'bishan': 0,
  'changi': 0,
  'galibatu': 0,
  'kimchuan': 0,
  'sengkang': 0,
  'tuas': 0,
  'ulupandan': 0
};

for (let key in depots) {
  if (depots.hasOwnProperty(key)) {
    const request = {
      mode: 'fastest;car',
      waypoint0: homePoint,
      waypoint1: depots[key].location,
      representation: 'display',
      routeAttributes: "summary"
    };
    router.calculateRoute(request, response => {
      distance[key] = (response.response.route[0].summary.distance / 1000).toFixed(2);
      $('.dist-' + key).text(distance[key] + ' km');
    });
  }
}

$("#mnt-loc").change(function() {
  let mntLoc = $(this).children("option:selected").val();
  for (let key in depots) {
    if (depots.hasOwnProperty(key)) {
      if (mntLoc === "" || key == mntLoc) {
        $('.dist-' + key).text(distance[key] + ' km');
      } else {
        const request = {
          mode: 'fastest;car',
          waypoint0: depots[key].location,
          waypoint1: depots[mntLoc].location,
          representation: 'display',
          routeAttributes: "summary"
        };
        router.calculateRoute(request, response => {
          $('.dist-' + key).text((parseFloat(distance[key]) + parseFloat(response.response.route[0].summary.distance / 1000)).toFixed(2) + ' km');
        });
      }
    }
  }
});

function openMap(depot) {
  let mntLoc = $('#mnt-loc').val();
  let target = 'map.html?depotGeo=' + depots[depot].location + '&depotName=' + depot;
  if (mntLoc !== "" && mntLoc !== depot) {
    target += '&mntGeo=' + depots[mntLoc].location + '&mntName=' + mntLoc;
  }
  window.open(target, '_blank');
}
