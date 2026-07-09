import { httpServer, io } from './app';
import { config } from './config/env';
import logger from './utils/logger';

const PORT = config.PORT;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`WebSocket server ready`);
});

httpServer.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
  } else {
    logger.error('Server error', err);
  }
  process.exit(1);
});
