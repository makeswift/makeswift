export function isDevelopment() {
	if (typeof window !== 'undefined') {
		// Check if the page is being rendered inside Makeswift
		const isAncestor = Boolean(window.location.ancestorOrigins?.length)
		if (isAncestor) {
			return true
		}
	}

	return process.env.NODE_ENV === 'development'
}
