import { useState } from 'react';
import { useFetch } from '../context/ContextProvider';

const Form = () => {
	const {
		sendEmail,
		formError,
		formSuccess,
		text: Text,
		sendRawEmail,
	} = useFetch();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [text, setText] = useState('');
	const handleChange = (e) => {
		if (e.target.name === 'name') {
			setName(e.target.value);
		} else {
			setEmail(e.target.value);
		}
	};
	return (
		<>
			<form id="form" onSubmit={(e) => e.preventDefault()}>
				<h3>Enter your name and email so we can get started !</h3>
				<input
					id="name"
					type="text"
					placeholder="NAME"
					name="name"
					value={name}
					onChange={handleChange}
				/>
				<input
					id="email"
					type="text"
					placeholder="E-MAIL"
					name="email"
					value={email}
					onChange={handleChange}
				/>
				<label htmlFor="">WRITE TEXT HERE</label>
				<textarea value={text} onChange={(e) => setText(e.target.value)} />
				{formSuccess && <p style={{ color: 'black' }}>{Text}</p>}
				{formError && <p style={{ color: 'red' }}>{Text}</p>}
				<button
					type="click"
					onClick={() => sendEmail(name, email, text)}
					className="button"
				>
					Submit
				</button>
				<button
					type="click"
					onClick={() => sendRawEmail(name, email, text)}
					className="button"
				>
					pdf mail
				</button>
			</form>
		</>
	);
};

export default Form;
