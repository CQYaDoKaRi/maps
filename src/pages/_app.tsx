import { AppProps } from "next/app";
import Head from "next/head";

import "../scss/index.scss";

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
	<>
		<Head>
			<title>MAPS Samples</title>
		</Head>
		<Component {...pageProps} />
	</>
);

export default App;
