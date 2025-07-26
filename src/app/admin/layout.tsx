import { PageHeader } from "@/components/shared/page-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Admin Dashboard"
        subtitle="Monitor zones, headcounts, and trigger emergency actions."
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
