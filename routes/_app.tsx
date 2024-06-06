import type { PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;,;" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Donatepage</title>
        <link rel="stylesheet" href="/styles.css" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" />
        <meta name="apple-mobile-web-app-title" content="Donatepage" />
        <meta name="application-name" content="Donatepage" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body class="font-sans">
        <Component />
      </body>
    </html>
  );
}
