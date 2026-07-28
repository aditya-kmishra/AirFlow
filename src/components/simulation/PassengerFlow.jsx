import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function PassengerFlow({ isRunning, passengerCount }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    if (isRunning) {
      const agentCount = Math.min(50, Math.floor(passengerCount / 100));
      const newAgents = Array.from({ length: agentCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.5 + Math.random() * 1.5,
        color: ['#0EA5E9', '#06B6D4', '#8B5CF6', '#10B981'][Math.floor(Math.random() * 4)]
      }));
      setAgents(newAgents);

      const interval = setInterval(() => {
        setAgents(prev => prev.map(agent => ({
          ...agent,
          x: (agent.x + agent.speed) % 100,
          y: agent.y + (Math.random() - 0.5) * 2,
        })));
      }, 50);

      return () => clearInterval(interval);
    } else {
      setAgents([]);
    }
  }, [isRunning, passengerCount]);

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Passenger Flow Visualization
        </CardTitle>
        <p className="text-sm text-slate-600">Agent-based model real-time simulation</p>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96 bg-muted rounded-md overflow-hidden border border-border">
          {/* Airport Layout */}
          <div className="absolute inset-0">
            {/* Check-in area */}
            <div className="absolute left-4 top-8 w-1/4 h-16 bg-blue-200/50 rounded-lg border-2 border-blue-300 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-700">Check-in</span>
            </div>
            
            {/* Security */}
            <div className="absolute left-4 top-32 w-1/3 h-20 bg-amber-200/50 rounded-lg border-2 border-amber-300 flex items-center justify-center">
              <span className="text-xs font-semibold text-amber-700">Security</span>
            </div>
            
            {/* Boarding Gates */}
            <div className="absolute right-4 top-8 w-1/3 h-32 bg-cyan-200/50 rounded-lg border-2 border-cyan-300 flex items-center justify-center">
              <span className="text-xs font-semibold text-cyan-700">Boarding Gates</span>
            </div>
            
            {/* Pathway */}
            <div className="absolute left-1/4 top-1/2 w-1/2 h-1 bg-slate-300 transform -translate-y-1/2"></div>
            <div className="absolute left-4 top-8 w-1/4 h-16 bg-background rounded border border-border flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">Check-in</span>
            </div>
            
            <div className="absolute left-4 top-32 w-1/3 h-20 bg-background rounded border border-border flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">Security</span>
            </div>
            
            <div className="absolute right-4 top-8 w-1/3 h-32 bg-background rounded border border-border flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">Boarding Gates</span>
            </div>
            
            <div className="absolute left-1/4 top-1/2 w-1/2 h-0.5 bg-border transform -translate-y-1/2"></div>
          </div>

          {agents.map((agent) => (
            <div
              key={agent.id}
              className="absolute w-2 h-2 rounded-full border border-background"
              style={{
                left: `${agent.x}%`,
                top: `${agent.y}%`,
                backgroundColor: agent.color,
              }}
            />
          ))}

          {!isRunning && agents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Click "Run Simulation" to start</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}