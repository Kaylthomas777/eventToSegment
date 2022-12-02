const config = require('../config.js');
const util = require('../util');

const Segment = {
    sendEvent: async function (data, userAgent) {
        console.log('DATA IS: ', data);
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Basic ${config.SEGMENT_WRITE_TOKEN}`,
        };
        const eventType = determineEventType(data.path);
        const url = `${config.SEGMENT_API_ENDPOINT}`;
        const requestOptions = {
            method: 'POST',
            headers,
            body: this.buildRequestBody(data, eventType, userAgent),
        };
        console.log(requestOptions.body);
        const response = await util.sendRequest(url, requestOptions);
        console.log(
            `Event sent to Segment response for ${eventType} is ${JSON.stringify(
                response
            )}`
        );
        return response;
    },

    buildRequestBody: function (data, eventType, userAgent) {
        //let body = JSON.parse(data.body);
        let body = data.body
        return JSON.stringify({
            batch: [
                {
                    type: body.trait ? 'identify' : 'track',
                    userId: body.userid || body.segmentUserId || 'No User ID',
                    event: eventType,
                    anonymousId: body.anonymousId || 'No Anonymous ID',
                    properties:
                        body.trait || determineProperties(body, eventType),
                    traits: body.trait,
                    source_system: util.identifyUserAgentSource(userAgent),
                    timestamp: new Date(),
                },
            ],
            context: {
                device: determineDeviceContext(userAgent),
            },
        });
    },
};

const determineDeviceContext = (deviceContext) => {
    return {
        type: util.SourceSystem.DEVICETYPE,
        name: util.identifyUserAgentSource(deviceContext),
    };
};

const determineEventType = (str) => {
    for (const type in util.EventTypes) {
        if (str.includes(type)) {
            return util.EventTypes[type];
        }
    }
    return 'Event Type not accounted for';
};

const determineProperties = (obj, eventType) => {
    let type =
        obj?.subsourcecode?.replace('rtg', '') ||
        obj?.sourcecode?.replace('rtg', '');
    if (type && type.includes('modal')) type = type.replace('modal', 's');
    const properties = {
        'Signed Up': {
            source: type,
        },
        Dispatch: { info: 'Stuff has been dispatched' },
    };
    return properties[eventType] ? properties[eventType] : obj;
};

module.exports = Object.create(Segment);
