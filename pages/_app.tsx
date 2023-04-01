import { QueryClient } from '@tanstack/react-query';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import nProgress from 'nprogress';
import type { ReactElement, ReactNode } from 'react';
import { Fragment, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import nextI18NextConfig from '../next-i18next.config';

import QueryClientSsrProvider from 'contexts/QueryClientSsrProvider';
import SettingsProvider from 'contexts/SettingContext';
import SnackbarProvider from 'contexts/SnackbarProvider';
import { store as reduxStore } from 'store';
import MuiTheme from 'theme/MuiTheme';
import OpenGraphTags from 'utils/OpenGraphTags';

import '../src/styles/global.css';
import '../src/fonts/SVN-Rubik/index.css';
import 'nprogress/nprogress.css';
import 'simplebar/dist/simplebar.min.css';
import '../src/mock-server';

type MyAppProps = AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
};

// Binding events.
Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());
// small change
nProgress.configure({ showSpinner: false });

const App = ({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: MyAppProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const AnyComponent = Component as any;
  const getLayout = AnyComponent.getLayout ?? ((page) => page);

  return (
    <Fragment>
      <Head>
        <meta charSet='utf-8' />
        <meta
          name='description'
          content='Đồ án TTTN - Học viện Công nghệ Bưu chính Viễn thông'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
        <OpenGraphTags />
        <title>Nutribox - Bữa ăn dinh dưỡng tốt cho sức khoẻ</title>
      </Head>

      <SessionProvider session={session}>
        <SettingsProvider>
          <ReduxProvider store={reduxStore}>
            <MuiTheme>
              <SnackbarProvider>
                <QueryClientSsrProvider
                  queryClient={queryClient}
                  dehydratedState={dehydratedState}
                >
                  {getLayout(<AnyComponent {...pageProps} />)}
                </QueryClientSsrProvider>
              </SnackbarProvider>
            </MuiTheme>
          </ReduxProvider>
        </SettingsProvider>
      </SessionProvider>
    </Fragment>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps };
// };

export default appWithTranslation(App, nextI18NextConfig);
