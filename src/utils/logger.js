import winston from "winston"

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'magenta',
        debug: 'white',
    }
};

const format = winston.format.combine(
    winston.format.colorize({ colors: customLevels.colors }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
        (info) => `[${info.timestamp}] [${info.level}] ${info.message}`
    )
);

const transports = {
    development: [
        new winston.transports.Console({
            level: 'debug',
            format: format
        }),
        new winston.transports.Console({
            level: 'info',
            format: format
        }),
        new winston.transports.Console({
            level: 'http',
            format: format
        }),
        new winston.transports.Console({
            level: 'warning',
            format: format
        }),
        new winston.transports.File({
            filename: './src/logs/error.log',
            level: 'error',
            format: winston.format.uncolorize()
        }),
        new winston.transports.File({
            filename: './src/logs/error.log',
            level: 'fatal',
            format: winston.format.uncolorize()
        })
    ],
    production: [
        new winston.transports.Console({
            level: 'info',
            format: format
        }),
        new winston.transports.File({
            filename: './src/logs/error.log',
            level: 'error',
            format: winston.format.uncolorize()
        })
    ]
};

const logger = winston.createLogger({
    levels: customLevels.levels,
    transports: transports[process.env.NODE_ENV] || transports.development
});

export default logger;