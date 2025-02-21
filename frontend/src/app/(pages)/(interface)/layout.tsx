import type { PropsWithChildren } from 'react'

import { MobileUI } from '@/components/mobile-ui/MobileUI'

export default function MobileTemplate({
	children
}: PropsWithChildren<unknown>) {
	return <MobileUI>{children}</MobileUI>
}
