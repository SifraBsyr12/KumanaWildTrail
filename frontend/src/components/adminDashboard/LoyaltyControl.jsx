import { useState } from "react";
import { Label } from "@/components/ui/adminDashboard-ui/Label"; // Adjusted import for Label
import { Switch } from "@/components/ui/adminDashboard-ui/Switch"; // Adjusted import for Switch
import { Input } from "@/components/ui/adminDashboard-ui/Input"; // Adjusted import for Input
import { Button } from "@/components/ui/adminDashboard-ui/Button"; // Adjusted import for Button
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/adminDashboard-ui/Card"; // Adjusted import for Card
import { Slider } from "@/components/ui/adminDashboard-ui/Slider"; // Adjusted import for Slider
import { Toast } from "@/components/ui/adminDashboard-ui/toast"; // Adjusted import for toast

const LoyaltyControl = () => {
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);
  const [pointValue, setPointValue] = useState(0.01); // $0.01 per point
  const [bonusPoints, setBonusPoints] = useState(100);
  const [tierThresholds, setTierThresholds] = useState({
    silver: 500,
    gold: 1000,
    platinum: 2500,
  });

  const handleSaveChanges = () => {
    console.log("Saving loyalty program settings", {
      enabled: loyaltyEnabled,
      pointValue,
      bonusPoints,
      tierThresholds,
    });

    Toast({
      title: "Settings Saved",
      description: "Loyalty program settings have been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair text-lg font-bold text-safari-forest">
          Loyalty Program Controls
        </CardTitle>
        <CardDescription>
          Configure how the customer loyalty program works and set point values.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="loyalty-toggle" className="text-base font-medium">
                Enable Loyalty Program
              </Label>
              <p className="text-sm text-gray-500">
                Allow customers to earn and redeem points for safaris.
              </p>
            </div>
            <Switch
              id="loyalty-toggle"
              checked={loyaltyEnabled}
              onCheckedChange={setLoyaltyEnabled}
            />
          </div>

          {loyaltyEnabled && (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="point-value" className="text-sm font-medium">
                    Point Value (USD)
                  </Label>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-gray-500">$</span>
                    <Input
                      id="point-value"
                      type="number"
                      value={pointValue}
                      onChange={(e) => setPointValue(parseFloat(e.target.value))}
                      step="0.001"
                      min="0.001"
                      max="0.1"
                      className="max-w-[100px]"
                    />
                    <span className="text-gray-500">per point</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Example: 100 points = ${(100 * pointValue).toFixed(2)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="bonus-points" className="text-sm font-medium">
                    First Booking Bonus Points
                  </Label>
                  <div className="flex items-center mt-1 space-x-4">
                    <Slider
                      id="bonus-points"
                      value={[bonusPoints]}
                      min={0}
                      max={500}
                      step={50}
                      onValueChange={(value) => setBonusPoints(value[0])}
                      className="w-[200px]"
                    />
                    <span className="w-12 text-center font-medium">{bonusPoints}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <h3 className="text-sm font-medium mb-2">Loyalty Tier Thresholds</h3>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Label htmlFor="silver" className="text-xs font-medium">Silver</Label>
                      <Input
                        id="silver"
                        type="number"
                        value={tierThresholds.silver}
                        onChange={(e) => setTierThresholds({ ...tierThresholds, silver: parseInt(e.target.value) })}
                        className="h-8"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Label htmlFor="gold" className="text-xs font-medium">Gold</Label>
                      <Input
                        id="gold"
                        type="number"
                        value={tierThresholds.gold}
                        onChange={(e) => setTierThresholds({ ...tierThresholds, gold: parseInt(e.target.value) })}
                        className="h-8"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Label htmlFor="platinum" className="text-xs font-medium">Platinum</Label>
                      <Input
                        id="platinum"
                        type="number"
                        value={tierThresholds.platinum}
                        onChange={(e) => setTierThresholds({ ...tierThresholds, platinum: parseInt(e.target.value) })}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveChanges}
                className="bg-safari-teal hover:bg-safari-teal/80 mt-2"
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyControl;
