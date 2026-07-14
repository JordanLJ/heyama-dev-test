'use client';

import Link from 'next/link';
import { AppObject } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  object: AppObject;
  onDelete?: (id: string) => void;
};

export function ObjectCard({ object, onDelete }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1">{object.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={object.imageUrl}
          alt={object.title}
          className="h-40 w-full rounded-md object-cover bg-zinc-100"
        />
        <p className="line-clamp-2 text-sm text-zinc-600">{object.description}</p>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/objects/${object._id}`}>View</Link>
          </Button>
          {onDelete ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(object._id)}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
