import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6145213958807273'
          crossOrigin='anonymous'
        ></script>
        <meta
          name='description'
          content='TopGPT is an innovative AI assistant that can help you with a wide range of tasks. From scheduling appointments to managing your to-do list, TopGPT is your go-to solution for all your daily needs. With advanced natural language processing capabilities, TopGPT understands your commands and responds with lightning-fast speed. So why wait? Try TopGPT today and experience the power of AI at your fingertips!'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
