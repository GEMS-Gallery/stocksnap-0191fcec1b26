import { backend } from "declarations/backend";

const API_KEY = "crjpakpr01qnnbrso6l0crjpakpr01qnnbrso6lg";
const BASE_URL = "https://finnhub.io/api/v1";

// Initialize Feather Icons
feather.replace();

let holdings = [];
let allocations = {};
let charts = {};

async function fetchData() {
    holdings = await backend.getHoldings();
    allocations = await backend.getAllocations();
    updateUI();
}

function updateUI() {
    updateHoldingsTable();
    updateHoldingsGrid();
    updateCharts();
}

function updateHoldingsTable() {
    const tableBody = document.getElementById('holdings-table-body');
    tableBody.innerHTML = '';
    
    holdings.forEach(holding => {
        const row = document.createElement('tr');
        const marketValue = holding.quantity * holding.currentPrice;
        const performance = ((holding.currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100;
        const performanceValue = (marketValue - (holding.quantity * holding.purchasePrice));
        
        row.innerHTML = `
            <td><span class="stock-symbol">${holding.symbol}</span> ${holding.name}</td>
            <td>${holding.quantity.toFixed(4)}</td>
            <td>$${marketValue.toFixed(2)}</td>
            <td>$${holding.currentPrice.toFixed(2)}</td>
            <td class="${performance >= 0 ? 'positive' : 'negative'}">
                ${performance.toFixed(2)}%<br>$${performanceValue.toFixed(2)}
            </td>
            <td>${holding.assetType}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateHoldingsGrid() {
    const grid = document.getElementById('holdings-grid');
    grid.innerHTML = '';
    
    holdings.forEach(holding => {
        const performance = ((holding.currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100;
        const div = document.createElement('div');
        div.className = `holding-item ${performance >= 0 ? '' : 'negative'}`;
        div.innerHTML = `
            <div>${holding.symbol}</div>
            <div class="performance ${performance >= 0 ? 'positive' : 'negative'}">
                ${performance >= 0 ? '+' : ''}${performance.toFixed(2)}%
            </div>
        `;
        grid.appendChild(div);
    });
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
    // Remember to destroy existing chart before creating a new one
}

function updateSectorsChart() {
    // Implement this function based on your data structure
    // Remember to destroy existing chart before creating a new one
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
    const pages = document.querySelectorAll('#holdings-page, #allocations-page');
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
document.getElementById('holdings-tab').addEventListener('click', () => showPage('holdings'));
document.getElementById('allocations-tab').addEventListener('click', () => showPage('allocations'));

// Add Asset Modal
const modal = document.getElementById("add-asset-modal");
const btn = document.getElementById("add-asset-btn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Autocomplete for symbol input
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

let symbols = [];

async function fetchSymbols(query) {
    try {
        const response = await fetch(`${BASE_URL}/search?q=${query}&token=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.result.map(item => `${item.symbol} - ${item.description}`);
    } catch (error) {
        console.error("Error fetching symbols:", error);
        return [];
    }
}

document.getElementById("symbol-input").addEventListener("input", async function(e) {
    if (this.value.length > 1) {
        symbols = await fetchSymbols(this.value);
        autocomplete(this, symbols);
    }
});

// Add Asset Form Submission
document.getElementById("add-asset-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const transactionType = document.getElementById("transaction-type").value;
    const transactionDate = document.getElementById("transaction-date").value;
    const symbol = document.getElementById("symbol-input").value.split(" - ")[0];
    const shares = parseFloat(document.getElementById("shares-input").value);
    const price = parseFloat(document.getElementById("price-input").value);
    const fee = parseFloat(document.getElementById("fee-input").value);

    try {
        const [quoteData, companyData] = await Promise.all([
            fetchQuote(symbol),
            fetchCompanyProfile(symbol)
        ]);

        if (!quoteData || !companyData) {
            throw new Error("Failed to fetch stock data");
        }

        const name = companyData.name || "Unknown";
        const currentPrice = quoteData.c || 0;
        const assetType = "Equity";
        const sector = companyData.finnhubIndustry || "Unknown";

        await backend.addTransaction(transactionType, transactionDate, symbol, name, shares, price, fee, currentPrice, assetType, sector);
        
        modal.style.display = "none";
        fetchData(); // Refresh the data
    } catch (error) {
        console.error("Error adding asset:", error);
        alert("Error adding asset. Please try again.");
    }
});

async function fetchQuote(symbol) {
    try {
        const response = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching quote:", error);
        return null;
    }
}

async function fetchCompanyProfile(symbol) {
    try {
        const response = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching company profile:", error);
        return null;
    }
}

// Initial data fetch
fetchData();
