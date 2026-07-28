import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingDown, Target } from "lucide-react";
import ComparisonChart from "../components/analytics/ComparisonChart";
import EfficiencyMetrics from "../components/analytics/EfficiencyMetrics";
import ScenarioComparison from "../components/analytics/ScenarioComparison";

export default function Analytics() {
  const { data: simulations = [], isLoading } = useQuery({
    queryKey: ['simulations'],
    queryFn: () => base44.entities.Simulation.list('-created_date', 100),
    initialData: [],
  });

  const completedSims = simulations.filter(s => s.status === 'completed');

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Analytics & Insights</h1>
          <p className="text-slate-600">Deep dive into simulation performance and optimization opportunities</p>
        </div>

        {completedSims.length === 0 ? (
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <BarChart3 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Data Available</h3>
              <p className="text-slate-500">Run simulations to see analytics and insights</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <EfficiencyMetrics simulations={completedSims} />
            <ComparisonChart simulations={completedSims} />
            <ScenarioComparison simulations={completedSims} />
          </>
        )}
      </div>
    </div>
  );
}