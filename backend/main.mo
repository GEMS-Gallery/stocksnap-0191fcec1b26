import Hash "mo:base/Hash";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor {
  stable var holdingsEntries : [(Text, Float)] = [];
  let holdings = HashMap.HashMap<Text, Float>(10, Text.equal, Text.hash);

  public func addHolding(symbol: Text, quantity: Float) : async () {
    let currentQuantity = switch (holdings.get(symbol)) {
      case (null) { 0 : Float };
      case (?value) { value };
    };
    holdings.put(symbol, currentQuantity + quantity);
  };

  public query func getHoldings() : async [(Text, Float)] {
    Iter.toArray(holdings.entries())
  };

  system func preupgrade() {
    holdingsEntries := Iter.toArray(holdings.entries());
  };

  system func postupgrade() {
    for ((symbol, quantity) in holdingsEntries.vals()) {
      holdings.put(symbol, quantity);
    };
  };
}
