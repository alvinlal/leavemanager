import { SendEmailCommand } from '@aws-sdk/client-ses';
import sesClient from '../config/sesClient.js';

const sendEmail = async (data, to, subject) => {
  await sesClient.send(
    new SendEmailCommand({
      Source: process.env.AWS_SES_SOURCE,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: data,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    })
  );
};

export default sendEmail;
