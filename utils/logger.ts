import pino from 'pino';

const dest = pino.destination({ sync: false });
const logger = pino(dest);

export default logger;
