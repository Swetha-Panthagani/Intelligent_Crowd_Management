import { PageHeader } from "@/components/shared/page-header";

export default function AttendeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Welcome to the Festival!"
        subtitle="Your guide to the event. Find schedules, maps, and announcements here."
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
