import { Dispatch } from "redux";
import { ActionKey, actionKey } from "./RAction";
import { state } from "./RReducer";

/**
 * interface - propsState
 * mapStateToProps により設定される
 */
export interface propsState {
	storeKey: string;
}

/**
 * interface - propsDispatch
 * mapDispatchToProps により設定される
 */
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
export const mapDispatchToProps = (dispatch: Dispatch<ActionKey>): propsDispatch => ({
	storeSetKey: (key: string) => {
		dispatch(actionKey(key));
	},
});
