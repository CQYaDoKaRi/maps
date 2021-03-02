// npm install --save-dev react @types/react
import React, { useState } from "react";
// npm install --save-dev react-bootstrap bootstrap
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "bootstrap/dist/css/bootstrap.min.css";

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
	// タイトルキー（選択値）
	titleKey: string;
	// イベント
	onChange: (titleKey: string) => void;
};

/**
 * React Component - ViewMenu
 * @param props props
 */
const ViewMenu: React.FC<Props> = (props) => {
	// state
	const [key, setKey] = useState(props.titleKey);

	/**
	 * 取得：タイトル
	 */
	const getTitle = () => {
		const item: ViewMenuTitle[] = props.titles.filter((item: ViewMenuTitle) => {
			return item.key === key;
		});
		return item.length > 0 ? item[0].title : "";
	};

	/**
	 * イベント
	 * @param key タイトルキー
	 */
	const eChange = (key: string) => {
		setKey(key);
		props.onChange(key);
	};

	return (
		<DropdownButton className="contentsSelect" title={getTitle()}>
			{props.titles.map((item: ViewMenuTitle, index: number) => {
				return (
					<Dropdown.Item
						key={index}
						active={item.key === key}
						onSelect={() => {
							eChange(item.key);
						}}
					>
						{item.title}
					</Dropdown.Item>
				);
			})}
		</DropdownButton>
	);
};

export default ViewMenu;
