import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, User, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 12l-2-2.5 2-2.5 2 2.5-2 2.5zM12 18.5l-2-2.5 2-2.5 2 2.5-2 2.5zM12 5.5l-2-2.5 2-2.5 2 2.5-2 2.5z"/></svg>
            <h1 className="text-2xl font-bold font-headline text-foreground">Eventide Manager</h1>
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold font-headline text-primary tracking-tighter">
              Intelligent Crowd Management
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Seamlessly monitor, manage, and engage with your event attendees, volunteers, and staff.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <RoleCard
              href="/admin"
              icon={<Shield className="h-12 w-12 text-primary" />}
              title="Admin"
              description="Oversee event operations, monitor real-time data, and manage incidents from a centralized dashboard."
            />
            <RoleCard
              href="/volunteer"
              icon={<Users className="h-12 w-12 text-primary" />}
              title="Volunteer"
              description="Access tasks, report incidents, and communicate with the team to ensure a safe and smooth event."
            />
            <RoleCard
              href="/attendee"
              icon={<User className="h-12 w-12 text-primary" />}
              title="Attendee"
              description="View event schedules, navigate with the venue map, and receive important updates and announcements."
            />
          </div>
        </div>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Eventide Manager. All rights reserved.
      </footer>
    </div>
  );
}

function RoleCard({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string; }) {
  return (
    <Card className="text-center group hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="items-center">
        {icon}
        <CardTitle className="font-headline text-2xl mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <Button asChild variant="ghost" className="mt-6 font-bold text-primary group-hover:bg-accent/50">
          <Link href={href}>
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
