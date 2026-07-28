import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import MetricCard from "../components/dashboard/MetricCard";
import RecentSimulations from "../components/dashboard/RecentSimulations";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import BottleneckHeatmap from "../components/dashboard/BottleneckHeatmap";

export default function Dashboard() {
  const { data: simulations = [], isLoading } = useQuery({
    queryKey: ['simulations'],
    queryFn: () => base44.entities.Simulation.list('-created_date', 100),
    initialData: [],
  });

  const completedSims = simulations.filter(s => s.status === 'completed');
  
  const avgWaitTime = completedSims.length > 0
    ? completedSims.reduce((sum, s) => sum + (s.avg_waiting_time || 0), 0) / completedSims.length
    : 0;
  
  const avgThroughput = completedSims.length > 0
    ? completedSims.reduce((sum, s) => sum + (s.throughput || 0), 0) / completedSims.length
    : 0;

  const avgOptScore = completedSims.length > 0
    ? completedSims.reduce((sum, s) => sum + (s.optimization_score || 0), 0) / completedSims.length
    : 0;

  const allBottlenecks = completedSims.flatMap(s => s.bottlenecks || []);
  const bottleneckCount = [...new Set(allBottlenecks)].length;

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Airport Operations Dashboard</h1>
            <p className="text-muted-foreground">Agent-based modeling & hybrid optimization for passenger flow</p>
          </div>
          <Link to={createPageUrl("Simulation")}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-sm">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Run New Simulation
            </Button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Avg Wait Time"
            value={`${avgWaitTime.toFixed(1)} min`}
            change="-12%"
            trend="down"
            icon={Clock}
            color="blue"
          />
          <MetricCard
            title="Throughput"
            value={`${Math.round(avgThroughput)}/hr`}
            change="+18%"
            trend="up"
            icon={Users}
            color="cyan"
          />
          <MetricCard
            title="Optimization Score"
            value={`${Math.round(avgOptScore)}%`}
            change="+8%"
            trend="up"
            icon={TrendingUp}
            color="green"
          />
          <MetricCard
            title="Active Bottlenecks"
            value={bottleneckCount}
            change="-3"
            trend="down"
            icon={AlertTriangle}
            color="amber"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <PerformanceChart simulations={completedSims} />
          <BottleneckHeatmap simulations={completedSims} />
        </div>

        {/* Recent Simulations */}
        <RecentSimulations simulations={simulations} isLoading={isLoading} />
      </div>
    </div>
  );
}