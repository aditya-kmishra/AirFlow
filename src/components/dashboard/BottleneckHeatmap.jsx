import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BottleneckHeatmap({ simulations }) {
  const bottleneckCounts = {};
  
  simulations.forEach(sim => {
    (sim.bottlenecks || []).forEach(bottleneck => {
      bottleneckCounts[bottleneck] = (bottleneckCounts[bottleneck] || 0) + 1;
    });
  });

  const chartData = Object.entries(bottleneckCounts)
    .map(([area, count]) => ({
      area: area.replace(/_/g, ' '),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <Card className="border border-border bg-card shadow-sm rounded-md">
      <CardHeader>
        <CardTitle className="text-xl font-serif font-bold text-foreground">Bottleneck Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Most frequently congested areas</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#64748b" />
            <YAxis dataKey="area" type="category" stroke="#64748b" width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }} 
            />
            <Bar 
              dataKey="count" 
              fill="#D97757"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}