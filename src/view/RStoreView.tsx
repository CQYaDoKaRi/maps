import { Dispatch } from "redux";
import { ActionType, ActionUrl } from "./RAction";
import { state } from "./RReducer";

export interface propsState {
	storeKey: string;
}

export interface propsDispatch {
	storeSetKey: (key: string) => void;
}

/**
 * redux - store 更新時
 * @param state store に connect した state
 */
export const mapStateToProps = (state: state): propsState => ({
	storeKey: state.key,
});

/**
 * redux - dispatch
 * @param dispatch store に connect した dispatch
 */
export const mapDispatchToProps = (dispatch: Dispatch<ActionUrl>): propsDispatch => ({
	storeSetKey: (key: string) => {
		dispatch({ type: ActionType.menu, key: key });
	},
});
