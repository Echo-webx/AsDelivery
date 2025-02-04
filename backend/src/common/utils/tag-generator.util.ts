function getAlphabetSuffix(index: number): string {
	let suffix = ''
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

	while (index >= 0) {
		suffix = alphabet[index % 26] + suffix
		index = Math.floor(index / 26) - 1
	}

	return suffix
}

export async function generateTag(
	indicator: string,
	countLogs: number,
	currentYear: number
): Promise<string> {
	const baseNumber = (countLogs % 10000) + 1
	const numberPart = baseNumber.toString().padStart(4, '0')

	const suffixIndex = Math.floor(countLogs / 10000)
	let tag = numberPart

	if (suffixIndex > 0) {
		const suffix = getAlphabetSuffix(suffixIndex - 1)
		tag = `${numberPart}${suffix}`
	}

	return `${indicator}-${currentYear}-${tag}`
}
