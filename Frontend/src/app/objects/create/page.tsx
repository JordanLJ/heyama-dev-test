import Link from 'next/link';
import { CreateObjectForm } from '@/components/CreateObjectForm';
import { Button } from '@/components/ui/button';

export default function CreateObjectPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Create object</h1>
        <Button asChild variant="outline">
          <Link href="/objects">Back to list</Link>
        </Button>
      </div>
      <CreateObjectForm />
    </main>
  );
}
