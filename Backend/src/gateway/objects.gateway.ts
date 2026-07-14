import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

function corsOrigins(): string | string[] | boolean {
  const raw = process.env.CORS_ORIGIN;
  if (!raw || raw === '*') return true;
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

@WebSocketGateway({
  cors: {
    origin: corsOrigins(),
    credentials: true,
  },
})
export class ObjectsGateway {
  @WebSocketServer()
  server: Server;

  emitObjectCreated(payload: unknown) {
    this.server.emit('objectCreated', payload);
  }

  emitObjectDeleted(payload: { id: string }) {
    this.server.emit('objectDeleted', payload);
  }
}
