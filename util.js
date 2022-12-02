const fetch = require('node-fetch');
const useragent = require('useragent');
const {
    InvalidRequest,
    InternalServerError,
    ResourceNotFound,
} = require('./customError');

const SourceSystem = {
    DEVICETYPE: 'server',
    WEBSITE: 'RTGWebsite',
    MOBILE: 'RTGMobileApp',
};

const EventTypes = {
    signup: 'Signed Up',
    dispatch: 'Dispatch',
    trait: 'Updated User Traits',
};

class Util {
    async sendRequest(url, requestOptions, isJson = true) {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            const resp = await response.json();
            console.log(
                `Request with the event type ${
                    requestOptions.body.event
                } is ${JSON.stringify(requestOptions)}`
            );
            console.log(`Response is ${JSON.stringify(resp)}`);
            const respStatus = response.status;
            let errorMsg = `Fetch Error while accessing ${url}`;
            if (resp?.error) {
                errorMsg = resp?.error?.message;
                if (respStatus === 400) throw new InvalidRequest(errorMsg);
                if (respStatus === 404) throw new ResourceNotFound();
            }
            console.log(
                `${errorMsg} for request ${JSON.stringify(requestOptions)}`
            );
            throw new InternalServerError(errorMsg);
        }
        return isJson ? response.json() : response;
    }

    isUserAgentBrowser(value) {
        const is = useragent.is(value);
        if (is.android || is.mobile_safari) return false;
        return (
            is.chrome ||
            is.firefox ||
            is.ie ||
            is.mobile_safari ||
            is.mozilla ||
            is.opera ||
            is.safari ||
            is.webkit
        );
    }

    identifyUserAgentSource(value) {
        if (!value) {
            return SourceSystem.MOBILE;
        }
        return this.isUserAgentBrowser(value)
            ? SourceSystem.WEBSITE
            : SourceSystem.MOBILE;
    }
}

module.exports = new Util();
module.exports.SourceSystem = SourceSystem;
module.exports.EventTypes = EventTypes;
