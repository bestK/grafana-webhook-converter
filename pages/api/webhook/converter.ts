import * as jp from 'jsonpath';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function Converter(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    if (!req.body) {
        res.status(400).json({ message: 'Request body is required' });
        return;
    }

    const allHeaders = req.headers;
    const authorization = allHeaders['authorization'];
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (authorization) {
        headers.append('authorization', authorization);
    }

    const method = req.method;
    const body = req.body;
    const { commonLabels } = body;
    const { webhookUrl } = commonLabels;

    if (!webhookUrl) {
        res.status(400).json({ message: 'webhookUrl is required' });
        return;
    }

    const alertPramas = {};
    Object.keys(commonLabels).forEach(key => {
        if (!['alertname', 'instance', 'webhookUrl'].includes(key)) {
            const jsonPath = commonLabels[key];
            const jsonPathValue = readValue(jsonPath, body);
            // @ts-ignore
            alertPramas[key] = jsonPathValue;
        }
    });

    try {
        const alertResponse = await fetch(webhookUrl, {
            method: method,
            headers: headers,
            body: JSON.stringify(alertPramas),
        });

        if (!alertResponse.ok) {
            throw new Error(`Failed to send alert: ${alertResponse.statusText}`);
        }

        res.status(200).json({ message: 'ok' });
    } catch (error: any) {
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

function readValue(jsonPath: string, body: any) {
    let value = '';

    jsonPath.split(',').forEach(path => {
        if (path.startsWith('$')) {
            value += jp.query(body, path).map(value => value.toString());
        } else {
            value += path;
        }
    });

    return value;
}
