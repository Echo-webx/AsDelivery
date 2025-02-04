import {
	Children,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	isValidElement,
	useEffect,
	useState
} from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import type { OptionDataProps } from '../element/Option'

interface Props {
	children: ReactNode
	name?: string
	selectedValues: OptionDataProps[]
	defaultValue?: string | number
	defaultData?: OptionDataProps[]
	setSelectedValues: Dispatch<SetStateAction<OptionDataProps[]>>
	setValue?: UseFormSetValue<any>
}

export function useDefaultSelect({
	children,
	name,
	selectedValues,
	defaultValue,
	defaultData,
	setSelectedValues,
	setValue
}: Props) {
	const [checkData, setCheckData] = useState(false)

	useEffect(() => {
		if (defaultValue && selectedValues.length === 0) {
			const defaultOption = Children.toArray(children).find(child => {
				return (
					isValidElement<OptionDataProps>(child) &&
					child.props.value === defaultValue
				)
			})
			if (defaultOption && isValidElement<OptionDataProps>(defaultOption)) {
				setSelectedValues([
					{
						value: defaultOption.props.value,
						content: defaultOption.props.content
					}
				])
				if (setValue && name)
					setValue(name, defaultValue, {
						shouldValidate: true
					})
			}
		}
	}, [defaultValue])

	useEffect(() => {
		if (defaultData && selectedValues.length === 0 && !checkData) {
			const defaultOptions = defaultData
				.filter(option => option.value !== '' && option.content !== '')
				.map(option => ({
					value: option.value,
					content: option.content,
					additionalData: option.additionalData
				}))

			setSelectedValues(defaultOptions)
			setCheckData(true)

			if (setValue && name)
				setValue(
					name,
					defaultOptions.map(val => val.value),
					{ shouldValidate: true }
				)
		}
	}, [defaultData])
}
