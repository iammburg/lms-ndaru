import nodemailer from 'nodemailer'
import { EmailAdapter, SendEmailOptions } from 'payload'

const nodeMailerAdapter = (): EmailAdapter => {
  const adapter = () => ({
    name: 'nodeMailerAdapter',
    defaultFromName: (process.env.EMAIL_FROM_NAME as string) || 'No Reply',
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS as string,
    sendEmail: async (message: SendEmailOptions): Promise<unknown> => {
      if (!process.env.EMAIL_ACTIVE) {
        console.log('Email service is inactive. Skipping email send.')
        console.log(message)
        return
      }

      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_PORT === '465',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        })

        const info = await transporter.sendMail({
          from: {
            name: process.env.EMAIL_FROM_NAME as string,
            address: process.env.EMAIL_FROM_ADDRESS as string,
          },
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text,
        })

        console.log('Email sent successfully:', info.messageId)
        return info
      } catch (error) {
        console.error('Error sending email:', error)
        throw error
      }
    },
  })

  return adapter
}

export default nodeMailerAdapter
