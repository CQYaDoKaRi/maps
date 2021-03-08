import { Action } from "redux";

// type
export const ActionType = {
	menu: "view/menu",
};

/**
 * action：interface：キー
 */
export interface ActionKey extends Action {
	type: string;
	key: string;
}

/**
 * action：キー
 * @param key キー
 */
export const actionKey = (key: string): ActionKey => ({
	type: ActionType.menu,
	key: key,
});
