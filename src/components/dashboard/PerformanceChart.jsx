import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function PerformanceChart({ simulations }) {
  const chartData = simulations.slice(0, 10).reverse().map((sim, idx) => ({
    name: `Run ${idx + 1}`,
    waitTime: sim.avg_waiting_time || 0,
    throughput: (sim.throughput || 0) / 10,
    score: sim.optimization_score || 0,
  }));

  return (
    <Card className="border border-border bg-card shadow-sm rounded-md">
      <CardHeader>
        <CardTitle className="text-xl font-serif font-bold text-foreground">Performance Trends</CardTitle>
        <p className="text-sm text-muted-foreground">Last 10 simulation runs</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
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
            <Line 
              type="monotone" 
              dataKey="waitTime" 
              stroke="#0EA5E9" 
              strokeWidth={3}
              name="Wait Time (min)"
              dot={{ fill: '#0EA5E9', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="throughput" 
              stroke="#06B6D4" 
              strokeWidth={3}
              name="Throughput (x10/hr)"
              dot={{ fill: '#06B6D4', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Opt Score"
              dot={{ fill: '#10B981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}