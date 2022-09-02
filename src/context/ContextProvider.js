import React, { useContext, useReducer } from 'react';
import { SEND_MAIL, SEND_RAW_MAIL, VERIFY_MAIL } from '../actions';
import reducer from '../reducer/reducer';

const StateProvider = React.createContext();

let intialState = {
	formError: false,
	formSuccess: false,
	verifyError: false,
	verifySuccess: false,
	text: '',
};

const ContextProvider = ({ children }) => {
	let [state, dispatch] = useReducer(reducer, intialState);

	const sendEmail = (name, email, text) => {
		dispatch({ type: SEND_MAIL, payload: { name, email, text } });
	};

	const verifyEmail = (email) => {
		try {
			dispatch({ type: VERIFY_MAIL, payload: email });
		} catch (error) {}
	};
	const sendRawEmail = (name, email, text) => {
		dispatch({ type: SEND_RAW_MAIL, payload: { name, email, text } });
	};

	return (
		<StateProvider.Provider
			value={{
				...state,
				sendEmail,
				verifyEmail,
				sendRawEmail,
			}}
		>
			{children}
		</StateProvider.Provider>
	);
};

export const useFetch = () => {
	return useContext(StateProvider);
};

export default ContextProvider;
