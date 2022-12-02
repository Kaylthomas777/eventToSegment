process.env.NODE_ENV = 'automation';
const { expect } = require('chai');
const sinon = require('sinon');
const segment = require('../services/segment');
const index = require('../index');
const event1 = require('./resources/test1.json');
const event2 = require('./resources/test2.json');
const event3 = require('./resources/test3.json');
const response1 = require('./resources/response1.json');
const response2 = require('./resources/response2.json');
const response3 = require('./resources/response3.json');

describe('Segment Calls', () => {
    beforeEach(() => {
        this.event1 = event1;
        this.event2 = event2;
        this.event3 = event3;
        this.response1 = response1;
        this.response2 = response2;
        this.response3 = response3;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('Valid event sent to lambda must return 200', async () => {
        sinon.stub(segment, 'sendEvent').resolves({ success: true });
        const response = await index.handler(this.event1);
        console.log(response);
        expect(response.statusCode).to.eql(200);
    });

    it('Valid event from website must parse to RTGWebsite', async () => {
        sinon.stub(segment, 'sendEvent').resolves(this.response1);
        const response = await segment.sendEvent(this.event1);
        console.log(response);
        expect(response.context.device.name).to.eql('RTGWebsite');
    });

    it('Valid event from mobile must parse to RTGMobileApp', async () => {
        sinon.stub(segment, 'sendEvent').resolves(this.response2);
        const response = await segment.sendEvent(this.event2);
        console.log(response);
        expect(response.context.device.name).to.eql('RTGMobileApp');
    });

    it('Valid event with empty user agent must default to RTGMobileApp', async () => {
        sinon.stub(segment, 'sendEvent').resolves(this.response3);
        const response = await segment.sendEvent(this.event3);
        console.log(response);
        expect(response.context.device.name).to.eql('RTGMobileApp');
    });

    it('Empty request must return 400', async () => {
        sinon.stub(segment, 'sendEvent').resolves({ success: true });
        const response = await index.handler({ body: '' });
        console.log(response);
        expect(response.statusCode).to.eql(400);
    });
});
