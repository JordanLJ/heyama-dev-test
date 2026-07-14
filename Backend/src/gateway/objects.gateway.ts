import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
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
