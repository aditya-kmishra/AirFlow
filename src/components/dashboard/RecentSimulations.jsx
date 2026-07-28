import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, Users, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const scenarioColors = {
  baseline: "bg-slate-100 text-slate-700 border-slate-200",
  optimized_security: "bg-blue-100 text-blue-700 border-blue-200",
  optimized_checkin: "bg-cyan-100 text-cyan-700 border-cyan-200",
  hybrid_all: "bg-purple-100 text-purple-700 border-purple-200",
  peak_hours: "bg-amber-100 text-amber-700 border-amber-200",
  custom: "bg-green-100 text-green-700 border-green-200",
};

export default function RecentSimulations({ simulations, isLoading }) {
  return (
    <Card className="border border-border bg-card shadow-sm rounded-md">
      <CardHeader>
        <CardTitle className="text-xl font-serif font-bold text-foreground">Recent Simulations</CardTitle>
        <p className="text-sm text-muted-foreground">Latest simulation runs and results</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))
          ) : simulations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No simulations yet. Run your first simulation to get started.</p>
            </div>
          ) : (
            simulations.slice(0, 5).map((sim) => (
              <div 
                key={sim.id} 
                className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-md border border-border hover:border-primary/50 transition-colors duration-300 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center">
                    <span className="text-2xl font-serif font-bold text-secondary-foreground">{sim.optimization_score || 0}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground mb-1">{sim.name}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-muted text-muted-foreground border-transparent hover:bg-muted font-normal rounded-sm">
                        {sim.scenario_type.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(sim.created_date), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{sim.avg_waiting_time?.toFixed(1) || 0} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{sim.passenger_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{sim.throughput || 0}/hr</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}