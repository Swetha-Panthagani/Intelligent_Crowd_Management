"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import type { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const initialTasks: Task[] = [
    { id: '1', title: 'Patrol North Quadrant', description: 'Monitor crowd flow and report any issues.', status: 'pending', priority: 'medium', zone: 'north' },
    { id: '2', title: 'Assist at Info Booth', description: 'Help attendees with questions and directions.', status: 'in-progress', priority: 'low', zone: 'south' },
    { id: '3', title: 'Respond to Medical Alert', description: 'First-aid required near the main stage.', status: 'completed', priority: 'high', zone: 'east' },
    { id: '4', title: 'Distribute Water', description: 'Hand out water bottles in the West Quadrant.', status: 'pending', priority: 'medium', zone: 'west' },
];

const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  zone: z.enum(["north", "east", "south", "west"]),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().min(10, "Please provide a detailed description."),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function VolunteerPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
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

    const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
        if (priority === 'high') return <Badge variant="destructive">High</Badge>;
        if (priority === 'medium') return <Badge variant="secondary">Medium</Badge>;
        return <Badge variant="outline">Low</Badge>;
    }
    
    const getStatusBadge = (status: 'pending' | 'in-progress' | 'completed') => {
        if (status === 'in-progress') return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
        if (status === 'completed') return <Badge className="bg-green-500 text-white">Completed</Badge>;
        return <Badge variant="default">Pending</Badge>;
    }

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">My Tasks</CardTitle>
                        <CardDescription>Here are your assigned tasks. Please keep the statuses updated.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Zone</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <div className="font-medium">{task.title}</div>
                                            <div className="text-sm text-muted-foreground">{task.description}</div>
                                        </TableCell>
                                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                                        <TableCell className="capitalize">{task.zone}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
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
            </div>
        </div>
    );
}
