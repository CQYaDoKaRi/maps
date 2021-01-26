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
export class IndexViewMenu extends React.Component<indexViewMenuProps, {}> {
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