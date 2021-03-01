// npm install --save-dev react @types/react
import React from "react";

export interface ViewMenuTitle {
	key: string;
	title: string;
}

/**
 * React Component - ViewMenu - props
 */
type Props = {
	// タイトル
	titles: ViewMenuTitle[];
};

/**
 * React Component - ViewMenu
 * @param props props
 */
const ViewMenu: React.FC<Props> = (props) => {
	return (
		<ul>
			{props.titles.map((item: ViewMenuTitle) => (
				<li key={item.key}>
					<a href={"#" + item.key}>{item.title}</a>
				</li>
			))}
		</ul>
	);
};

export default ViewMenu;
