import { type RefObject, useEffect, useRef, useState } from 'react'

import { useClickOutside } from './useClickOutside'

export type ToggleModal = {
	isOpen: boolean
	isAnim: boolean
	isMemo: boolean
	openModal: () => void
	closeModal: () => void
	toggleModal: () => void
}

interface Time {
	close?: number
}

interface Props {
	ref?: RefObject<HTMLElement | null>
	time?: Time
	onOpen?: () => void
	onClose?: () => void
	callback?: () => void
}

export function useToggleModal({
	ref,
	time,
	onOpen,
	onClose,
	callback
}: Props = {}): ToggleModal {
	const [isOpen, setIsOpen] = useState(false)
	const [isAnim, setIsAnim] = useState(false)
	const modalTimeout = useRef<NodeJS.Timeout | null>(null)

	const isMemo = !isOpen || isAnim

	const openModal = () => {
		setIsOpen(true)
		onOpen?.()
	}

	const closeModal = () => {
		setIsAnim(true)
		modalTimeout.current = setTimeout(() => {
			setIsOpen(false)
			onClose?.()
			callback?.()
			setIsAnim(false)
		}, time?.close || 200)
	}

	const toggleModal = () => (!isOpen ? openModal() : closeModal())

	useEffect(() => {
		return () => {
			const timeout = modalTimeout.current
			if (timeout) clearTimeout(timeout)
		}
	}, [])

	if (ref) useClickOutside(ref, () => closeModal(), isMemo)

	return {
		isOpen,
		isAnim,
		isMemo,
		openModal,
		closeModal,
		toggleModal
	}
}
