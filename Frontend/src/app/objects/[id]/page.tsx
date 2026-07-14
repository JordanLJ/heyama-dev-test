'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppObject, objectApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ObjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [object, setObject] = useState<AppObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    objectApi
      .getOne(params.id)
      .then(setObject)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load'),
      )
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    if (!object) return;
    await objectApi.delete(object._id);
    router.push('/objects');
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p>Loading…</p>
      </main>
    );
  }

  if (error || !object) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <p className="text-red-600">{error || 'Not found'}</p>
        <Button asChild variant="outline">
          <Link href="/objects">Back</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/objects">Back</Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{object.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={object.imageUrl}
            alt={object.title}
            className="w-full rounded-md object-cover bg-zinc-100"
          />
          <p className="text-zinc-700">{object.description}</p>
          <p className="text-sm text-zinc-500">
            Created: {new Date(object.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
