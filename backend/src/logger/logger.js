import { createLogger, format, transports } from 'winston';
import fs from 'fs';

const { combine, timestamp, printf, align } = format;

// Đảm bảo thư mục 'logs' tồn tại
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS A',
        }),
        align(),
        printf( info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ dirname: 'logs', filename: 'error.log', level: 'error' }),
        new transports.File({ dirname: 'logs', filename: 'combined.log' })
    ],
});

export default logger;