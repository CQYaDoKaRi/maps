import { ViewMenuTitle } from "../src/view/ViewMenu";

declare module "*.json" {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data: any;
	export default data;
}

declare module "*dTitle.json" {
	const data: ViewMenuTitle[];
	export default data;
}
