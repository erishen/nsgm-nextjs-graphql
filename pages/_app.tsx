import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { useStore } from '../client/redux/store'
import { GlobalStyle } from '../client/styled/common'

const theme = {
  colors: {
    primary: '#0070f3'
  }
}

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)

  return (
    <>
      <GlobalStyle whiteColor={true} />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </>
  )
}
