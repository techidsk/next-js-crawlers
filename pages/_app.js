import '../styles/global.css'
import { GeistProvider, CssBaseline } from '@geist-ui/react'
import { MediaProvider } from '../lib/medias'
import "react-datepicker/dist/react-datepicker.css";

export default function App({ Component, pageProps }) {
  return <MediaProvider>
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  </MediaProvider>
}