import { ActionType, ActionKey, actionKey } from "./RAction";

// state
export interface state {
	key: string;
}

// state：初期値
const stateInit: state = {
	key: "",
};

/**
 * reducer
 * @param state state
 * @param action action
 */
export const reducer = (state: state = stateInit, action: ActionKey): state => {
	switch (action.type) {
		case ActionType.menu:
			return { key: actionKey(action.key).key };
		default:
			return state;
	}
};

export default reducer;
