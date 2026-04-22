/**
 * Temple Street 2030 - Multiplayer Group Order Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initGroupOrder();
});

function initGroupOrder() {
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('group');
    const hostName = urlParams.get('host');

    if (groupId && hostName) {
        handleGuestEntry(groupId, hostName);
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
            showShareModal(data.share_link);
            activateGroupSession(data.group_id, hostName);
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
            document.getElementById('guest-modal').remove();
            activateGroupSession(groupId, "Host"); // Placeholder for host name
        } else {
            alert(data.message);
        }
    });
};

function activateGroupSession(groupId, name) {
    const bannerHtml = `
        <div class="group-status-banner">
            <span>👥 Group Order Active</span>
            <span id="group-id-display">ID: ${groupId}</span>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', bannerHtml);
    document.getElementById('glowing-cart').classList.remove('hidden');
}
