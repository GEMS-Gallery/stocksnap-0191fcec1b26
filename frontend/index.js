import { backend } from "declarations/backend";

const API_KEY = "crjpakpr01qnnbrso6l0crjpakpr01qnnbrso6lg";
const BASE_URL = "https://finnhub.io/api/v1";

// Initialize Feather Icons
feather.replace();

let activities = [];
let allocations = {};
let charts = {};

async function fetchData() {
    activities = await backend.getActivities();
    allocations = await backend.getAllocations();
    updateUI();
}

function updateUI() {
    updateActivityTable();
    updateHoldingsGrid();
    updateCharts();
}

function updateActivityTable() {
    const tableBody = document.getElementById('activity-table-body');
    tableBody.innerHTML = '';
    
    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(activity.date / 1000000).toLocaleString()}</td>
            <td>${activity.symbol}</td>
            <td>${activity.activityType}</td>
            <td>${activity.quantity.toFixed(4)}</td>
            <td>${activity.unitPrice.toFixed(2)}</td>
            <td>${activity.currency}</td>
            <td>${activity.fee.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateHoldingsGrid() {
    const grid = document.getElementById('holdings-grid');
    grid.innerHTML = '';
    
    // Implement this based on your holdings data structure
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
                backgroundColor: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6']
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

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: {
                font: {
                    family: 'Inter'
                }
            }
        }
    }
};

function showPage(pageName) {
    const pages = document.querySelectorAll('#activity-page, #allocations-page');
    const tabs = document.querySelectorAll('.tab');
    
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        }
    });

    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.id === `${pageName}-tab`) {
            tab.classList.add('active');
        }
    });
}

// Add event listeners for tabs
document.getElementById('activity-tab').addEventListener('click', () => showPage('activity'));
document.getElementById('allocations-tab').addEventListener('click', () => showPage('allocations'));

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
    const date = document.getElementById("activity-date").value;
    const symbol = document.getElementById("symbol-input").value.toUpperCase();
    const quantity = parseFloat(document.getElementById("quantity-input").value);
    const activityType = document.getElementById("activity-type").value;
    const unitPrice = parseFloat(document.getElementById("price-input").value);
    const currency = document.getElementById("currency-input").value.toUpperCase();
    const fee = parseFloat(document.getElementById("fee-input").value);

    try {
        await backend.addActivity(date, symbol, quantity, activityType, unitPrice, currency, fee);
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
            const [date, symbol, quantity, activityType, unitPrice, currency, fee] = line.split(',');
            activities.push({
                date,
                symbol,
                quantity: parseFloat(quantity),
                activityType,
                unitPrice: parseFloat(unitPrice),
                currency,
                fee: parseFloat(fee)
            });
        }
    }

    return activities;
}

// Initial data fetch
fetchData();
