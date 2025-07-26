"use client";

import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import type { Announcement } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Megaphone, ShieldAlert } from 'lucide-react';

const initialAnnouncements: Announcement[] = [
    { id: '1', title: 'Morning Briefing', content: 'All volunteers, please gather at the main stage at 8:00 AM for the morning briefing.', timestamp: '1 day ago', priority: 'info' },
    { id: '2', title: 'Zone Reassignment', content: 'Team B has been reassigned to the North Quadrant to assist with crowd control.', timestamp: '3 hours ago', priority: 'info' },
    { id: '3', title: 'High-Priority: Lost Child', content: 'A 6-year-old child was last seen near the East Quadrant food stalls. Please be on high alert. Description: red shirt, blue shorts.', timestamp: '15 minutes ago', priority: 'critical' },
];

const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  zone: z.enum(["north", "east", "south", "west"]),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().min(10, "Please provide a detailed description."),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function VolunteerPage() {
    const { toast } = useToast();

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const onSubmit: SubmitHandler<ReportFormValues> = (data) => {
        toast({
            title: "Incident Reported",
            description: `Thank you for reporting "${data.title}". Admin has been notified.`,
        });
        form.reset();
    };

    return (
        <Tabs defaultValue="announcements" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="announcements"><Megaphone className="mr-2 h-4 w-4" />Announcements</TabsTrigger>
                <TabsTrigger value="report"><ShieldAlert className="mr-2 h-4 w-4" />Report Incident</TabsTrigger>
            </TabsList>
            <TabsContent value="announcements">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Announcements</CardTitle>
                        <CardDescription>Latest updates and information for volunteers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {initialAnnouncements.map((ann) => (
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
            <TabsContent value="report">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Report an Incident</CardTitle>
                        <CardDescription>Notice something? Fill out the form below to alert the admin team.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Incident Title</FormLabel>
                                            <FormControl><Input placeholder="e.g., Unattended Bag" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="zone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zone</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a zone" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="north">North Quadrant</SelectItem>
                                                    <SelectItem value="east">East Quadrant</SelectItem>
                                                    <SelectItem value="south">South Quadrant</SelectItem>
                                                    <SelectItem value="west">West Quadrant</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select priority level" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea placeholder="Describe the incident in detail..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Submit Report</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
