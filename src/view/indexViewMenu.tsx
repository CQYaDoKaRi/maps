// npm install --save-dev react @types/react
import React from "react";
export interface indexMenuTitle {
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
export class IndexViewMenu extends React.Component<indexViewMenuProps> {
	/**
	 * コンストラクター
	 * @param props
	 */
	constructor(props: indexViewMenuProps) {
		super(props);
	}

	render(): JSX.Element{
		return(
			<ul>
				{
					this.props.titles.map((item: indexMenuTitle) => (
						<li key={ item.key }><a href={ "#" + item.key }>{ item.title }</a></li>
					))
				}
			</ul>
		);
	}
}