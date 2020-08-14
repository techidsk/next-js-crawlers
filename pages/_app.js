import '../styles/global.css'
import { ZeitProvider, CssBaseline } from '@zeit-ui/react'
import { MediaProvider } from '../lib/medias'

export default function App({ Component, pageProps }) {
  return <MediaProvider>
    <ZeitProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </ZeitProvider>
  </MediaProvider>
}