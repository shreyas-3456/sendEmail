// init mimetext
const { createMimeMessage } = require('mimetext');

export const createRawMail = (sender, to, name, attachement) => {
	const message = createMimeMessage();
	message.setSender(sender);
	message.setTo(to);
	message.setSubject('Sending attachement via SES');
	message.setAttachment('attachement.pdf', 'application/pdf', attachement);
	message.setMessage('text/html', `Hello <b>${name}</b>.`);
	return message;
};
