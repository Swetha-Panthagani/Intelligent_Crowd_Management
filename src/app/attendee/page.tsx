"use client";

import React from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ScheduleItem, Announcement } from '@/types';
import { Calendar, Map, Megaphone } from 'lucide-react';

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
  return (
    <Tabs defaultValue="schedule" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4" />Schedule</TabsTrigger>
        <TabsTrigger value="map"><Map className="mr-2 h-4 w-4" />Venue Map</TabsTrigger>
        <TabsTrigger value="announcements"><Megaphone className="mr-2 h-4 w-4" />Announcements</TabsTrigger>
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
    </Tabs>
  );
}
