$(function() {
    // add input listeners
    google.maps.event.addDomListener(window, 'load', function () {
        var from_places = new google.maps.places.Autocomplete(document.getElementById('from_places'));
        var to_places = new google.maps.places.Autocomplete(document.getElementById('to_places'));

        google.maps.event.addListener(from_places, 'place_changed', function () {
            var from_place = from_places.getPlace();
            var from_address = from_place.formatted_address;
            $('#origin').val(from_address);
        });

        google.maps.event.addListener(to_places, 'place_changed', function () {
            var to_place = to_places.getPlace();
            var to_address = to_place.formatted_address;
            $('#destination').val(to_address);
        });

    });
    // calculate distance
    function calculateDistance() {
        var origin = $('#origin').val();
        var destination = $('#destination').val();
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.metric,
                avoidHighways: false,
                avoidTolls: false
            }, callback);
    }

    // get distance results
    function callback(response, status) {
        if (status != google.maps.DistanceMatrixStatus.OK) {
            $('#result').html(err);
        } else {
            var origin = response.originAddresses[0];
            var destination = response.destinationAddresses[0];
            if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
                $('#result').html("Better get on a plane. There are no roads between "  + origin + " and " + destination);
            } else {
                var distance = response.rows[0].elements[0].distance;
                var duration = response.rows[0].elements[0].duration;
                console.log(response.rows[0].elements[0].distance);
                var distance_in_kilo = distance.value / 1000; // in km
                var distance_in_mile = distance.value / 1609.34; // in miles
                var duration_text = duration.text;
                var duration_value = duration.value;
                $('#in_mile').text(distance_in_mile.toFixed(2));
                $('#in_kilo').text(distance_in_kilo.toFixed(2));
                $('#duration_text').text(duration_text);
                $('#duration_value').text(duration_value);
                calculateCarbon(distance_in_mile);
                }
        }
    }

    // calculate price of Carbon
    function calculateCarbon(distance_in_mile) {
        $.getJSON('http://api.allorigins.win/get?url=https%3A//api.triptocarbon.xyz/v1/footprint%3Factivity%3D' + distance_in_mile + '10%26activityType%3Dmiles%26country%3Dgbr%26mode%3Dtaxi&callback=?', function (data) {
            var carbonWeightRaw = JSON.parse(data.contents);
            var carbonWeight = carbonWeightRaw.carbonFootprint;
            $('#carbon_weight').text(carbonWeight);
            calculatePrice(carbonWeight);
        });
    }

    function calculatePrice(carbonWeight) {
        if (carbonWeight = "NaN") {
        } else {
            var carbonPrice = carbonWeight * 0.075;
            var carbonPriceFormatted = carbonPrice.toFixed(2);
            $('#carbon_price').text("£" + carbonPriceFormatted);
        }
    }

    // print results on submission of the form
    $('#distance_form').submit(function(e){
        e.preventDefault();
        calculateDistance();
        calculateCarbon();
        calculatePrice();
        });

});