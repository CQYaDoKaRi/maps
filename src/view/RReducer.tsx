import { ActionUrl, ActionType, actionUrl } from "./RAction";

// state
export interface state {
	key: string;
}

// state
const stateInit: state = {
	key: "",
};

/**
 * reducer
 * @param state state
 * @param action action
 */
export const reducer = (state: state = stateInit, action: ActionUrl): state => {
	switch (action.type) {
		case ActionType.menu:
			return { key: actionUrl(action.key).key };
		default:
			return state;
	}
};

export default reducer;
