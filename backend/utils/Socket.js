import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL,'https://satscorer.com','https://www.satscorer.com','https://admin.satscorer.com','http://localhost:5173','http://localhost:5174'],
      credentials: true,
    },
  });

  // Middleware to verify JWT token
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.error('Socket authentication failed: No token provided');
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.userId || !/^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
        console.error('Socket authentication failed: Invalid userId format', decoded.userId);
        return next(new Error('Authentication error: Invalid userId format'));
      }
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      console.error('Socket authentication failed:', {
        message: error.message,
        expiredAt: error.expiredAt,
      });
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id} (userId: ${socket.userId})`);

    // Join user-specific room based on userId
    socket.on('joinRoom', (userId) => {
      if (userId !== socket.userId) {
        console.error(`Join room failed: Provided userId ${userId} does not match authenticated userId ${socket.userId}`);
        return;
      }
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id} (userId: ${socket.userId})`);
    });
  });

  return io;
};

// Function to emit notification to specific users
const emitNotification = (userIds, notification) => {
  if (!io) {
    console.error('Socket.IO not initialized');
    return;
  }
  console.log('Emitting notification to users:', userIds);
  userIds.forEach((userId) => {
    io.to(userId).emit('newNotification', notification);
  });
};

export { initializeSocket, emitNotification };