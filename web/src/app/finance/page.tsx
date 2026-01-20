import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoanCalculator } from "./loan-calculator";

export const metadata = {
  title: "Finance",
  description: "Classic and exotic car financing through Woodside Credit",
};

export default function FinancePage() {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-gradient-to-r from-zinc-900 to-zinc-700 md:h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Financing</h1>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Info */}
          <div className="space-y-6">
            {/* Woodside Credit Partnership */}
            <Card>
              <CardHeader>
                <CardTitle>Financing Through Woodside Credit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Authentic Motorcars has partnered with Woodside Credit to offer
                  competitive financing options for classic, exotic, and collector vehicles.
                </p>
                <p className="text-muted-foreground">
                  Woodside Credit specializes in collector car financing with:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>Flexible loan terms from 3 to 10 years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>Competitive interest rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>No prepayment penalties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>Simple application process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>Expert knowledge of collector car values</span>
                  </li>
                </ul>

                <Button asChild className="mt-4">
                  <a
                    href="https://www.woodsidecredit.com/apply"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply Now at Woodside Credit
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Why Finance */}
            <Card>
              <CardHeader>
                <CardTitle>Why Finance Your Classic Car?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Financing your classic or exotic car purchase can be a smart financial
                  decision. Rather than tying up your capital in a single asset, you can
                  preserve liquidity while still enjoying your dream vehicle.
                </p>
                <p>
                  Classic cars have historically appreciated in value, making them not
                  just a passion purchase but potentially a solid investment. With the
                  right financing terms, you can balance ownership enjoyment with
                  financial flexibility.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Calculator */}
          <div>
            <LoanCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}
