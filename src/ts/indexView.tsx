// npm install --save-dev @types/react
/// <reference path="../../node_modules/@types/react/index.d.ts" />
// npm install --save-dev @types/react-dom
/// <reference path="../../node_modules/@types/react-dom/index.d.ts" />

interface indexMenuTitle {
	key: string
	, title: string
}

/**
 * React Component - IndexViewMenu - props
 */
type indexViewMenuProps = {
	titles: indexMenuTitle[];
}

/**
 * React Component - IndexViewMenu
 */
class IndexViewMenu extends React.Component<indexViewMenuProps, {}> {
	constructor(props: indexViewMenuProps) {
		super(props);
	}

	render(){
		return(
			<ul>
				{
					this.props.titles.map((item: indexMenuTitle) => (
						<li><a href={ "#" + item.key }>{ item.title }</a></li>
					))
				}
			</ul>
		);
	}
}

/**
 * indexView
 */
class indexView {
	private title: indexMenuTitle[] = [];

	/**
	 * 設定：メニュー - タイトル
	 * @param item タイトル
	 */
	public setMenuTitle(item: indexMenuTitle): void{
		this.title.push(item);
	}

	/**
	 * 描画 - メニュー
	 * @param container Div
	 */
	public renderMenu(container: HTMLElement | null){
		if (container) {
			ReactDOM.render(
				<IndexViewMenu titles={this.title} />
				, container
			);
		}
	}
}

interface module {
	exports: any;
}
if (typeof module !== "undefined" && module && module.exports) {
	module.exports.indexViewRender = indexView;
}