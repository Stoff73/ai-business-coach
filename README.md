# AI Business Coach

This project is a Next.js application providing an AI powered business coach.

## Installation

Make sure you have Node.js installed and [pnpm](https://pnpm.io/) available.

Install dependencies:

```bash
pnpm install
```

## Required environment variables

Create a `.env` file in the project root defining the following variables:

- `OPENAI_API_KEY` – your OpenAI API key used by the chat endpoint.
- `CUSTOM_KEY` – a custom key exposed to the client through `next.config.js`.

Example:

```env
OPENAI_API_KEY=sk-...
CUSTOM_KEY=my-custom-value
```

## Development

Run the development server with:

```bash
pnpm run dev
```

## Build and start in production

Build the application:

```bash
pnpm run build
```

Start the production server:

```bash
pnpm start
```

## Deployment on Vercel

The repository includes `vercel.json` for Vercel deployments. After configuring the `OPENAI_API_KEY` secret in your Vercel project and pushing the code, Vercel will run the build and start commands defined in the configuration. You can deploy via the Vercel dashboard or using the `vercel` CLI.

