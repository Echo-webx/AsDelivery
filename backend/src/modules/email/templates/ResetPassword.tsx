import {
	Body,
	Button,
	Container,
	Heading,
	Html,
	Img,
	render,
	Text
} from '@react-email/components'

interface ResetPasswordTemplateProps {
	resetUrl: string
}

const frontEndUrl = process.env.FRONT_END_URL
const imgSrc = process.env.IMAGE_EMAIL

export const resetPasswordTemplate = async (resetUrl: string) =>
	await render(<ResetPasswordTemplate resetUrl={resetUrl} />)

function ResetPasswordTemplate({ resetUrl }: ResetPasswordTemplateProps) {
	return (
		<Html>
			<Body style={main}>
				<Container style={container}>
					<Img
						src={`${imgSrc ? imgSrc : `${frontEndUrl}/pwa/favicon-white.webp`}`}
						width="120"
						height="120"
						alt="Plaid"
						style={logo}
					/>
					<Text style={tertiary}>Astagam</Text>
					<Heading style={secondary}>
						Пришел запрос на смену пароля для вашей учетной записи.
					</Heading>
					<Button style={button} href={`${frontEndUrl}${resetUrl}`}>
						Восстановить пароль
					</Button>
					<Text style={paragraph}>
						Если это не вы просто проигнорируйте или удалите это сообщение.
					</Text>
					<Text style={paragraph}>
						Чтобы обезопасить свою учетную запись, никому не пересылайте это
						письмо.
					</Text>
				</Container>
			</Body>
		</Html>
	)
}

const main = {
	backgroundColor: '#0a0a0a',
	fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
	paddingTop: '100px',
	paddingBottom: '100px'
}

const logo = {
	margin: '0 auto'
}

const button = {
	backgroundColor: '#007ee6',
	borderRadius: '4px',
	color: '#fff',
	fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
	fontSize: '14px',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'block',
	width: '210px',
	padding: '14px 7px',
	margin: '0 auto',
	marginTop: '20px',
	marginBottom: '20px'
}

const container = {
	backgroundColor: '#ffffff',
	borderRadius: '5px',
	maxWidth: '340px',
	margin: '0 auto',
	padding: '30px'
}

const tertiary = {
	color: '#0a85ea',
	fontSize: '11px',
	fontWeight: 700,
	fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
	height: '16px',
	letterSpacing: '0',
	lineHeight: '16px',
	margin: '16px 8px 8px 8px',
	textTransform: 'uppercase' as const,
	textAlign: 'center' as const
}

const secondary = {
	color: '#000',
	display: 'inline-block',
	fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
	fontSize: '14px',
	fontWeight: 500,
	lineHeight: '24px',
	marginBottom: '0',
	marginTop: '0',
	padding: '8'
}

const paragraph = {
	color: '#444',
	fontSize: '14px',
	fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
	letterSpacing: '0',
	lineHeight: '23px',
	margin: '0'
}
