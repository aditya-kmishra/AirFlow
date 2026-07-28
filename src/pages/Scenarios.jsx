import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Trophy, Clock, Users } from "lucide-react";
import { format } from "date-fns";

const scenarioColors = {
  baseline: "bg-slate-100 text-slate-700 border-slate-300",
  optimized_security: "bg-blue-100 text-blue-700 border-blue-300",
  optimized_checkin: "bg-cyan-100 text-cyan-700 border-cyan-300",
  hybrid_all: "bg-purple-100 text-purple-700 border-purple-300",
  peak_hours: "bg-amber-100 text-amber-700 border-amber-300",
  custom: "bg-green-100 text-green-700 border-green-300",
};

export default function Scenarios() {
  const { data: simulations = [], isLoading } = useQuery({
    queryKey: ['simulations'],
    queryFn: () => base44.entities.Simulation.list('-created_date', 100),
    initialData: [],
  });

  const scenarioGroups = {};
  
  simulations.forEach(sim => {
    if (!scenarioGroups[sim.scenario_type]) {
      scenarioGroups[sim.scenario_type] = [];
    }
    scenarioGroups[sim.scenario_type].push(sim);
  });

  const scenarioStats = Object.entries(scenarioGroups).map(([type, sims]) => {
    const avgWait = sims.reduce((sum, s) => sum + (s.avg_waiting_time || 0), 0) / sims.length;
    const avgScore = sims.reduce((sum, s) => sum + (s.optimization_score || 0), 0) / sims.length;
    const avgThroughput = sims.reduce((sum, s) => sum + (s.throughput || 0), 0) / sims.length;
    
    return {
      type,
      count: sims.length,
      avgWait,
      avgScore,
      avgThroughput,
      bestRun: sims.sort((a, b) => (b.optimization_score || 0) - (a.optimization_score || 0))[0]
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Scenario Management</h1>
          <p className="text-slate-600">Compare and analyze different optimization scenarios</p>
        </div>

        {scenarioStats.length === 0 ? (
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <GitCompare className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Scenarios Yet</h3>
              <p className="text-slate-500">Run simulations to create and compare scenarios</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {scenarioStats.map((scenario, idx) => (
              <Card key={scenario.type} className="border-none shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      {idx === 0 && <Trophy className="w-6 h-6 text-yellow-500" />}
                      <div>
                        <CardTitle className="text-2xl capitalize">
                          {scenario.type.replace(/_/g, ' ')}
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{scenario.count} simulation runs</p>
                      </div>
                    </div>
                    <Badge className={`${scenarioColors[scenario.type]} border px-4 py-2 text-sm`}>
                      {scenario.avgScore.toFixed(1)}% Optimization Score
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Avg Metrics */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 mb-3">Average Performance</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-slate-600">Wait: {scenario.avgWait.toFixed(1)} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-cyan-500" />
                          <span className="text-slate-600">Throughput: {Math.round(scenario.avgThroughput)}/hr</span>
                        </div>
                      </div>
                    </div>

                    {/* Best Run */}
                    <div className="md:col-span-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <h4 className="font-semibold text-slate-700 mb-3">Best Run</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600 mb-2">{scenario.bestRun.name}</p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(scenario.bestRun.created_date), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-lg font-bold text-slate-900">
                              {scenario.bestRun.avg_waiting_time?.toFixed(1)}
                            </p>
                            <p className="text-xs text-slate-600">Wait</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-slate-900">
                              {scenario.bestRun.throughput}
                            </p>
                            <p className="text-xs text-slate-600">Throughput</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-green-600">
                              {scenario.bestRun.optimization_score}%
                            </p>
                            <p className="text-xs text-slate-600">Score</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}