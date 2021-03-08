import { createStore } from "redux";
import { actionKey } from "./RAction";
import reducer from "./RReducer";

/*
・初期処理
	[RStore]
	store を作成
		store = createStore(reducer);
	|
・ステータス送信
	[RStore]
	store に {ステータス} を Dispatch する
		store.dispatch({ステータス})
	｜
・ステータス処理
	[RReducer + RAction]
	reducer が {ステータス} を処理＆更新
	｜
・ステータス取得
	[RStore]
	store から {ステータス} を取得する
		store.getState
*/

/**
 * store
 */
const store = createStore(reducer);
export default store;

/**
 * store - Dispatch - メニュー
 * @param key タイトルキー
 */
export const storeDispatchMenu = (key: string): void => {
	store.dispatch(actionKey(key));
};

/**
 * store - Dispatch - メニュー
 * @returns key タイトルキー
 */
export const storeGetMenuKey = (): string => {
	return store.getState().key;
};
