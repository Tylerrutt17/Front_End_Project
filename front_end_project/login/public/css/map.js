//Map box token
const mapboxAccessToken = "pk.eyJ1IjoibWltem8iLCJhIjoiY2tjYjU1Y3ZvMDUzMDJ3cWUyeGxuZ2Q5diJ9.R3luBOXdjbr1uXs6bLWlDg";
//set map longitude and latitude
export default (data) => {

    const map = L.map('mapid').setView([37.8, -96], 4);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
        id: 'mapbox/light-v9',
        attribution: "...",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxAccessToken
    }).addTo(map);

    L.geoJson(data).addTo(map);

    function getColor(d) {
        console.log(d)
        return d > 40000 ? '#810f7c' :
            d > 20000 ? '#88419d' :
            d > 10000 ? '#8c6bb1' :
            d > 5000 ? '#8c96c6' :
            d > 1000 ? '#9ebcda' :
            d > 500 ? '#bfd3e6' :
            d > 0 ? '#bfd3e6' :
            '#FFEDA0';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.positiveCases),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.9
        };
    }

    L.geoJson(statesData, {
        style: style
    }).addTo(map);

    async function getMap() {
        const response = await fetch(api_url)
        const data = await response.json();
        const {
            latitude,
            longitude
        } = data;
    }

    //event listener for layer mouseover
    function highlightState(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#ffffff',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }


    //mouseoutevent will reset layer style to default        
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    function resetStateHighlight(e) {
        geojson.resetStyle(e.target);
    }

    // ... our listeners
    let geojson = L.geoJson();

    //click listener that will zoom into each state
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    //listeners added to state layers, onhover states will highlight, other interactions can be added here
    function onEachFeature(feature, layer) {
        layer.on({
            mouseout: resetStateHighlight,
            click: zoomToFeature,
            mouseover: highlightState
        });
    }

    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    //state stats to be shown on hover
    const info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Covid Stats</h4>' + (props ?
            '<b>' + props.name + '</b><br />' + ' Deaths: ' + props.deaths + '</b><br />' + 'Positive Cases: ' + props.positiveCases :
            'Hover over a state');
    };

    info.addTo(map);

    function highlightFeature(e) {
        const layer = e.target;
        "..." //added quotes, line kept erroing out without quotes
        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        "..." //added quotes, line kept erroing out without quotes
        info.update();
    }
    const legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function (map) {

        const div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
}