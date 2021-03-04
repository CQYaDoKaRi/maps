import { createStore } from "redux";
import { ActionType } from "./RAction";
import reducer, { stateUrl } from "./RReducer";

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
	store.dispatch({ type: ActionType.menu, key: key });
};

/**
 * store - Dispatch - メニュー
 * @returns key タイトルキー
 */
export const storeGetMenuKey = (): string => {
	const state: stateUrl = store.getState();
	return state.key;
};