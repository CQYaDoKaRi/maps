// npm install --save-dev react @types/react
import React, { useState } from "react";
// npm install --save-dev react-bootstrap bootstrap
import Table from "react-bootstrap/Table";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";

import { maps } from "../ts/maps";

/**
 * React Component - ViewMapsScale - props
 */
type Props = {
	lat: number;
	lon: number;
	dpi: number;
};

/**
 * React Component - ViewMapsScale
 * @param props props
 */
const ViewMapsScale: React.FC<Props> = (props) => {
	const oMaps: maps = new maps();

	const [lat, setLat] = useState(props.lat);
	const [dpi] = useState(props.dpi);

	/**
	 * イベント：緯度
	 * @param e 緯度
	 */
	const onChange = (e: React.ChangeEvent) => {
		const target = e.target as HTMLInputElement;
		setLat(+target.value);
	};

	const scale = [];
	for (let n = 0; n < 29; n++) {
		scale.push(n);
	}

	return (
		<div className="contentsScale">
			<InputGroup className="mb-3" style={{ width: "400px", paddingLeft: "5px" }}>
				<InputGroup.Prepend>
					<InputGroup.Text id="lat">緯度</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl
					type="number"
					style={{ width: "200px" }}
					defaultValue={lat}
					placeholder="緯度"
					onChange={onChange}
				/>
				<FormControl type="number" defaultValue={dpi} placeholder="解像度" readOnly />
				<InputGroup.Append>
					<InputGroup.Text>DPI</InputGroup.Text>
				</InputGroup.Append>
			</InputGroup>
			<Table striped bordered hover size="sm" style={{ width: "400px" }}>
				<thead>
					<tr>
						<th style={{ textAlign: "center", width: "100px" }}>ズームレベル</th>
						<th style={{ textAlign: "center", width: "150px" }}>縮尺</th>
					</tr>
				</thead>
				<tbody>
					{scale.map((n) => {
						return (
							<tr key={n}>
								<td style={{ textAlign: "center" }}>{n}</td>
								<td style={{ textAlign: "right" }}>
									{`1 / ${Math.floor(oMaps.tileScale(n, lat, dpi)).toLocaleString()}`}
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</div>
	);
};

export default ViewMapsScale;
