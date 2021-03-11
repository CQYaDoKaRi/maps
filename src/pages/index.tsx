import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Provider } from "react-redux";

import store, { storeDispatchMenu, storeGetMenuKey } from "../view/RStore";

import View from "../view/View";
import { ViewMenuTitle } from "../view/ViewMenu";

type propsType = {
	titleData: ViewMenuTitle[];
};

const evt = () => {
	if (typeof window !== "undefined") {
		const hash = `#${storeGetMenuKey()}`;
		window.location.hash = hash;
	}
};

/**
 * ページ
 * @param param0
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const index = ({ titleData }: propsType) => {
	const api = "http://localhost:8080/";

	const getHash = () => {
		let vHash = "";
		let f = false;
		if (typeof window !== "undefined") {
			vHash = window.location.hash;
			if (vHash.length > 0) {
				vHash = vHash.substring(1);
			}

			titleData.map((item: ViewMenuTitle) => {
				if (item.key.toLowerCase() === vHash.toLowerCase()) {
					f = true;
				}
			});
		}

		if (!f) {
			vHash = titleData[0].key;
		}

		return vHash;
	};

	store.subscribe(() => {
		evt();
	});

	storeDispatchMenu(getHash());

	return (
		<>
			<Provider store={store}>
				<View api={api} titleData={titleData} />
			</Provider>
		</>
	);
};

export default index;

/**
 * データ取得
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const protocol = "http";
	const host = ctx.req.headers.host ? ctx.req.headers.host : "";

	const res = await fetch(`${protocol}://${host}/data/dTitle.json`);
	const titleData: ViewMenuTitle[] = (await res.json()) as ViewMenuTitle[];

	return { props: { titleData } };
};
