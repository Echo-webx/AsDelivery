export function calculateWidths(sale: number, swap: number, bonus: number) {
	const total = sale + swap + bonus
	const saleWidth = (sale / total) * 100
	const swapWidth = (swap / total) * 100
	const bonusWidth = (bonus / total) * 100

	return {
		saleWidth: `${saleWidth}%`,
		swapWidth: `${swapWidth}%`,
		bonusWidth: `${bonusWidth}%`
	}
}

export function formatNumber(number: number) {
	return number.toLocaleString('ru-RU')
}
