require('dotenv').config();
const { AWS_REGION, NODE_ENV, SEGMENT_API_ENDPOINT } = process.env;
const AWS = require('aws-sdk');
const region = AWS_REGION || 'us-east-1';
const secretsmanager = new AWS.SecretsManager({ region });

class Config {
    constructor() {
        this.NODE_ENV = NODE_ENV || 'dev';
        this.SEGMENT_API_ENDPOINT =
            SEGMENT_API_ENDPOINT || 'http://localhost:3000/events';
    }

    async getCredentials() {
        const segmentSecret = await this.getSecret('segment');
        const secretObj = JSON.parse(segmentSecret);
        this.SEGMENT_WRITE_TOKEN = secretObj.SEGMENT_WRITE_TOKEN;
    }

    async getSecret(secretName) {
        const secret = await secretsmanager
            .getSecretValue({ SecretId: secretName })
            .promise();
        return secret.SecretString;
    }
}
module.exports = new Config();
