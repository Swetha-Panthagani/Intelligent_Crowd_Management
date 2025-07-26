"use client";

import React, { useState } from 'react';
import { Ambulance, AreaChart, BarChart, Bot, ChevronDown, ChevronUp, Megaphone, Search, Shield, TriangleAlert, Users } from 'lucide-react';

import type { Zone, Stat, Stage, Activity, PredictedIncident } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { runIncidentPrediction, runTargetedAnnouncement } from './actions';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const initialZones: Zone[] = [
  { id: 'north', label: 'North Quadrant', density: 0.6, count: 1800 },
  { id: 'east',  label: 'East Quadrant',  density: 0.4, count: 1200 },
  { id: 'south', label: 'South Quadrant', density: 0.85, count: 2550 },
  { id: 'west',  label: 'West Quadrant',  density: 0.3, count:  900 },
];

const initialStats: Stat[] = [
  { title: 'Total Attendees', value: '6,450', change: '+5.2%', isPositive: true, icon: Users },
  { title: 'Zones at Risk',   value: '1',     change: 'Stable', isPositive: true, icon: TriangleAlert },
  { title: 'Active Alerts',   value: '2',     change: '+100%', isPositive: false, icon: Megaphone },
  { title: 'Incidents Today', value: '3',     change: '+33%',  isPositive: false, icon: Shield },
];

const initialStages: Stage[] = [
  { id: 1, stage: 'Zone 1 Staging', description: 'Initial setup complete'},
  { id: 2, stage: 'Crowd Monitoring', description: 'Live crowd monitoring active'},
  { id: 3, stage: 'Incident Response', description: 'Dispatch and incident tracking active'},
  { id: 4, stage: 'Analytics', description: 'Generate post-event analytics'},
];

const initialActivities: Activity[] = [
  { id: 1, title: 'Overcrowding Alert', description: 'South Quadrant density >85%', time: '17:45', type: 'warning', icon: <TriangleAlert className="h-5 w-5 text-yellow-500" /> },
  { id: 2, title: 'Ambulance Dispatched', description: 'Medical team en route to South Quadrant', time: '17:47', type: 'danger', icon: <Ambulance className="h-5 w-5 text-red-500" /> },
  { id: 3, title: 'Security Alert', description: 'East Quadrant crowd surge reported', time: '18:00', type: 'warning', icon: <Shield className="h-5 w-5 text-yellow-500" /> },
];

