import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import logger from "./logger";

const smtp = config.get<{
  user: string;
  host: string;
  port: number;
  pass: string;
  secure: boolean;
}>("smtp");

// (async () => {
//   logger.info(await nodemailer.createTestAccount());
// })();

const transport = nodemailer.createTransport({
  ...smtp,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

const sendEmail = async (payload: SendMailOptions) => {
  try {
    const info = await transport.sendMail(payload);
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    logger.error(error, "Error sending email!");
  }
};

export default sendEmail;
