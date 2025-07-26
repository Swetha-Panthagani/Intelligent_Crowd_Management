
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ScheduleItem, Announcement } from '@/types';
import { Calendar, Map, Megaphone, HelpCircle, MessageSquare, UserSearch, ShieldAlert, Mic, Send, Upload, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const schedule: ScheduleItem[] = [
  { time: '14:00', artist: 'Opening Act: The Starters', stage: 'Main Stage' },
  { time: '15:30', artist: 'Indie Vibes', stage: 'Acoustic Tent' },
  { time: '17:00', artist: 'Rock On', stage: 'Main Stage' },
  { time: '18:30', artist: 'Sunset Beats (DJ Set)', stage: 'Rooftop Bar' },
  { time: '20:00', artist: 'Headline Act: Eventide', stage: 'Main Stage' },
  { time: '22:00', artist: 'Closing Fireworks', stage: 'All Zones' },
];

const announcements: Announcement[] = [
  { id: '1', title: 'Weather Update', content: 'Light showers expected around 6 PM. Grab a poncho!', timestamp: '2 hours ago', priority: 'info' },
  { id: '2', title: 'Critical Alert: Gate Change', content: 'Entry Gate B is temporarily closed. Please use Gate C or D.', timestamp: '30 minutes ago', priority: 'critical' },
  { id: '3', title: 'Found Item', content: 'A wallet has been found and is available at the main Info Booth in the South Quadrant.', timestamp: '10 minutes ago', priority: 'info' },
];

export default function AttendeePage() {
  const { toast } = useToast();
  const [photo, setPhoto] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleReportMissing = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Missing Person Report Submitted",
        description: "Thank you for your report. We have notified security.",
    });
    setPhoto(null);
    (e.target as HTMLFormElement).reset();
  }
  
  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Incident Report Submitted",
        description: "Thank you for your report. Our team will investigate.",
    });
    (e.target as HTMLFormElement).reset();
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).message.value;
    if (input) {
        toast({
            title: "Message Sent!",
            description: "A helpdesk agent will be with you shortly.",
        });
        (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <Tabs defaultValue="schedule" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4" />Schedule</TabsTrigger>
        <TabsTrigger value="map"><Map className="mr-2 h-4 w-4" />Venue Map</TabsTrigger>
        <TabsTrigger value="announcements"><Megaphone className="mr-2 h-4 w-4" />Announcements</TabsTrigger>
        <TabsTrigger value="helpdesk"><HelpCircle className="mr-2 h-4 w-4" />Helpdesk</TabsTrigger>
      </TabsList>
      
      <TabsContent value="schedule">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Event Schedule</CardTitle>
            <CardDescription>Plan your day! Here is the full lineup and schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Artist / Event</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.time}</TableCell>
                    <TableCell>{item.artist}</TableCell>
                    <TableCell>{item.stage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="map">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Venue Map</CardTitle>
            <CardDescription>Find your way around the festival grounds.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <Image 
              src="https://placehold.co/800x600.png"
              alt="Venue Map"
              width={800}
              height={600}
              className="rounded-lg border"
              data-ai-hint="festival map"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="announcements">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Announcements</CardTitle>
            <CardDescription>Stay up-to-date with the latest information and alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className={`p-4 rounded-lg border ${ann.priority === 'critical' ? 'bg-destructive/10 border-destructive' : 'bg-card'}`}>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold">{ann.title}</h3>
                  {ann.priority === 'critical' && <Badge variant="destructive">Critical</Badge>}
                </div>
                <p className="text-muted-foreground mt-1">{ann.content}</p>
                <p className="text-xs text-muted-foreground/80 mt-2 text-right">{ann.timestamp}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="helpdesk">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Helpdesk</CardTitle>
            <CardDescription>Get help, report an incident, or find a missing person.</CardDescription>
          </CardHeader>
          <CardContent>
             <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat"><MessageSquare className="mr-2 h-4 w-4"/>Live Chat</TabsTrigger>
                    <TabsTrigger value="missing"><UserSearch className="mr-2 h-4 w-4"/>Find Missing Person</TabsTrigger>
                    <TabsTrigger value="incident"><ShieldAlert className="mr-2 h-4 w-4"/>Report Incident</TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg h-64 overflow-y-auto">
                                    <p className="text-sm text-center text-muted-foreground">This is the beginning of your chat history.</p>
                                    <p className="text-sm text-center text-muted-foreground mt-2">An agent will be with you shortly.</p>
                                </div>
                                <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                                    <Input name="message" placeholder="Type your message..." className="flex-grow" />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => toast({ title: 'Voice input not yet available.', description: 'Please use text input for now.'})}>
                                        <Mic />
                                        <span className="sr-only">Use voice</span>
                                    </Button>
                                    <Button type="submit" size="icon">
                                        <Send />
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="missing" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <form className="space-y-4" onSubmit={handleReportMissing}>
                                <div>
                                    <Label htmlFor="name">Missing Person's Name</Label>
                                    <Input id="name" name="name" placeholder="e.g., Jane Doe" required />
                                </div>
                                <div>
                                    <Label htmlFor="last-seen">Last Seen Location & Time</Label>
                                    <Input id="last-seen" name="last-seen" placeholder="e.g., Near main stage, around 4 PM" required />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" placeholder="e.g., Wearing a blue shirt, jeans, and a red hat." required />
                                </div>
                                <div>
                                    <Label>Photo (Optional)</Label>
                                    <div className="flex items-center gap-2">
                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="mr-2 h-4 w-4" /> Upload Photo
                                        </Button>
                                        {photo && <div className="text-sm flex items-center gap-2"><Paperclip className="h-4 w-4" /><span>{photo.name}</span></div>}
                                    </div>
                                    <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                </div>
                                <Button type="submit" className="w-full">Submit Report</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="incident" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <form className="space-y-4" onSubmit={handleReportIncident}>
                                <div>
                                    <Label htmlFor="incident-title">Incident Title</Label>
                                    <Input id="incident-title" name="incident-title" placeholder="e.g., Lost item, Safety concern" required />
                                </div>
                                <div>
                                    <Label htmlFor="incident-location">Location of Incident</Label>
                                    <Input id="incident-location" name="incident-location" placeholder="e.g., East Quadrant, near the food trucks" required />
                                </div>
                                <div>
                                    <Label htmlFor="incident-description">Detailed Description</Label>
                                    <Textarea id="incident-description" name="incident-description" placeholder="Please provide as much detail as possible." required />
                                </div>
                                <Button type="submit" className="w-full">Submit Incident Report</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
             </Tabs>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

    