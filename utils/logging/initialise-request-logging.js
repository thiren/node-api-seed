const _ = require('lodash');
const uuid = require('uuid');
const morgan = require('morgan');

const logger = require('./logger');

module.exports = initialiseMorgan;

function initialiseMorgan(app) {
    app.use(function (req, res, next) {
        req.reference = uuid.v4();
        next();
    });
    if (app.get('env') === 'test') {
        // Don't log requests when running tests
    } else if (app.get('env') === 'development') {
        app.use(morgan(':method :url', {
            stream: logger.stream,
            immediate: true,
            skip: _skipRoutes
        }));
        app.use(morgan('dev', {
            stream: logger.stream,
            skip: _skipRoutes
        }));
    } else {
        app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" ":referrer" ":user-agent"', {
            stream: logger.stream,
            immediate: true,
            skip: _skipRoutes
        }));
        app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
            stream: logger.stream,
            skip: _skipRoutes
        }));
    }
}

function _skipRoutes(req, res) {
    return _.includes(['/favicon.ico'], req.originalUrl);
}
