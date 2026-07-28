import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ScenarioComparison({ simulations }) {
  const scenarioGroups = {};
  
  simulations.forEach(sim => {
    if (!scenarioGroups[sim.scenario_type]) {
      scenarioGroups[sim.scenario_type] = [];
    }
    scenarioGroups[sim.scenario_type].push(sim);
  });

  const chartData = Object.entries(scenarioGroups).map(([scenario, sims]) => ({
    scenario: scenario.replace(/_/g, ' '),
    avgWait: sims.reduce((sum, s) => sum + (s.avg_waiting_time || 0), 0) / sims.length,
    avgThroughput: sims.reduce((sum, s) => sum + (s.throughput || 0), 0) / sims.length,
    avgScore: sims.reduce((sum, s) => sum + (s.optimization_score || 0), 0) / sims.length,
  }));

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Scenario Comparison</CardTitle>
        <p className="text-sm text-slate-600">Average performance by scenario type</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="scenario" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }} 
            />
            <Legend />
            <Bar dataKey="avgWait" fill="#EF4444" name="Avg Wait (min)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="avgThroughput" fill="#06B6D4" name="Avg Throughput" radius={[8, 8, 0, 0]} />
            <Bar dataKey="avgScore" fill="#10B981" name="Avg Score" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}