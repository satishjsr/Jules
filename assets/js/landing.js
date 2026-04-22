document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('outlet-list');
    if (!listContainer) return; // Exit if not on landing page

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

    const getRandomMsg = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (hour >= 5 && hour < 11) {
        heroTitle.innerHTML = userName ? `Morning, ${userName}.` : "Morning.";
        heroSubtitle.innerText = getRandomMsg(msgs.morning);
    } else if (hour >= 11 && hour < 16) {
        heroTitle.innerHTML = userName ? `Midday fuel, ${userName}.` : "Midday fuel.";
        heroSubtitle.innerText = getRandomMsg(msgs.afternoon);
    } else if (hour >= 16 && hour < 21) {
        document.body.classList.add('theme-evening');
        heroTitle.innerHTML = userName ? `Evening unwind, ${userName}.` : "Evening unwind.";
        heroSubtitle.innerText = getRandomMsg(msgs.evening);
    } else {
        document.body.classList.add('theme-night');
        heroTitle.innerHTML = userName ? `Late night cravings, ${userName}.` : "Late night cravings.";
        heroSubtitle.innerText = getRandomMsg(msgs.night);
    }

    // ==========================================
    // 🟢 2. SMART LOCATION & ETA ENGINE (HYBRID)
    // ==========================================

    // 🛡️ PHASE 1 FIX: Global Delivery Radius (in KM)
    const MAX_DELIVERY_RADIUS_KM = 10;

    // Fallback: Haversine Formula (Aerial Distance for Initial Free Load)
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ⚡ DYNAMIC GOOGLE MAPS LOADER (Saves Money!)
    let isGoogleApiLoading = false;
    function loadGoogleMapsAPI(callback) {
        if (window.google && window.google.maps) {
            callback();
            return;
        }
        if (isGoogleApiLoading) return; // Prevent multiple clicks from loading API twice
        isGoogleApiLoading = true;

        const script = document.createElement('script');
        // API Key is retrieved from meta tag for strict architectural adherence
        const apiKey = document.getElementById('google-maps-config').getAttribute('data-api-key');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.onload = () => {
            isGoogleApiLoading = false;
            callback();
        };
        document.head.appendChild(script);
    }

    // 🚗 THE MASTER ENGINE: Google Distance Matrix
    function calculateExactRoadDistance(userLat, userLng) {
        ambientStatus.innerHTML = "🗺️ Routing through live traffic...";

        loadGoogleMapsAPI(() => {
            const service = new google.maps.DistanceMatrixService();
            const destinations = cards.map(c => ({
                lat: parseFloat(c.getAttribute('data-lat')),
                lng: parseFloat(c.getAttribute('data-lng'))
            }));

            service.getDistanceMatrix({
                origins: [{lat: userLat, lng: userLng}],
                destinations: destinations,
                travelMode: 'DRIVING',
                drivingOptions: {
                    departureTime: new Date(Date.now()), // Considers Live Traffic!
                    trafficModel: 'bestguess'
                }
            }, (response, status) => {
                if (status === 'OK') {
                    const results = response.rows[0].elements;
                    let minDistanceValue = Infinity;
                    let nearestCard = null;

                    cards.forEach((card, index) => {
                        const res = results[index];
                        if (res.status === 'OK') {
                            const distText = res.distance.text;
                            const distValue = res.distance.value; // in meters
                            const distInKm = distValue / 1000; // Convert to KM for logic

                            // Get Live Traffic ETA (or standard duration)
                            const durValue = res.duration_in_traffic ? res.duration_in_traffic.value : res.duration.value;

                            // Prep time (15 mins) + Travel time
                            const totalEtaMins = Math.round((durValue / 60) + 15);

                            const outletId = card.getAttribute('data-id');
                            document.getElementById(`dist-${outletId}`).innerHTML = `📍 <span class="text-brand-green font-800">${distText} exact</span>`;
                            card.querySelector('.time').innerHTML = `🕐 ${totalEtaMins}-${totalEtaMins + 10} min`;

                            // 🛡️ PHASE 1 FIX: Out of Delivery Area Logic (Google Exact)
                            const isOpen = card.getAttribute('data-is-open') === 'true';
                            const orderBtn = card.querySelector('.order-btn');

                            if (isOpen && orderBtn) {
                                // FIXED Variable name here (distInKm)
                                if (distInKm > MAX_DELIVERY_RADIUS_KM) {
                                    orderBtn.style.background = "var(--brand-yellow)";
                                    orderBtn.style.color = "var(--text-main)";
                                    orderBtn.innerText = "VIEW MENU (OUT OF ZONE)";
                                    orderBtn.style.pointerEvents = "auto"; // User can click
                                    orderBtn.setAttribute('href', `menu.php?outlet=${outletId}`);
                                } else {
                                    orderBtn.style.background = "";
                                    orderBtn.style.color = "";
                                    orderBtn.innerText = "ORDER NOW ➔";
                                    orderBtn.style.pointerEvents = "auto";
                                    orderBtn.setAttribute('href', `menu.php?outlet=${outletId}`);
                                }
                            }

                            if (distValue < minDistanceValue) {
                                minDistanceValue = distValue;
                                nearestCard = card;
                            }
                        }
                    });

                    // Re-sort the UI perfectly based on ROAD distance
                    if (nearestCard) {
                        cards.forEach(c => {
                            c.classList.remove('highlight');
                            c.querySelector('.card-badge').style.display = 'none';
                        });
                        nearestCard.classList.add('highlight');
                        nearestCard.querySelector('.card-badge').style.display = 'block';
                        listContainer.prepend(nearestCard);

                        ambientStatus.innerHTML = `<span class="text-brand-green font-800">✅ Exact road distance locked!</span>`;
                        setTimeout(() => { ambientStatus.style.opacity = '0'; }, 3500);
                    }
                } else {
                    ambientStatus.innerHTML = "⚠️ Routing failed. Using aerial distance.";
                    updateCardsWithLocation(userLat, userLng, true, ""); // Fallback to formula
                }
            });
        });
    }

    // 🚀 INITIAL LOAD (Fast & Free IP/Haversine Estimate)
    function updateCardsWithLocation(userLat, userLng, isFallbackGPS = false, userCity = "") {
        let nearestCard = null;
        let minDistance = Infinity;

        cards.forEach(card => {
            const cardLat = parseFloat(card.getAttribute('data-lat'));
            const cardLng = parseFloat(card.getAttribute('data-lng'));
            const outletId = card.getAttribute('data-id');
            const dist = getDistance(userLat, userLng, cardLat, cardLng); // Already in KM

            const distSpan = document.getElementById(`dist-${outletId}`);
            const timeSpan = card.querySelector('.time');

            // Rough ETA based on Aerial Distance
            let etaMin = Math.round(15 + (dist * 4) + 5);
            let etaMax = etaMin + 10;
            if(timeSpan) timeSpan.innerHTML = `🕐 ${etaMin}-${etaMax} min`;

            if (isFallbackGPS) {
                if(distSpan) distSpan.innerHTML = `📍 ${dist.toFixed(1)} km (aerial)`;
            } else {
                if(distSpan) distSpan.innerHTML = `<span class="exact-gps-trigger" class="exact-gps-trigger underline pointer text-brand-green font-700">Tap for exact distance</span>`;
            }

            // 🛡️ PHASE 1 FIX: Out of Delivery Area Logic (Haversine Estimate)
            const isOpen = card.getAttribute('data-is-open') === 'true';
            const orderBtn = card.querySelector('.order-btn');

            if (isOpen && orderBtn) {
                if (dist > MAX_DELIVERY_RADIUS_KM) {
                    orderBtn.style.background = "var(--brand-yellow)";
                    orderBtn.style.color = "var(--text-main)";
                    orderBtn.innerText = "VIEW MENU (OUT OF ZONE)";
                    orderBtn.style.pointerEvents = "auto"; // User can click
                    orderBtn.setAttribute('href', `menu.php?outlet=${outletId}`);
                } else {
                    orderBtn.style.background = "";
                    orderBtn.style.color = "";
                    orderBtn.innerText = "ORDER NOW ➔";
                    orderBtn.style.pointerEvents = "auto";
                    orderBtn.setAttribute('href', `menu.php?outlet=${outletId}`);
                }
            }

            if (dist < minDistance) { minDistance = dist; nearestCard = card; }
        });

        // Initial DOM Re-order
        if (nearestCard) {
            cards.forEach(c => {
                c.classList.remove('highlight');
                c.querySelector('.card-badge').style.display = 'none';
            });
            nearestCard.classList.add('highlight');
            nearestCard.querySelector('.card-badge').style.display = 'block';
            listContainer.prepend(nearestCard);

            if (!isFallbackGPS) {
                let locText = userCity ? `in ${userCity}` : "near you";
                ambientStatus.innerHTML = `✨ Showing closest kitchens ${locText}.`;

                // EVENT LISTENER: Inject Google Maps API only when clicked!
                document.querySelectorAll('.exact-gps-trigger').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        ambientStatus.style.opacity = '1';
                        ambientStatus.innerHTML = "⏳ Locking precise GPS coordinates...";

                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                                (pos) => {
                                    calculateExactRoadDistance(pos.coords.latitude, pos.coords.longitude);
                                },
                                (err) => {
                                    ambientStatus.innerHTML = "❌ GPS permission denied.";
                                    setTimeout(() => { ambientStatus.style.opacity = '0'; }, 3000);
                                },
                                { enableHighAccuracy: true, timeout: 5000 }
                            );
                        }
                    });
                });
            }
        }
    }

   // ==========================================
    // 🚀 FIRE THE ENGINE: SMART AUTO-LOCATION
    // ==========================================

    function runIPFallback() {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if(data && data.latitude && data.longitude) updateCardsWithLocation(data.latitude, data.longitude, false, data.city);
            }).catch(() => { ambientStatus.innerHTML = "✨ Welcome. Please select your kitchen below."; });
    }

    // Modern Browser Permission API Check
    if (navigator.permissions && navigator.geolocation) {
        navigator.permissions.query({ name: 'geolocation' }).then(function(PermissionStatus) {

            if (PermissionStatus.state === 'granted') {
                // 🔥 MAGIC: User has allowed location before!
                // Fetch silently in background without any button click!
                ambientStatus.innerHTML = "⏳ Fetching exact background location...";
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        // Directly hit Google API with exact coordinates
                        calculateExactRoadDistance(pos.coords.latitude, pos.coords.longitude);
                    },
                    (err) => { runIPFallback(); },
                    { enableHighAccuracy: true, timeout: 5000 }
                );
            }
            else if (PermissionStatus.state === 'prompt' || PermissionStatus.state === 'denied') {
                // User is new OR has blocked location.
                // Show the IP-based estimate with "Tap for exact distance" button.
                runIPFallback();
            }

            // Listen for permission changes
            PermissionStatus.onchange = function() {
                if (this.state === 'granted') {
                    ambientStatus.innerHTML = "⏳ Permission granted! Rerouting...";
                    navigator.geolocation.getCurrentPosition(
                        (pos) => { calculateExactRoadDistance(pos.coords.latitude, pos.coords.longitude); },
                        (err) => { console.log(err); },
                        { enableHighAccuracy: true, timeout: 5000 }
                    );
                }
            };
        });
    } else {
        // Fallback for older browsers (like old Safari)
        runIPFallback();
    }

    // Haptic Feedback
    document.querySelectorAll('.haptic-order').forEach(btn => {
        btn.addEventListener('click', () => { if(navigator.vibrate) navigator.vibrate([30, 50, 30]); });
    });



    // 🟢 4. PETPOOJA STATUS REMOVED (Handled securely by PHP in index.php)

    // 🟢 5. DYNAMIC BANNER ROTATOR
    function loadDynamicBanners() {
        fetch('banners.json?v=' + Date.now())
            .then(res => { if (!res.ok) throw new Error("No banners file"); return res.json(); })
            .then(data => {
                ['rajinder', 'ashok'].forEach(outletId => {
                    if (data[outletId] && data[outletId].length > 0) {
                        const randomImg = data[outletId][Math.floor(Math.random() * data[outletId].length)];
                        const card = document.querySelector(`.outlet-card[data-id="${outletId}"]`);
                        if (card) {
                            const imgEl = card.querySelector('.card-img');
                            if (imgEl) {
                                imgEl.style.opacity = 0;
                                setTimeout(() => {
                                    imgEl.src = randomImg;
                                    imgEl.style.opacity = 1;
                                    imgEl.style.transition = "opacity 0.5s ease-in-out";
                                }, 200);
                            }
                        }
                    }
                });
            }).catch(err => console.log("Banners waiting for sync."));
    }
    loadDynamicBanners();
});
// Image Error Handler
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (this.classList.contains('nav-logo')) {
                this.src = 'https://templestreet.in/assets/images/templestreet-logo.png';
            }
        });
    });
});
