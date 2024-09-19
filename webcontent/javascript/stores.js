const storeList = 'dominos,pizzahut'; // Add more store names here as needed

const storeFiles = {};
storeList.split(',').forEach(store => {
    storeFiles[store] = [];
    for (let i = 1; i <= 5; i++) {
        storeFiles[store].push(`csv/${store}${i}.csv`);
    }
});

const storeIconsContainer = document.getElementById('storeIcons');
const messageContainer = document.getElementById('message');

// Function to create store icons dynamically
function createStoreIcons() {
    storeList.split(',').forEach(store => {
        const icon = document.createElement('img');
        icon.src = `images/${store}.png`; // Assuming icon names match store names
        icon.alt = store.charAt(0).toUpperCase() + store.slice(1);
        icon.className = 'store-icon';
        icon.dataset.store = store;
        storeIconsContainer.appendChild(icon);
    });
}

let allStoreData = [];
let currentLocation = null;

function parseCSV(data) {
    const rows = data.trim().split('\n');
    if (rows.length === 0) return [];

    const headers = parseCSVLine(rows[0]);

    const relevantColumns = ['Name', 'Fulladdress', 'Phone', 'Google Maps URL', 'Latitude', 'Longitude'];
    const indices = relevantColumns.map(col => headers.indexOf(col));

    return rows.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj = {};
        relevantColumns.forEach((col, index) => {
            obj[col] = values[indices[index]] || '';
        });
        if (Object.values(obj).every(value => !value.trim())) {
            return null;
        }
        return obj;
    }).filter(row => row);
}

function parseCSVLine(line) {
    const regex = /(?:,|\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^",\n\r]*))/g;
    const values = [];
    let match;
    while (match = regex.exec(line)) {
        values.push(match[1] ? match[1].replace(/""/g, '"') : match[2]);
    }
    return values;
}

async function fetchCSV(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not fetch ${url}`);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error(error);
        return '';
    }
}

async function loadStoreData(storeType) {
    const tableBody = document.querySelector('#storeTable tbody');
    tableBody.innerHTML = '';
    messageContainer.textContent = ''; // Clear any previous message

    if (!storeType || !storeFiles[storeType]) {
        return;
    }

    const files = storeFiles[storeType];
    allStoreData = [];

    for (const file of files) {
        const csv = await fetchCSV(file);
        if (csv) {
            const data = parseCSV(csv);
            allStoreData = allStoreData.concat(data);
        }
    }
    
    if (allStoreData.length > 0) {
        messageContainer.textContent = `Showing the ${storeType} details`;
    }

    displayData(allStoreData);
}

function displayData(data) {
    const tableBody = document.querySelector('#storeTable tbody');
    tableBody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        const columns = ['Name', 'Fulladdress', 'Phone', 'Google Maps URL'];
        columns.forEach(col => {
            const td = document.createElement('td');
            if (col === 'Google Maps URL') {
                const a = document.createElement('a');
                a.href = row[col];
                a.textContent = 'View on Maps';
                a.target = '_blank';
                td.appendChild(a);
            } else {
                td.textContent = row[col] || ''; // Handle empty cells
            }
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function filterNearbyStores(stores, location, maxDistance) {
    return stores.filter(store => {
        const lat = parseFloat(store['Latitude']);
        const lon = parseFloat(store['Longitude']);
        return !isNaN(lat) && !isNaN(lon) && calculateDistance(location.latitude, location.longitude, lat, lon) <= maxDistance;
    });
}

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, reject);
        } else {
            reject(new Error('Geolocation not supported'));
        }
    });
}

async function showNearbyStores() {
    if (!currentLocation) {
        alert('Unable to determine your location.');
        return;
    }

    const nearbyStores = filterNearbyStores(allStoreData, currentLocation, 10); // 10 km radius
    displayData(nearbyStores);
}

document.getElementById('nearbyButton').addEventListener('click', async () => {
    currentLocation = await getCurrentLocation();
    showNearbyStores();
});

// Initialize store icons
createStoreIcons();

// Attach event listeners to store icons
document.querySelectorAll('.store-icon').forEach(icon => {
	icon.addEventListener('click', async (event) => {
														
		const storeType = event.target.dataset.store;
		await loadStoreData(storeType);
		currentLocation = await getCurrentLocation();
	});
});
