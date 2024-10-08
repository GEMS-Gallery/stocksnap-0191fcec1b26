import { backend } from "declarations/backend";

const API_KEY = "crjpakpr01qnnbrso6l0crjpakpr01qnnbrso6lg";
const BASE_URL = "https://finnhub.io/api/v1";

// Initialize Feather Icons
feather.replace();

let activities = [];
let holdings = [];
let allocations = {};
let charts = {};
let baseCurrency = "USD";

async function fetchData() {
    activities = await backend.getActivities();
    holdings = await backend.getHoldings();
    allocations = await backend.getAllocations();
    baseCurrency = await backend.getBaseCurrency();
    updateUI();
}

function updateUI() {
    updateHoldingsTable();
    updateActivityTable();
    updateCharts();
    updateCurrencyDisplay();
}

async function getCompanyName(symbol) {
    try {
        const response = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
        const data = await response.json();
        return data.name || symbol;
    } catch (error) {
        console.error("Error fetching company name:", error);
        return symbol;
    }
}

function formatDate(timestamp) {
    const date = new Date(Number(timestamp) / 1000000);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

async function updateHoldingsTable() {
    const tableBody = document.getElementById('holdings-table-body');
    tableBody.innerHTML = '';
    
    for (const holding of holdings) {
        const row = document.createElement('tr');
        const companyName = await getCompanyName(holding.symbol);
        row.innerHTML = `
            <td>${holding.symbol} - ${companyName}</td>
            <td>${holding.quantity.toFixed(4)}</td>
            <td>${holding.marketValue.toFixed(2)} ${baseCurrency}</td>
            <td>${holding.marketPrice.toFixed(2)} ${baseCurrency}</td>
            <td>${holding.performance.toFixed(2)}%</td>
            <td>${holding.assetType}</td>
        `;
        tableBody.appendChild(row);
    }
}

async function updateActivityTable() {
    const tableBody = document.getElementById('activity-table-body');
    tableBody.innerHTML = '';
    
    for (const activity of activities) {
        const row = document.createElement('tr');
        const value = activity.shares * activity.price;
        const companyName = await getCompanyName(activity.symbol);
        row.innerHTML = `
            <td>${formatDate(activity.date)}</td>
            <td><span class="activity-type ${activity.activityType}">${activity.activityType}</span></td>
            <td>${activity.symbol} - ${companyName}</td>
            <td>${activity.shares.toFixed(4)}</td>
            <td>${activity.price.toFixed(2)} ${baseCurrency}</td>
            <td>${activity.fee.toFixed(2)} ${baseCurrency}</td>
            <td>${value.toFixed(2)} ${baseCurrency}</td>
            <td>${activity.account}</td>
        `;
        tableBody.appendChild(row);
    }
}

function updateCharts() {
    updateAllocationChart();
    updateClassesChart();
    updateSectorsChart();
}

function updateAllocationChart() {
    const ctx = document.getElementById('allocationChart').getContext('2d');
    if (charts.allocation) {
        charts.allocation.destroy();
    }
    charts.allocation = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Equity', 'Fixed Income', 'Cash', 'Crypto'],
            datasets: [{
                data: [
                    allocations.equity,
                    allocations.fixedIncome,
                    allocations.cash,
                    allocations.crypto
                ],
                backgroundColor: ['#333', '#555', '#777', '#999']
            }]
        },
        options: chartOptions
    });
}

function updateClassesChart() {
    // Implement this function based on your data structure
}

function updateSectorsChart() {
    // Implement this function based on your data structure
}

function updateCurrencyDisplay() {
    document.getElementById('base-currency').value = baseCurrency;
    // Update other currency displays in the UI
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: {
                font: {
                    family: 'Roboto Mono'
                },
                color: '#000'
            }
        }
    }
};

function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        }
    });

    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Add event listeners for sidebar items
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => showPage(item.dataset.page));
});

// Add Manually Modal
const addManuallyModal = document.getElementById("add-manually-modal");
const addManuallyBtn = document.getElementById("add-manually-btn");
const addManuallySpan = addManuallyModal.querySelector(".close");

addManuallyBtn.onclick = function() {
    addManuallyModal.style.display = "block";
}

addManuallySpan.onclick = function() {
    addManuallyModal.style.display = "none";
}

// Upload CSV Modal
const uploadCSVModal = document.getElementById("upload-csv-modal");
const uploadCSVBtn = document.getElementById("upload-csv-btn");
const uploadCSVSpan = uploadCSVModal.querySelector(".close");

uploadCSVBtn.onclick = function() {
    uploadCSVModal.style.display = "block";
}

uploadCSVSpan.onclick = function() {
    uploadCSVModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == addManuallyModal) {
        addManuallyModal.style.display = "none";
    }
    if (event.target == uploadCSVModal) {
        uploadCSVModal.style.display = "none";
    }
}

// Add Activity Form Submission
document.getElementById("add-activity-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const account = document.getElementById("account-input").value;
    const activityType = document.getElementById("activity-type").value;
    const date = document.getElementById("activity-date").value;
    const symbol = document.getElementById("symbol-input").value.toUpperCase();
    const shares = parseFloat(document.getElementById("shares-input").value);
    const price = parseFloat(document.getElementById("price-input").value);
    const fee = parseFloat(document.getElementById("fee-input").value);

    try {
        await backend.addActivity(account, activityType, date, symbol, shares, price, fee);
        addManuallyModal.style.display = "none";
        fetchData(); // Refresh the data
    } catch (error) {
        console.error("Error adding activity:", error);
        alert("Error adding activity. Please try again.");
    }
});

// CSV Upload
const dropZone = document.getElementById('csv-drop-zone');
const fileInput = document.getElementById('csv-file-input');
const importBtn = document.getElementById('import-csv-btn');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    fileInput.files = e.dataTransfer.files;
    validateCSV(fileInput.files[0]);
});

fileInput.addEventListener('change', () => {
    validateCSV(fileInput.files[0]);
});

function validateCSV(file) {
    if (file && file.type === 'text/csv') {
        importBtn.disabled = false;
    } else {
        importBtn.disabled = true;
        alert('Please select a valid CSV file.');
    }
}

importBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        const csv = e.target.result;
        const activities = parseCSV(csv);
        
        try {
            await backend.importActivities(activities);
            uploadCSVModal.style.display = "none";
            fetchData(); // Refresh the data
            alert('CSV imported successfully!');
        } catch (error) {
            console.error("Error importing CSV:", error);
            alert("Error importing CSV. Please check the file format and try again.");
        }
    };

    reader.readAsText(file);
});

function parseCSV(csv) {
    const lines = csv.split('\n');
    const activities = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const [date, account, symbol, shares, activityType, price, fee] = line.split(',');
            activities.push({
                date,
                account,
                symbol,
                shares: parseFloat(shares),
                activityType,
                price: parseFloat(price),
                fee: parseFloat(fee)
            });
        }
    }

    return activities;
}

// Settings
document.getElementById('save-settings').addEventListener('click', async () => {
    const newBaseCurrency = document.getElementById('base-currency').value;
    try {
        await backend.setBaseCurrency(newBaseCurrency);
        baseCurrency = newBaseCurrency;
        updateUI();
        alert('Settings saved successfully!');
    } catch (error) {
        console.error("Error saving settings:", error);
        alert("Error saving settings. Please try again.");
    }
});

// Initial data fetch and page setup
fetchData();
showPage('holdings');
document.querySelector('.tablinks').click();
