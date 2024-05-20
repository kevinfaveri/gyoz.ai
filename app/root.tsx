import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

import styles from './tailwind.css'
import {
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  useTheme,
} from '~/providers/theme-provider'
import { getThemeSession } from '~/utils/theme.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const themeSession = await getThemeSession(request.headers.get('Cookie'))

  return json({
    theme: themeSession.getTheme(),
  })
}

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: styles },
]

function App() {
  const data = useLoaderData<typeof loader>()
  const [theme] = useTheme()
  return (
    <html lang="en" className={theme ?? ''} style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data.theme)} />
      </head>
      <body
        className="transition-colors duration-300"
        style={{ height: '100%' }}
      >
        <Outlet />
        <ThemeBody ssrTheme={Boolean(data.theme)} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  )
}
