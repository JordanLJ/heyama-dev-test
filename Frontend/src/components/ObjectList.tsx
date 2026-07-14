'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppObject, objectApi } from '@/services/api';
import { connectSocket } from '@/services/socket';
import { ObjectCard } from '@/components/ObjectCard';
import { Button } from '@/components/ui/button';

export function ObjectList() {
  const [objects, setObjects] = useState<AppObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    objectApi
      .getAll()
      .then((data) => {
        if (mounted) setObjects(data);
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const socket = connectSocket();
    socket.on('objectCreated', (newObject: AppObject) => {
      setObjects((prev) => {
        if (prev.some((o) => o._id === newObject._id)) return prev;
        return [newObject, ...prev];
      });
    });
    socket.on('objectDeleted', ({ id }: { id: string }) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
    });

    return () => {
      mounted = false;
      socket.off('objectCreated');
      socket.off('objectDeleted');
    };
  }, []);

  async function handleDelete(id: string) {
    try {
      await objectApi.delete(id);
      setObjects((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (loading) {
    return <p className="text-zinc-600">Loading objects…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900">Objects</h1>
        <Button asChild>
          <Link href="/objects/create">Create</Link>
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {objects.length === 0 ? (
        <p className="text-zinc-600">No objects yet. Create the first one.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {objects.map((obj) => (
            <ObjectCard key={obj._id} object={obj} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
