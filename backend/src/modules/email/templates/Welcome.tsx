import {
	Body,
	Container,
	Heading,
	Html,
	Img,
	Section,
	Text,
	render
} from '@react-email/components'

interface WelcomeTemplateProps {
	password: string
}

const frontEndUrl = process.env.FRONTEND_URL
const imgSrc = process.env.IMAGE_EMAIL

export const welcomeTemplate = async (password: string) =>
	await render(<WelcomeTemplate password={password} />)

// TODO: использовать @react-email/tailwind заместо style
function WelcomeTemplate({ password }: WelcomeTemplateProps) {
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
					<Text style={tertiary}> Добро пожаловать в Astagam!</Text>
					<Heading style={secondary}>Пароль для вашей учетной записи:</Heading>
					<Section style={codeContainer}>
						<Text style={code}>{password}</Text>
					</Section>
					<Text style={paragraph}>
						Пожалуйста, измените его при первой возможности.
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

const codeContainer = {
	background: 'rgba(0,0,0,.05)',
	borderRadius: '4px',
	margin: '16px auto 14px',
	verticalAlign: 'middle',
	width: '280px'
}

const code = {
	color: '#000',
	display: 'inline-block',
	fontFamily: 'HelveticaNeue-Bold',
	fontSize: '32px',
	fontWeight: 700,
	letterSpacing: '6px',
	lineHeight: '40px',
	paddingBottom: '8px',
	paddingTop: '8px',
	margin: '0 auto',
	width: '100%',
	textAlign: 'center' as const
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
	fontWeight: 600,
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
