import Char "mo:base/Char";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type Holding = {
    symbol: Text;
    name: Text;
    quantity: Float;
    purchasePrice: Float;
    currentPrice: Float;
    assetType: Text;
    sector: Text;
  };

  type Transaction = {
    transactionType: Text;
    date: Int;
    symbol: Text;
    name: Text;
    shares: Float;
    price: Float;
    fee: Float;
    currentPrice: Float;
    assetType: Text;
    sector: Text;
  };

  stable var holdingsEntries : [(Text, Holding)] = [];
  stable var transactionsEntries : [Transaction] = [];
  let holdings = HashMap.HashMap<Text, Holding>(10, Text.equal, Text.hash);
  var transactions : [Transaction] = [];

  public func addTransaction(transactionType: Text, date: Text, symbol: Text, name: Text, shares: Float, price: Float, fee: Float, currentPrice: Float, assetType: Text, sector: Text) : async () {
    let transaction : Transaction = {
      transactionType = transactionType;
      date = textToTimestamp(date);
      symbol = symbol;
      name = name;
      shares = shares;
      price = price;
      fee = fee;
      currentPrice = currentPrice;
      assetType = assetType;
      sector = sector;
    };
    transactions := Array.append(transactions, [transaction]);
    updateHolding(transaction);
  };

  func updateHolding(transaction: Transaction) {
    switch (holdings.get(transaction.symbol)) {
      case (null) {
        if (transaction.transactionType == "buy") {
          let newHolding : Holding = {
            symbol = transaction.symbol;
            name = transaction.name;
            quantity = transaction.shares;
            purchasePrice = transaction.price;
            currentPrice = transaction.currentPrice;
            assetType = transaction.assetType;
            sector = transaction.sector;
          };
          holdings.put(transaction.symbol, newHolding);
        };
      };
      case (?existingHolding) {
        var newQuantity = existingHolding.quantity;
        var newPurchasePrice = existingHolding.purchasePrice;

        switch (transaction.transactionType) {
          case "buy" {
            let totalCost = (existingHolding.quantity * existingHolding.purchasePrice) + (transaction.shares * transaction.price);
            newQuantity += transaction.shares;
            newPurchasePrice := totalCost / newQuantity;
          };
          case "sell" {
            newQuantity -= transaction.shares;
          };
          case _ {};
        };

        let updatedHolding : Holding = {
          symbol = existingHolding.symbol;
          name = existingHolding.name;
          quantity = newQuantity;
          purchasePrice = newPurchasePrice;
          currentPrice = transaction.currentPrice;
          assetType = existingHolding.assetType;
          sector = existingHolding.sector;
        };
        holdings.put(transaction.symbol, updatedHolding);
      };
    };
  };

  public query func getHoldings() : async [Holding] {
    Iter.toArray(holdings.vals())
  };

  public query func getTransactions() : async [Transaction] {
    transactions
  };

  public query func getAllocations() : async {equity: Float; fixedIncome: Float; cash: Float; crypto: Float} {
    var equity : Float = 0;
    var fixedIncome : Float = 0;
    var cash : Float = 0;
    var crypto : Float = 0;

    for (holding in holdings.vals()) {
      let value = holding.quantity * holding.currentPrice;
      switch (holding.assetType) {
        case "Equity" { equity += value };
        case "Fixed Income" { fixedIncome += value };
        case "Cash" { cash += value };
        case "Crypto" { crypto += value };
        case _ {};
      };
    };

    let total = equity + fixedIncome + cash + crypto;
    {
      equity = if (total > 0) equity / total * 100 else 0;
      fixedIncome = if (total > 0) fixedIncome / total * 100 else 0;
      cash = if (total > 0) cash / total * 100 else 0;
      crypto = if (total > 0) crypto / total * 100 else 0;
    }
  };

  func textToTimestamp(dateText: Text) : Int {
    // This is a simplified conversion. You might want to use a proper date library.
    let parts = Iter.toArray(Text.split(dateText, #text("-")));
    if (parts.size() == 3) {
      let year = textToNat(parts[0]);
      let month = textToNat(parts[1]);
      let day = textToNat(parts[2]);
      // This is a very rough approximation. Use a proper date library for accurate results.
      return (year * 365 * 24 * 3600 + month * 30 * 24 * 3600 + day * 24 * 3600) * 1_000_000_000;
    };
    return 0; // Return 0 if conversion fails
  };

  func textToNat(t: Text) : Nat {
    var n : Nat = 0;
    for (c in t.chars()) {
      let d = Nat32.toNat(Char.toNat32(c) - 48);
      if (d >= 0 and d <= 9) {
        n := n * 10 + d;
      };
    };
    n
  };

  system func preupgrade() {
    holdingsEntries := Iter.toArray(holdings.entries());
    transactionsEntries := transactions;
  };

  system func postupgrade() {
    for ((symbol, holding) in holdingsEntries.vals()) {
      holdings.put(symbol, holding);
    };
    transactions := transactionsEntries;
  };
}
