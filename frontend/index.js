import { backend } from "declarations/backend";

// Initialize Feather Icons
feather.replace();

let holdings = [];
let allocations = {};

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
    new Chart(ctx, {
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

// Initial data fetch
fetchData();
