"use client";

import * as React from "react";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const LOAN_TERMS = [
  { label: "3 years (36 months)", value: 36 },
  { label: "4 years (48 months)", value: 48 },
  { label: "5 years (60 months)", value: 60 },
  { label: "6 years (72 months)", value: 72 },
  { label: "7 years (84 months)", value: 84 },
  { label: "8 years (96 months)", value: 96 },
  { label: "9 years (108 months)", value: 108 },
  { label: "10 years (120 months)", value: 120 },
];

export function LoanCalculator() {
  const [purchasePrice, setPurchasePrice] = React.useState("");
  const [downPayment, setDownPayment] = React.useState("");
  const [interestRate, setInterestRate] = React.useState("");
  const [loanTerm, setLoanTerm] = React.useState("");
  const [monthlyPayment, setMonthlyPayment] = React.useState<number | null>(null);
  const [error, setError] = React.useState("");

  const calculatePayment = () => {
    setError("");
    setMonthlyPayment(null);

    const price = parseFloat(purchasePrice.replace(/,/g, ""));
    const down = parseFloat(downPayment.replace(/,/g, "")) || 0;
    const rate = parseFloat(interestRate);
    const months = parseInt(loanTerm);

    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid purchase price");
      return;
    }
    if (down < 0) {
      setError("Down payment cannot be negative");
      return;
    }
    if (down >= price) {
      setError("Down payment must be less than purchase price");
      return;
    }
    if (isNaN(rate) || rate <= 0) {
      setError("Please enter a valid interest rate");
      return;
    }
    if (isNaN(months) || months <= 0) {
      setError("Please select a loan term");
      return;
    }

    // Calculate monthly payment using standard amortization formula
    const principal = price - down;
    const monthlyRate = rate / 100 / 12;

    // M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const payment =
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    setMonthlyPayment(payment);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Loan Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Estimate your monthly payment. This is for informational purposes only
          and does not constitute a loan offer.
        </p>

        {/* Purchase Price */}
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
          <Input
            id="purchasePrice"
            type="text"
            placeholder="75,000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <Label htmlFor="downPayment">Down Payment ($)</Label>
          <Input
            id="downPayment"
            type="text"
            placeholder="15,000"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.01"
            placeholder="6.99"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label htmlFor="loanTerm">Loan Term</Label>
          <Select value={loanTerm} onValueChange={setLoanTerm}>
            <SelectTrigger>
              <SelectValue placeholder="Select loan term" />
            </SelectTrigger>
            <SelectContent>
              {LOAN_TERMS.map((term) => (
                <SelectItem key={term.value} value={term.value.toString()}>
                  {term.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Calculate Button */}
        <Button onClick={calculatePayment} className="w-full">
          Calculate Payment
        </Button>

        {/* Result */}
        {monthlyPayment !== null && (
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(monthlyPayment)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Loan Amount: {formatCurrency(parseFloat(purchasePrice.replace(/,/g, "")) - (parseFloat(downPayment.replace(/,/g, "")) || 0))}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