export default function AdminDashboardPage() {
  const [zones] = useState<Zone[]>(initialZones);
  const [stats] = useState<Stat[]>(initialStats);
  const [stages] = useState<Stage[]>(initialStages);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<PredictedIncident[]>([]);
  const [isPredictionsDialogOpen, setIsPredictionsDialogOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAnnouncement, setGeneratedAnnouncement] = useState('');
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const handleZoneClick = (zone: Zone) => setSelectedZone(zone);

  const triggerAction = (action: string) => {
    if (!selectedZone) {
      toast({ title: "No Zone Selected", description: "Please select a zone from the map first.", variant: "destructive" });
      return;
    }
    const newEvent: Activity = {
      id: activities.length + 1,
      title: action,
      description: `${action} triggered in ${selectedZone.label}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: action.includes('Ambulance') ? 'danger' : 'success',
      icon: action === 'Call Ambulance' ? <Ambulance className="h-5 w-5 text-red-500" /> : action === 'Report Missing' ? <Search className="h-5 w-5 text-blue-500" /> : <Megaphone className="h-5 w-5 text-green-500" />,
    };
    setActivities([newEvent, ...activities]);
    toast({ title: "Action Triggered", description: `${action} in ${selectedZone.label}`});
  };

  const handlePredictIncidents = async () => {
    setIsPredicting(true);
    try {
      const result = await runIncidentPrediction({
        zoneDensities: zones.map(({ id, density }) => ({ zoneId: id, density })),
        historicalData: 'Last year, similar crowd levels in the south quadrant led to 3 minor crushing incidents and a medical emergency.'
      });
      setPredictions(result.predictedIncidents);
      setIsPredictionsDialogOpen(true);
    } catch (error) {
      toast({ title: 'Prediction Failed', description: 'Could not generate incident predictions.', variant: 'destructive' });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleGenerateAnnouncement = async (formData: FormData) => {
    setIsGenerating(true);
    const zone = formData.get('zone') as string;
    const userGroup = formData.get('userGroup') as string;
    const realTimeNeeds = formData.get('realTimeNeeds') as string;

    if (!zone || !userGroup || !realTimeNeeds) {
      toast({ title: 'Missing Information', description: 'Please fill out all fields for the announcement.', variant: 'destructive' });
      setIsGenerating(false);
      return;
    }

    try {
      const result = await runTargetedAnnouncement({ zone, userGroup, realTimeNeeds });
      setGeneratedAnnouncement(result.announcement);
      setIsAnnouncementDialogOpen(true);
    } catch (error) {
       toast({ title: 'Announcement Generation Failed', description: 'Could not generate the announcement.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };


  const getDensityClass = (density: number) => {
    if (density > 0.8) return 'bg-red-500/80 border-red-700';
    if (density > 0.5) return 'bg-yellow-400/80 border-yellow-600';
    return 'bg-green-400/80 border-green-600';
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left & Center Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Zone Heatmap</CardTitle>
                <CardDescription>Click a zone to see details and perform actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full grid grid-cols-2 grid-rows-2 gap-2">
                  {zones.map((zone) => (
                    <Tooltip key={zone.id}>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() => handleZoneClick(zone)}
                          className={`rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer transition-all duration-300 border-2 ${getDensityClass(zone.density)} ${selectedZone?.id === zone.id ? 'ring-4 ring-primary ring-offset-2' : 'hover:scale-105'}`}
                        >
                          <div className="text-center">
                            <p className="font-headline">{zone.label}</p>
                            <p className="text-sm font-normal">{zone.count.toLocaleString()} people</p>
                            <p className="text-sm font-normal">({zone.density * 100}%)</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to select {zone.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Project Stages</CardTitle>
                <CardDescription>Overview of the crowd management project progress.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stage</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stages.map((st) => (
                      <TableRow key={st.id}>
                        <TableCell className="font-medium">{st.stage}</TableCell>
                        <TableCell>{st.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Actions</CardTitle>
                <CardDescription>
                  {selectedZone ? `Actions for ${selectedZone.label}` : 'Select a zone to begin'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button onClick={() => triggerAction('Call Ambulance')} disabled={!selectedZone} variant="destructive">
                  <Ambulance className="mr-2 h-4 w-4" /> Call Ambulance
                </Button>
                <Button onClick={() => triggerAction('Report Missing')} disabled={!selectedZone}>
                  <Search className="mr-2 h-4 w-4" /> Report Missing Person
                </Button>
                <Button onClick={() => triggerAction('Send Zone Alert')} disabled={!selectedZone}>
                  <Megaphone className="mr-2 h-4 w-4" /> Send Zone Alert
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                 <CardTitle className="font-headline flex items-center gap-2"><Bot /> AI Tools</CardTitle>
                 <CardDescription>Leverage AI for predictions and communication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Incident Prediction</h4>
                  <Button onClick={handlePredictIncidents} disabled={isPredicting} className="w-full">
                    {isPredicting ? 'Analyzing...' : <><AreaChart className="mr-2 h-4 w-4" /> Predict Incidents</>}
                  </Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Targeted Announcement</h4>
                  <form action={handleGenerateAnnouncement} className="space-y-3">
                    <div>
                      <Label htmlFor="zone">Zone</Label>
                      <Select name="zone" required>
                        <SelectTrigger><SelectValue placeholder="Select a zone" /></SelectTrigger>
                        <SelectContent>
                          {zones.map(z => <SelectItem key={z.id} value={z.id}>{z.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="userGroup">User Group</Label>
                      <Select name="userGroup" required>
                        <SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attendees">Attendees</SelectItem>
                          <SelectItem value="volunteers">Volunteers</SelectItem>
                          <SelectItem value="security">Security Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div>
                        <Label htmlFor="realTimeNeeds">Message / Situation</Label>
                        <Textarea name="realTimeNeeds" placeholder="e.g., Exit C is temporarily closed. Please use Exit D." required />
                    </div>
                    <Button type="submit" disabled={isGenerating} className="w-full">
                      {isGenerating ? 'Generating...' : <><BarChart className="mr-2 h-4 w-4" /> Generate Announcement</>}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Incident Timeline</CardTitle>
                <CardDescription>Latest events and alerts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-4">
                      <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted`}>
                        {act.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{act.title}</p>
                        <p className="text-sm text-muted-foreground">{act.description}</p>
                        <p className="text-xs text-muted-foreground/80">{act.time}</p>
                      </div>
                      <Badge variant={act.type === 'danger' ? 'destructive' : act.type === 'warning' ? 'secondary' : 'default'} className="capitalize">{act.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Prediction Results Dialog */}
        <Dialog open={isPredictionsDialogOpen} onOpenChange={setIsPredictionsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">AI Incident Predictions</DialogTitle>
              <DialogDescription>Based on current densities and historical data, here are potential upcoming incidents.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto p-1">
              <div className="space-y-4">
              {predictions.length > 0 ? predictions.map((p, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {p.incidentType} in {p.zoneId}
                      <Badge variant={p.severity === 'high' ? 'destructive' : p.severity === 'medium' ? 'secondary' : 'default'}>{p.severity}</Badge>
                    </CardTitle>
                    <CardDescription>Probability: {(p.probability * 100).toFixed(0)}%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">Recommendation:</p>
                    <p className="text-muted-foreground">{p.recommendations}</p>
                  </CardContent>
                </Card>
              )) : <p>No specific incidents predicted at this moment.</p>}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Generated Announcement Dialog */}
        <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-headline">Generated Announcement</DialogTitle>
              <DialogDescription>The AI has crafted the following announcement. Copy and broadcast it as needed.</DialogDescription>
            </DialogHeader>
            <div className="bg-muted rounded-md p-4 text-muted-foreground italic">
              "{generatedAnnouncement}"
            </div>
            <DialogFooter>
              <Button onClick={() => {
                navigator.clipboard.writeText(generatedAnnouncement);
                toast({ title: 'Copied to clipboard!' });
                setIsAnnouncementDialogOpen(false);
              }}>
                Copy & Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
