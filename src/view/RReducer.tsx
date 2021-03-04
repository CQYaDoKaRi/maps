import { ActionUrl, ActionType, actionUrl } from "./RAction";

export interface stateUrl {
	key: string;
}

const stateUrlInit: stateUrl = { key: "" };

export const reducer = (state: stateUrl = stateUrlInit, action: ActionUrl): stateUrl => {
	switch (action.type) {
		case ActionType.menu:
			return { key: actionUrl(action.key).key };
		default:
			return state;
	}
};

export default reducer;
