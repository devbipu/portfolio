import { Resend } from 'resend'
import type { H3Event } from 'h3'
import type { ContactEmail } from '~/types/ContactEmail'

const resend = new Resend(process.env.NUXT_PRIVATE_RESEND_API_KEY)

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = (await readBody(event)) as ContactEmail
    const { email, subject, message, phone, fullname } = body
    return await resend.emails.send({
      from: 'Portfolio Site <contact@bipu.dev>',
      to: ['developer.bipu@gmail.com'],
      subject: 'Contact from Website ',
      html: `
      <p>Website contact from contacts</p>
      <p>Information of sender :</p>
      <ul>
        <li>Nom : ${fullname}</li>
        <li>Email : ${email}</li>
        <li>Téléphone : ${phone}</li>
        <li>Sujet : ${subject}</li>
        <li>Message : ${message}</li>
      </ul>
      `,
    })
  } catch (error) {
    return { error }
  }
})
