import { useState } from 'react';
import { useFetch } from '../context/ContextProvider';

const VerifyForm = () => {
	const { verifyEmail } = useFetch();
	const { text, verifyError, verifySuccess } = useFetch();
	const [verifyEmailText, setVerifyEmailText] = useState('');

	return (
		<div className="container">
			<h3>Not on our list ? Get Verified !</h3>
			<form className="child">
				<input
					id="email"
					type="text"
					placeholder="E-MAIL"
					value={verifyEmailText}
					onChange={(e) => setVerifyEmailText(e.target.value)}
				/>
			</form>
			{verifySuccess && <p style={{ color: 'black' }}>{text}</p>}
			{verifyError && <p style={{ color: 'red' }}>{text}</p>}
			<button
				type="click"
				onClick={() => verifyEmail(verifyEmailText)}
				className="button"
			>
				Verify
			</button>
		</div>
	);
};

export default VerifyForm;
