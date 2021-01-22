// npm install --save-dev @types/react
/// <reference path="../../node_modules/@types/react/index.d.ts" />
// npm install --save-dev @types/react-dom
/// <reference path="../../node_modules/@types/react-dom/index.d.ts" />

interface indexTitle {
	key: string
	, title: string
}

class indexView extends React.Component {
	private title: indexTitle[] = [];

	constructor(props: any) {
		super(props);
	}

	/**
	 * メニュー - タイトルを設定
	 * @param item タイトル
	 */
	public setTitle(item: indexTitle): void{
		this.title.push(item);
	}

	/**
	 * メニュー
	 * @param container div
	 */
	public menu(container: HTMLElement | null): void{
		const element: JSX.Element = (
			<ul>
				{
					this.title.map((item: indexTitle) => (
						<li><a href={ "#" + item.key }>{ item.title }</a></li>
					))
				}
			</ul>
		);

		if (container) {
			ReactDOM.render(element, container);
		}
	}
}

interface module {
	exports: any;
}
if (typeof module !== "undefined" && module && module.exports) {
	module.exports.indexView = indexView;
}