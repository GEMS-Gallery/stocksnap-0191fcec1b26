import Hash "mo:base/Hash";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor {
  type Holding = {
    quantity: Float;
    purchasePrice: Float;
  };

  stable var holdingsEntries : [(Text, Holding)] = [];
  let holdings = HashMap.HashMap<Text, Holding>(10, Text.equal, Text.hash);

  public func addHolding(symbol: Text, quantity: Float, purchasePrice: Float) : async () {
    let currentHolding = holdings.get(symbol);
    let (newQuantity, newPurchasePrice) = switch (currentHolding) {
      case (null) {
        (quantity, purchasePrice)
      };
      case (?existing) {
        let totalQuantity = existing.quantity + quantity;
        let totalValue = existing.quantity * existing.purchasePrice + quantity * purchasePrice;
        (totalQuantity, totalValue / totalQuantity)
      };
    };
    holdings.put(symbol, { quantity = newQuantity; purchasePrice = newPurchasePrice });
  };

  public query func getHoldings() : async [(Text, Holding)] {
    Iter.toArray(holdings.entries())
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
