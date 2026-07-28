import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

export default function SimulationResults({ results }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Card className="border border-border bg-card shadow-sm rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Simulation Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold font-serif text-foreground mb-1">
                {results.avg_waiting_time?.toFixed(1) || 0}
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> Avg Wait (min)
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-serif text-foreground mb-1">
                {results.throughput || 0}
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Users className="w-3 h-3" /> Per Hour
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-serif text-foreground mb-1">
                {results.optimization_score || 0}%
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" /> Opt Score
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-serif text-foreground mb-1">
                {results.bottlenecks?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Bottlenecks
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-border bg-card shadow-sm rounded-md">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Wait Time Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Security Checkpoint</span>
              <span className="font-semibold text-foreground">{results.security_wait?.toFixed(1) || 0} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Check-in Counter</span>
              <span className="font-semibold text-foreground">{results.checkin_wait?.toFixed(1) || 0} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Boarding Gate</span>
              <span className="font-semibold text-foreground">{results.boarding_wait?.toFixed(1) || 0} min</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm rounded-md">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Identified Bottlenecks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.bottlenecks?.map((bottleneck, idx) => (
                <Badge 
                  key={idx} 
                  className="bg-amber-100 text-amber-700 border-amber-200"
                >
                  {bottleneck}
                </Badge>
              )) || <span className="text-slate-500">No bottlenecks detected</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border border-border bg-card shadow-sm rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl">
            <Lightbulb className="w-5 h-5 text-primary" />
            AI-Generated Recommendations
          </CardTitle>
          <p className="text-sm text-muted-foreground">Optimization strategies based on simulation results</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {results.recommendations?.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-md border border-border">
                <div className="w-6 h-6 rounded-sm bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-foreground">{rec}</p>
              </li>
            )) || <span className="text-muted-foreground">No recommendations available</span>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}