import { useRouter } from "next/router";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Item = () => {
	const router = useRouter();

	const items = router.query;

	return (
		<h1>
			<div>ページ階層は {router.query.item} です</div>
			<p>引数：</p>
			<ul>
				{Object.keys(items).map((key) => {
					return (
						<li>
							{key} = {items[key]}
						</li>
					);
				})}
			</ul>
		</h1>
	);
};

export default Item;
