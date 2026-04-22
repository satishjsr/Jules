/**
 * Temple Street 2030 - Multiplayer Group Order Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initGroupOrder();
    setupAddToCartListeners();
});

function setupAddToCartListeners() {
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemContainer = this.closest('.menu-item');
            const itemId = itemContainer.querySelector('h3').innerText;
            addItemToGroupCart(itemId);
        });
    });
}

function addItemToGroupCart(itemId) {
    const groupId = localStorage.getItem('ts_group_id');
    const guestId = localStorage.getItem('ts_guest_id');
    const isHost = localStorage.getItem('ts_is_host') === 'true';

    if (!groupId) {
        alert("Please start a group order first!");
        return;
    }

    // If host, we need a guest_id for the host too.
    // For Phase 3 simplicity, let's assume host is also a member if they add items.
    if (isHost && !guestId) {
        autoRegisterHostAsMember(groupId, itemId);
        return;
    }

    const formData = new FormData();
    formData.append('group_id', groupId);
    formData.append('guest_id', guestId);
    formData.append('item_id', itemId);
    formData.append('qty', 1);

    fetch('api/add_to_cart.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            fetchGroupCart(groupId);
            toggleCartDrawer(); // Show cart when item added
        }
    });
}

function autoRegisterHostAsMember(groupId, itemId) {
    const hostName = localStorage.getItem('ts_user_name') || 'Host';
    const formData = new FormData();
    formData.append('group_id', groupId);
    formData.append('guest_name', hostName + " (Host)");
    formData.append('dietary_tag', 'Veg');

    fetch('api/join_group.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('ts_guest_id', data.guest_id);
            addItemToGroupCart(itemId);
        }
    });
}

let cartPollingInterval = null;

function initGroupOrder() {
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('group') || localStorage.getItem('ts_group_id');
    const hostName = urlParams.get('host');

    if (groupId && hostName && !localStorage.getItem('ts_guest_id')) {
        handleGuestEntry(groupId, hostName);
    } else if (groupId) {
        activateGroupSession(groupId, "Active");
        startCartPolling(groupId);
    } else {
        setupHostControls();
    }
}

function setupHostControls() {
    const banner = document.getElementById('group-order-banner');
    if (banner) {
        banner.classList.remove('hidden');
        banner.addEventListener('click', startGroupOrderFlow);
    }
}

function startGroupOrderFlow() {
    // Show Host Setup Modal (simplified for now)
    const hostName = prompt("Enter your name to start the group order:");
    if (!hostName) return;

    const formData = new FormData();
    formData.append('host_name', hostName);

    fetch('api/start_group.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('ts_is_host', 'true');
            localStorage.setItem('ts_group_id', data.group_id);
            localStorage.setItem('ts_user_name', hostName);
            showShareModal(data.share_link);
            activateGroupSession(data.group_id, hostName);
            startCartPolling(data.group_id);
        } else {
            alert("Error: " + data.message);
        }
    });
}

function showShareModal(link) {
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent("Join my Temple Street group order: " + link)}`;
    const modalHtml = `
        <div class="modal-overlay" id="share-modal">
            <div class="modal-content">
                <h3 class="modal-title">Group Started! 👥</h3>
                <p>Share this link with your friends to let them join your cart.</p>
                <div class="mt-20">
                    <a href="${whatsappLink}" target="_blank" class="modal-btn whatsapp-btn">Share on WhatsApp</a>
                </div>
                <button class="modal-btn" id="close-share-modal">I'm Done</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('close-share-modal').addEventListener('click', () => {
        document.getElementById('share-modal').remove();
    });
}

function handleGuestEntry(groupId, hostName) {
    const guestModalHtml = `
        <div class="modal-overlay" id="guest-modal">
            <div class="modal-content">
                <h3 class="modal-title">Join ${hostName}'s Order</h3>
                <div class="input-group">
                    <label>Your Name</label>
                    <input type="text" id="guest-name-input" class="modal-input" placeholder="e.g. Satish">
                </div>
                <div class="input-group">
                    <label>Dietary Preference</label>
                    <div class="tag-selector">
                        <div class="tag-option active" data-tag="Veg">Veg</div>
                        <div class="tag-option" data-tag="Jain">Jain</div>
                        <div class="tag-option" data-tag="Vegan">Vegan</div>
                    </div>
                    <input type="hidden" id="dietary-tag" value="Veg">
                </div>
                <button class="modal-btn" id="join-group-btn">Join Group ➔</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', guestModalHtml);

    document.querySelectorAll('.tag-option').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.tag-option').forEach(opt => opt.classList.remove('active'));
            el.classList.add('active');
            document.getElementById('dietary-tag').value = el.getAttribute('data-tag');
        });
    });

    document.getElementById('join-group-btn').addEventListener('click', () => {
        joinGroupOrder(groupId);
    });
}

function joinGroupOrder(groupId) {
    const guestName = document.getElementById('guest-name-input').value;
    const dietaryTag = document.getElementById('dietary-tag').value;

    if (!guestName) {
        alert("Please enter your name");
        return;
    }

    const formData = new FormData();
    formData.append('group_id', groupId);
    formData.append('guest_name', guestName);
    formData.append('dietary_tag', dietaryTag);

    fetch('api/join_group.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('ts_guest_id', data.guest_id);
            localStorage.setItem('ts_group_id', data.group_id);
            localStorage.setItem('ts_user_name', guestName);
            document.getElementById('guest-modal').remove();
            activateGroupSession(groupId, "Active");
            startCartPolling(groupId);
        } else {
            alert(data.message);
        }
    });
};

function activateGroupSession(groupId, name) {
    if (document.querySelector('.group-status-banner')) return;

    const bannerHtml = `
        <div class="group-status-banner">
            <span>👥 Group Order Active</span>
            <span id="group-id-display">ID: ${groupId}</span>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', bannerHtml);
    document.getElementById('glowing-cart').classList.remove('hidden');

    // Add event listener to glowing cart
    document.getElementById('glowing-cart').addEventListener('click', toggleCartDrawer);
}

function startCartPolling(groupId) {
    if (cartPollingInterval) clearInterval(cartPollingInterval);
    fetchGroupCart(groupId);
    cartPollingInterval = setInterval(() => fetchGroupCart(groupId), 5000);
}

function fetchGroupCart(groupId) {
    fetch(`api/get_cart.php?group_id=${groupId}`)
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            updateCartUI(data.cart);
        }
    });
}

function updateCartUI(cart) {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) {
        createCartDrawer();
    }

    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';

    let totalItems = 0;

    for (const [guestName, items] of Object.entries(cart)) {
        const guestSection = document.createElement('div');
        guestSection.className = 'guest-cart-section';
        guestSection.innerHTML = `<h4 class="guest-name-header">${guestName}'s Items</h4>`;

        items.forEach(item => {
            totalItems += item.qty;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item-row';
            itemEl.innerHTML = `
                <span>${item.item_id} x ${item.qty}</span>
                <button class="remove-item-btn" onclick="removeItem('${item.item_id}', ${item.guest_id})">✕</button>
            `;
            guestSection.appendChild(itemEl);
        });
        container.appendChild(guestSection);
    }

    document.getElementById('cart-count').innerText = totalItems;
}

function createCartDrawer() {
    const drawerHtml = `
        <div id="cart-drawer" class="cart-drawer hidden">
            <div class="drawer-header">
                <h3>Your Group Cart 🛒</h3>
                <button class="close-drawer" onclick="toggleCartDrawer()">✕</button>
            </div>
            <div id="cart-items-container" class="drawer-body">
                <!-- Items injected here -->
            </div>
            <div class="drawer-footer">
                <button id="checkout-btn" class="checkout-btn disabled" disabled>Only Host can Checkout</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', drawerHtml);

    if (localStorage.getItem('ts_is_host') === 'true') {
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.innerText = "Checkout Now ➔";
        checkoutBtn.classList.remove('disabled');
        checkoutBtn.disabled = false;
    }
}

window.toggleCartDrawer = function() {
    document.getElementById('cart-drawer').classList.toggle('hidden');
};

window.removeItem = function(itemId, guestId) {
    const groupId = localStorage.getItem('ts_group_id');
    const currentGuestId = localStorage.getItem('ts_guest_id');
    const isHost = localStorage.getItem('ts_is_host') === 'true';

    if (!isHost && currentGuestId != guestId) {
        alert("You can only remove your own items!");
        return;
    }

    const formData = new FormData();
    formData.append('group_id', groupId);
    formData.append('guest_id', guestId);
    formData.append('item_id', itemId);

    fetch('api/remove_from_cart.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) fetchGroupCart(groupId);
    });
};
