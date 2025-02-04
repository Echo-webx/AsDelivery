class MAIN {
	private root = '/'

	HOME = this.root
	AUTH = `${this.root}auth`
	RESET = `${this.root}auth/reset`
}
export const MAIN_PAGES = new MAIN()

class ADMIN {
	private root = '/dashboard'

	MAIN = this.root
}
export const ADMIN_PAGES = new ADMIN()

class CORE {
	private root = '/'

	MANAGE = `${this.root}manage`
	RELEASE = `${this.root}release`
	RECEPTION = `${this.root}reception`
	YIELDS = `${this.root}yields`
}
export const CORE_PAGES = new CORE()

class PROFILE {
	private root = '/me'

	MAIN = this.root
}
export const PROFILE_PAGES = new PROFILE()
