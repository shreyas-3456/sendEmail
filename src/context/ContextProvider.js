import React, { useContext, useReducer } from 'react';
import { SEND_MAIL, VERIFY_MAIL } from '../actions';
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

	return (
		<StateProvider.Provider
			value={{
				...state,
				sendEmail,
				verifyEmail,
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
