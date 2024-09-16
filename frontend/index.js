import { backend } from "declarations/backend";

const API_KEY = "crjpakpr01qnnbrso6l0crjpakpr01qnnbrso6lg";
const BASE_URL = "https://finnhub.io/api/v1";

let currentSymbol = "";
let currentPrice = 0;

document.getElementById("stockForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const symbol = document.getElementById("symbolInput").value.toUpperCase();
    currentSymbol = symbol;
    try {
        const [quoteData, companyData] = await Promise.all([
            fetchQuote(symbol),
            fetchCompanyProfile(symbol)
        ]);
        currentPrice = quoteData.c;
        displayStockInfo(quoteData, companyData);
        document.getElementById("addHolding").style.display = "block";
    } catch (error) {
        console.error("Error fetching stock data:", error);
        document.getElementById("stockInfo").innerHTML = "Error fetching stock data. Please try again.";
        document.getElementById("addHolding").style.display = "none";
    }
});

document.getElementById("addHoldingBtn").addEventListener("click", async () => {
    const quantity = parseFloat(document.getElementById("quantityInput").value);
    const purchasePrice = parseFloat(document.getElementById("purchasePriceInput").value);
    if (quantity > 0 && purchasePrice > 0) {
        await backend.addHolding(currentSymbol, quantity, purchasePrice);
        document.getElementById("quantityInput").value = "";
        document.getElementById("purchasePriceInput").value = "";
        updateHoldings();
    }
});

async function fetchQuote(symbol) {
    const response = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`);
    return response.json();
}

async function fetchCompanyProfile(symbol) {
    const response = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
    return response.json();
}

function displayStockInfo(quoteData, companyData) {
    const stockInfo = document.getElementById("stockInfo");
    stockInfo.innerHTML = `
        <h2>${companyData.name} (${currentSymbol})</h2>
        <p>Current Price: $${quoteData.c.toFixed(2)}</p>
        <p>Change: ${quoteData.d.toFixed(2)} (${quoteData.dp.toFixed(2)}%)</p>
    `;
}

async function updateHoldings() {
    const holdings = await backend.getHoldings();
    const holdingsDiv = document.getElementById("holdings");
    if (holdings.length === 0) {
        holdingsDiv.innerHTML = "<p>No holdings yet.</p>";
    } else {
        const holdingsList = holdings.map(([symbol, holding]) => {
            const currentValue = holding.quantity * currentPrice;
            const purchaseValue = holding.quantity * holding.purchasePrice;
            const performance = ((currentValue - purchaseValue) / purchaseValue) * 100;
            return `<li>
                ${symbol}: ${holding.quantity.toFixed(2)} shares
                <br>Purchase Price: $${holding.purchasePrice.toFixed(2)}
                <br>Current Value: $${currentValue.toFixed(2)}
                <br>Performance: ${performance.toFixed(2)}%
            </li>`;
        }).join("");
        holdingsDiv.innerHTML = `<ul>${holdingsList}</ul>`;
    }
}

updateHoldings();
