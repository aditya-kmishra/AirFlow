import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Trophy, Clock, Users } from "lucide-react";
import { format } from "date-fns";

const scenarioColors = {
  baseline: "bg-muted text-muted-foreground border-transparent",
  optimized_security: "bg-blue-50 text-blue-700 border-transparent",
  optimized_checkin: "bg-cyan-50 text-cyan-700 border-transparent",
  hybrid_all: "bg-primary/10 text-primary border-transparent",
  peak_hours: "bg-amber-50 text-amber-700 border-transparent",
  custom: "bg-green-50 text-green-700 border-transparent",
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
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Scenario Management</h1>
          <p className="text-muted-foreground">Compare and analyze different optimization scenarios</p>
        </div>

        {scenarioStats.length === 0 ? (
          <Card className="border border-border bg-card shadow-sm rounded-md">
            <CardContent className="py-16 text-center">
              <GitCompare className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">No Scenarios Yet</h3>
              <p className="text-muted-foreground">Run simulations to create and compare scenarios</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {scenarioStats.map((scenario, idx) => (
              <Card key={scenario.type} className="border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-md">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      {idx === 0 && <Trophy className="w-6 h-6 text-yellow-600" />}
                      <div>
                        <CardTitle className="text-2xl font-serif capitalize">
                          {scenario.type.replace(/_/g, ' ')}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{scenario.count} simulation runs</p>
                      </div>
                    </div>
                    <Badge className={`${scenarioColors[scenario.type]} border px-4 py-2 text-sm font-normal rounded-sm`}>
                      {scenario.avgScore.toFixed(1)}% Optimization Score
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Avg Metrics */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground mb-3">Average Performance</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Wait: {scenario.avgWait.toFixed(1)} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Throughput: {Math.round(scenario.avgThroughput)}/hr</span>
                        </div>
                      </div>
                    </div>

                    {/* Best Run */}
                    <div className="md:col-span-3 bg-muted rounded-md p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-3">Best Run</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-foreground mb-2">{scenario.bestRun.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(scenario.bestRun.created_date), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-lg font-bold font-serif text-foreground">
                              {scenario.bestRun.avg_waiting_time?.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">Wait</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold font-serif text-foreground">
                              {scenario.bestRun.throughput}
                            </p>
                            <p className="text-xs text-muted-foreground">Throughput</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold font-serif text-primary">
                              {scenario.bestRun.optimization_score}%
                            </p>
                            <p className="text-xs text-muted-foreground">Score</p>
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