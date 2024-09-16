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
  type Activity = {
    date: Int;
    account: Text;
    symbol: Text;
    shares: Float;
    activityType: Text;
    price: Float;
    fee: Float;
  };

  stable var activitiesEntries : [Activity] = [];
  var activities : [Activity] = [];
  stable var baseCurrency : Text = "USD";

  public func addActivity(account: Text, activityType: Text, date: Text, symbol: Text, shares: Float, price: Float, fee: Float) : async () {
    let activity : Activity = {
      date = textToTimestamp(date);
      account = account;
      symbol = symbol;
      shares = shares;
      activityType = activityType;
      price = price;
      fee = fee;
    };
    activities := Array.append(activities, [activity]);
  };

  public func importActivities(newActivities: [Activity]) : async () {
    activities := Array.append(activities, newActivities);
  };

  public query func getActivities() : async [Activity] {
    activities
  };

  public query func getAllocations() : async {equity: Float; fixedIncome: Float; cash: Float; crypto: Float} {
    var equity : Float = 0;
    var fixedIncome : Float = 0;
    var cash : Float = 0;
    var crypto : Float = 0;

    for (activity in activities.vals()) {
      let value = activity.shares * activity.price;
      switch (activity.activityType) {
        case "BUY" {
          if (activity.symbol == "$CASH-USD") {
            cash += value;
          } else {
            equity += value;
          }
        };
        case "SELL" {
          if (activity.symbol == "$CASH-USD") {
            cash -= value;
          } else {
            equity -= value;
          }
        };
        case "DEPOSIT" { cash += value };
        case "WITHDRAWAL" { cash -= value };
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

  public func setBaseCurrency(currency: Text) : async () {
    baseCurrency := currency;
  };

  public query func getBaseCurrency() : async Text {
    baseCurrency
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
    activitiesEntries := activities;
  };

  system func postupgrade() {
    activities := activitiesEntries;
  };
}
