const config = require('./config');
const segment = require('./services/segment');
const { InvalidRequest } = require('./customError');

exports.handler = async (event) => {
    try {
        if (config.NODE_ENV !== 'automation' && !config.SEGMENT_WRITE_TOKEN)
            await config.getCredentials();
        if (!event || !event.body) throw new InvalidRequest('Empty Request');
        const userAgent = event.headers['User-Agent'] || 'No User Agent';
        console.log('Received request headers', JSON.stringify(event.headers));
        await segment.sendEvent(event, userAgent);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event has been sent to segment' }),
        };
    } catch (e) {
        console.error(e);
        return {
            statusCode: e.status,
            body: JSON.stringify({ message: e.message }),
        };
    }
};
