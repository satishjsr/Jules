document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('outlet-list');
    if (!listContainer) return;

    const ambientStatus = document.getElementById('ambient-status');
    const cards = Array.from(document.querySelectorAll('.outlet-card'));

    // 🟢 1. NEURO-CONTEXT ENGINE (Dynamic Messages)
    const hour = new Date().getHours();
    const heroTitle = document.getElementById('dynamic-greeting');
    const heroSubtitle = document.getElementById('dynamic-subgreeting');

    let userName = localStorage.getItem('ts_user_name') || '';
    if(userName) userName = userName.split(' ')[0];

    const msgs = {
        morning: ["Freshly brewed filter coffee & crisp dosas await.", "Start your morning with our signature South Indian breakfast.", "Hot idlis and fresh chutney to kickstart your day."],
        afternoon: ["Power through your day with a pure veg thali.", "Lunchtime cravings? We've got the perfect meal.", "Hot, fresh, and purely vegetarian lunch is ready."],
        evening: ["Comforting North Indian classics to end your day right.", "Evening cravings? Try our special snacks and thalis.", "Relax and unwind. Dinner is on us today."],
        night: ["Kitchen is hot. Midnight hunger, sorted.", "Late night cravings? We are open and cooking.", "Midnight hunger strikes? Hot food coming right up."]
    };

    let timeKey = 'night';
    if (hour >= 5 && hour < 12) timeKey = 'morning';
    else if (hour >= 12 && hour < 17) timeKey = 'afternoon';
    else if (hour >= 17 && hour < 22) timeKey = 'evening';

    const selectedMsg = msgs[timeKey][Math.floor(Math.random() * msgs[timeKey].length)];
    if(heroTitle) heroTitle.innerText = (userName && Math.random() > 0.5) ? `Hey ${userName}, ready for some ${timeKey} treats?` : (timeKey.charAt(0).toUpperCase() + timeKey.slice(1) + ".");
    if(heroSubtitle) heroSubtitle.innerText = selectedMsg;

    // 🟢 2. HYPER-LOCAL GPS ENGINE
    let isGoogleApiLoading = false;

    const loadGoogleMaps = (callback) => {
        if (window.google && window.google.maps) return callback();
        if (isGoogleApiLoading) return;
        isGoogleApiLoading = true;

        const script = document.createElement('script');
        const apiKey = document.getElementById('google-maps-config').getAttribute('data-api-key');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.onload = () => {
            isGoogleApiLoading = false;
            callback();
        };
        document.head.appendChild(script);
    };

    const calculateDistances = (userLat, userLng) => {
        loadGoogleMaps(() => {
            const service = new google.maps.DistanceMatrixService();
            const destinations = cards.map(card => ({
                lat: parseFloat(card.getAttribute('data-lat')),
                lng: parseFloat(card.getAttribute('data-lng'))
            }));

            service.getDistanceMatrix({
                origins: [{ lat: userLat, lng: userLng }],
                destinations: destinations,
                travelMode: google.maps.TravelMode.DRIVING,
            }, (response, status) => {
                if (status === 'OK') {
                    const results = response.rows[0].elements;
                    let nearestIndex = -1;
                    let minDistance = Infinity;

                    results.forEach((res, i) => {
                        if (res.status === 'OK') {
                            const distValue = res.distance.value;
                            const distText = res.distance.text;
                            const totalEtaMins = Math.ceil(res.duration.value / 60) + 10;

                            const card = cards[i];
                            const outletId = card.getAttribute('data-id');
                            document.getElementById(`dist-${outletId}`).innerHTML = `📍 <span class="text-brand-green font-800">${distText} exact</span>`;
                            card.querySelector('.time').innerHTML = `🕐 ${totalEtaMins}-${totalEtaMins + 10} min`;

                            if (distValue < minDistance) {
                                minDistance = distValue;
                                nearestIndex = i;
                            }
                        }
                    });

                    if (nearestIndex !== -1) {
                        cards.forEach(c => c.querySelector('.card-badge').classList.add('hidden-initial'));
                        cards[nearestIndex].querySelector('.card-badge').classList.remove('hidden-initial');
                        ambientStatus.innerHTML = `<span class="text-brand-green font-800">✅ Exact road distance locked!</span>`;
                    }
                }
            });
        });
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrent_position = navigator.geolocation.getCurrentPosition; // Just in case
        navigator.geolocation.getCurrentPosition(
            (pos) => calculateDistances(pos.coords.latitude, pos.coords.longitude),
            () => {
                ambientStatus.innerText = "📍 Using city-center defaults (GPS denied)";
                cards.forEach(card => {
                    const outletId = card.getAttribute('data-id');
                    const distSpan = document.getElementById(`dist-${outletId}`);
                    if(distSpan) distSpan.innerHTML = `<span class="exact-gps-trigger underline pointer text-brand-green font-700">Tap for exact distance</span>`;
                });
            },
            { enableHighAccuracy: true }
        );
    }
});
