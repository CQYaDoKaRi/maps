// npm install --save-dev react @types/react
import React, { useCallback } from "react";
// npm install --save react-dropzone
import { useDropzone, FileRejection } from "react-dropzone";

/**
 * React Component - ViewMapsDataGpxFileDropzone - props
 */
type Props = {
	// イベント
	onDrop: (accepted: File[], rejected: FileRejection[]) => void;
};

/**
 * React Component - ViewMapsDataGpxFileDropzone
 * @param props props
 */
const ViewMapsDataGpxFileDropzone: React.FC<Props> = (props) => {
	const onDrop = useCallback(props.onDrop, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: ".gpx",
		onDrop,
	});

	return (
		<div className="contentsUpload" {...getRootProps()}>
			<input {...getInputProps()} />
			{isDragActive ? (
				<div>GPXファイル（*.gpx）をドロップしてアップロード</div>
			) : (
				<div>GPXファイル（*.gpx）をアップロード</div>
			)}
		</div>
	);
};

export default ViewMapsDataGpxFileDropzone;
