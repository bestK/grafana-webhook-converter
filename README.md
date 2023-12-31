# Grafana Webhook Converter

The Grafana Webhook Converter is a project that allows users to customize their webhook requests. Users can tailor the request body to suit their preferences, with the `webhookUrl` being a mandatory field. Additionally, the project supports the use of JSONPath to reconstruct the structure from the original alert.


![#](doc/message.png)

```json
// define custom fields
{
"content": "$.status,测试,$.title,$.commonAnnotations.summary,$.externalURL",
"msgType": "text",
"name": "xxxx",
"webhookUrl": "http://xxxxx"
}

```

### Usage

Catch Grafana webhook data [https://requestcatcher.com](https://requestcatcher.com)

![#](doc/catcher.png)


Use this [endpoint](https://grafana-webhook-converter.vercel.app/api/webhook/converter) to replace your webhook.

Or use the Cloudflare worker [_workder.js](./cf-worker/_workder.js)

Support for multiple JSONPaths eg:`$.status,Im text,$.title,$.commonAnnotations.summary`


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
