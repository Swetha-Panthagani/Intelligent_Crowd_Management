import { PageHeader } from "@/components/shared/page-header";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Volunteer Hub"
        subtitle="Manage your tasks and report incidents to keep the event safe."
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
