import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function EfficiencyMetrics({ simulations }) {
  const baseline = simulations.find(s => s.scenario_type === 'baseline');
  const optimized = simulations.filter(s => s.scenario_type !== 'baseline');
  
  const avgOptimizedWait = optimized.length > 0
    ? optimized.reduce((sum, s) => sum + (s.avg_waiting_time || 0), 0) / optimized.length
    : 0;
    
  const avgOptimizedScore = optimized.length > 0
    ? optimized.reduce((sum, s) => sum + (s.optimization_score || 0), 0) / optimized.length
    : 0;

  const waitTimeImprovement = baseline
    ? ((baseline.avg_waiting_time - avgOptimizedWait) / baseline.avg_waiting_time) * 100
    : 0;
    
  const scoreImprovement = baseline
    ? avgOptimizedScore - baseline.optimization_score
    : 0;

  const metrics = [
    {
      label: "Wait Time Reduction",
      value: `${waitTimeImprovement.toFixed(1)}%`,
      trend: waitTimeImprovement > 0 ? 'up' : waitTimeImprovement < 0 ? 'down' : 'neutral',
      color: waitTimeImprovement > 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      label: "Optimization Score Improvement",
      value: `+${scoreImprovement.toFixed(1)}%`,
      trend: scoreImprovement > 0 ? 'up' : scoreImprovement < 0 ? 'down' : 'neutral',
      color: scoreImprovement > 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      label: "Best Scenario",
      value: optimized.sort((a, b) => (b.optimization_score || 0) - (a.optimization_score || 0))[0]?.scenario_type.replace(/_/g, ' ') || 'N/A',
      trend: 'neutral',
      color: 'text-blue-600'
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600">{metric.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${metric.color}`}>{metric.value}</span>
              {metric.trend === 'up' && <TrendingUp className="w-8 h-8 text-green-500" />}
              {metric.trend === 'down' && <TrendingDown className="w-8 h-8 text-red-500" />}
              {metric.trend === 'neutral' && <Minus className="w-8 h-8 text-slate-400" />}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}