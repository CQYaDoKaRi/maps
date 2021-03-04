import { Action } from "redux";

// type
export const ActionType = {
	menu: "view/menu",
};

/**
 * action：interface：タイトル = ページ処理
 */
export interface ActionUrl extends Action {
	type: string;
	key: string;
}

/**
 * action：タイトル = ページ処理
 * @param key タイトルキー
 */
export const actionUrl = (key: string): ActionUrl => ({
	type: ActionType.menu,
	key: key,
});
