// npm install --save-dev react @types/react
import React, { useState } from "react";
// npm install --save-dev react-bootstrap bootstrap
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "bootstrap/dist/css/bootstrap.min.css";

interface gpxFile {
	name: string;
	size: number;
	date: string;
}

/**
 * React Component - ViewMapsDataGpxFileSelect - props
 */
type Props = {
	// 選択：未選択
	nameDefault: string;
	// 選択：アップロード
	nameDropzone: string;
	// 選択値
	value: string;
	// 更新
	refresh: boolean;
	// イベント
	onChange: (value: string) => void;
};

/**
 * React Component - ViewMapsDataGpxFileSelect
 * @param props props
 */
const ViewMapsDataGpxFileSelect: React.FC<Props> = (props) => {
	const optionDefaultName = props.nameDefault ? props.nameDefault : "[未選択]";

	// option - 初期値
	const optionDefault: gpxFile[] = [{ name: optionDefaultName, size: 0, date: "" }];
	if (props.nameDropzone) {
		optionDefault.push({ name: props.nameDropzone, size: 0, date: "" });
	}

	// state
	const [files, setTiles] = useState<gpxFile[]>(optionDefault);

	/**
	 * React Component - useEffect - props.refresh
	 */
	React.useEffect(() => {
		if (props.refresh) {
			fetch("api/view/gpx/files", {
				method: "GET",
			})
				.then((response) => {
					if (response.status === 200) {
						void response.json().then((files: gpxFile[]) => {
							if (files) {
								files = optionDefault.concat(files);
							} else {
								files = optionDefault;
							}
							setTiles(files);
						});
					}
				})
				.catch(() => {
					console.error("[api]=[api/view/gpx/files] request error.");
				});
		}
	}, [props.refresh]);

	return (
		<DropdownButton className="contentsSelect" title={props.value}>
			{files.map((item: gpxFile, index: number) => {
				return (
					<Dropdown.Item
						key={index}
						active={item.name === props.value}
						onSelect={(key: string | null, o: React.BaseSyntheticEvent<Event>) => {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							props.onChange(o.target.innerText as string);
						}}
					>
						{item.name}
					</Dropdown.Item>
				);
			})}
		</DropdownButton>
	);
};

export default ViewMapsDataGpxFileSelect;
