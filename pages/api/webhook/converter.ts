import * as jp from 'jsonpath';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
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
    const alerts = body.alerts;

    alerts.forEach(async alert => {
        const { webhookUrl } = alert.labels;

        if (!webhookUrl) {
            res.status(400).json({ message: 'webhookUrl is required' });
            return;
        }

        let alertPramas = {};

        Object.keys(alert.labels).forEach(key => {
            if (!['alertname', 'instance', 'webhookUrl'].includes(key)) {
                const jsonPath = alert.labels[key];
                const jsonPathValue = jsonPath.startsWith('$')
                    ? jp
                          .query(body, jsonPath)
                          .map(value => value.toString())
                          .join(', ')
                    : jsonPath;
                alertPramas[key] = jsonPathValue;
            }
        });

        try {
            const alertResponse = await fetch(webhookUrl, {
                method: method,
                headers: headers,
                body: JSON.stringify(alertPramas),
            });

            console.log(`alertResponse:${await alertResponse.text()}`);

            if (!alertResponse.ok) {
                throw new Error(`Failed to send alert: ${alertResponse.statusText}`);
            }

            res.status(200).json({ message: 'ok' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: `Internal Server Error: ${error.message}` });
        }
    });
}
