import {
	SESClient,
	VerifyEmailAddressCommand,
	SendEmailCommand,
} from '@aws-sdk/client-ses';
import { createRawMail } from '../helper/raw_mail formater';

import { SEND_MAIL, VERIFY_MAIL, SEND_RAW_MAIL } from '../actions';
import { validateEmail } from '../utils/validate';
import AWS from 'aws-sdk';
import jsPDF from 'jspdf';

const client = new SESClient({
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.REACT_APP_KEY_ID,
		secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
	},
});

const ses = new AWS.SES({
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.REACT_APP_KEY_ID,
		secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
	},
});

const reducer = (state, action) => {
	switch (action.type) {
		case VERIFY_MAIL:
			const email = action.payload;
			if (!validateEmail(email)) {
				return {
					...state,
					verifyError: true,
					verifySuccess: false,
					text: 'Enter valid email',
				};
			}

			const command = new VerifyEmailAddressCommand({
				EmailAddress: email,
			});
			const verify = (async () => {
				try {
					return await client.send(command);
				} catch (error) {
					return error;
				}
			})();

			if (verify) {
				return {
					...state,
					verifyError: false,
					verifySuccess: true,
					text: 'check email to get verified',
				};
			} else {
				return {
					...state,
					verifyError: true,
					verifySuccess: false,
					text: 'Something went wrong',
				};
			}

		case SEND_MAIL:
			const { name, email: mail, text } = action.payload;
			if (!validateEmail(mail)) {
				return {
					...state,
					formError: true,
					formSuccess: false,
					text: 'Enter valid email',
				};
			}

			let params = {
				Destination: {
					/* required */
					CcAddresses: [
						mail,
						/* more items */
					],
					ToAddresses: [
						mail,
						/* more items */
					],
				},
				Message: {
					/* required */
					Body: {
						/* required */
						Html: {
							Charset: 'UTF-8',
							Data: text || 'Sending mail via Amazon SES',
						},
						Text: {
							Charset: 'UTF-8',
							Data: 'TEXT_FORMAT_BODY',
						},
					},
					Subject: {
						Charset: 'UTF-8',
						Data: `Test email for ${name} `,
					},
				},
				Source: 'shreyas.nigam25@gmail.com' /* required */,
				ReplyToAddresses: [
					'shreyas.nigam25@gmail.com',
					/* more items */
				],
			};

			const sendMail = new SendEmailCommand(params);
			const send = (async () => {
				try {
					return await client.send(sendMail);
				} catch (error) {
					return error;
				}
			})();
			if (send) {
				return {
					...state,
					formSuccess: true,
					formError: false,
					verifyError: false,
					verifySuccess: false,
					text: 'Message sent',
				};
			}
			break;
		case SEND_RAW_MAIL:
			const { name: Name, text: Text, email: Email } = action.payload;
			let doc = new jsPDF();
			doc.text(10, 10, Text);
			doc = btoa(doc.output());

			const message = createRawMail(
				'shreyas.nigam25@gmail.com',
				Email,
				Name,
				doc
			);

			const rawParams = {
				Destinations: message
					.getRecipients({ type: 'to' })
					.map((mailbox) => mailbox.addr),
				RawMessage: {
					Data: message.asRaw(), // aws-sdk does the base64 encoding
				},
				Source: message.getSender().addr,
			};

			ses.sendRawEmail(rawParams, function (err, result) {
				if (err) return console.log(err.message);
				return console.log(result.MessageId);
			});
			return {
				...state,
				formSuccess: true,
				formError: false,
				verifyError: false,
				verifySuccess: false,
				text: 'attachment sent',
			};

		default:
			throw new Error(`No matching ${action.type} found`);
	}
};

export default reducer;
