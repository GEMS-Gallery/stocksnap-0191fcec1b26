import Hash "mo:base/Hash";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

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

  stable var holdingsEntries : [(Text, Holding)] = [];
  let holdings = HashMap.HashMap<Text, Holding>(10, Text.equal, Text.hash);

  public func addHolding(symbol: Text, name: Text, quantity: Float, purchasePrice: Float, currentPrice: Float, assetType: Text, sector: Text) : async () {
    let newHolding : Holding = {
      symbol = symbol;
      name = name;
      quantity = quantity;
      purchasePrice = purchasePrice;
      currentPrice = currentPrice;
      assetType = assetType;
      sector = sector;
    };
    holdings.put(symbol, newHolding);
  };

  public query func getHoldings() : async [Holding] {
    Iter.toArray(holdings.vals())
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

  system func preupgrade() {
    holdingsEntries := Iter.toArray(holdings.entries());
  };

  system func postupgrade() {
    for ((symbol, holding) in holdingsEntries.vals()) {
      holdings.put(symbol, holding);
    };
  };
}
