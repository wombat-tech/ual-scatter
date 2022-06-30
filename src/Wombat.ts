import {
  Authenticator, ButtonStyle, Chain,
  UALError, UALErrorType, User
} from 'universal-authenticator-library'
import { Name } from './interfaces'
import { wombatLogo } from './wombatLogo'
import { WombatUser } from './WombatUser'
import { UALWombatError } from './UALWombatError'

declare let window: any

export class Wombat extends Authenticator {
  private users: WombatUser[] = []
  private scatter: any
  private appName: string
  private scatterIsLoading: boolean = false

  /**
   * Scatter Constructor.
   *
   * @param chains
   * @param options { appName } appName is a required option to use Scatter
   */
  constructor(chains: Chain[], options?: any) {
    super(chains)
    if (options && options.appName) {
      this.appName = options.appName
    } else {
      throw new UALWombatError('Scatter requires the appName property to be set on the `options` argument.',
        UALErrorType.Initialization,
        null)
    }
  }

  /**
   * Checks Scatter for a live connection.  Will set an Initialization Error
   * if we cannot connect to scatter.
   */
  public async init(): Promise<void> {
    this.scatterIsLoading = true

    // set an errored state if scatter doesn't connect
    if (!window.scatter) {
      this.scatterIsLoading = false

      return
    }

    await window.scatter.connect(this.appName)

    this.scatter = window.scatter
    this.scatterIsLoading = false
  }

  public reset(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.init()
  }

  public isLoading(): boolean {
    return this.scatterIsLoading
  }

  public isErrored(): boolean {
    return false
  }

  public getError(): UALError | null {
    return null
  }

  public getStyle(): ButtonStyle {
    return {
      icon: wombatLogo,
      text: Name,
      textColor: 'white',
      background: '#f43e27'
    }
  }

  /**
   * Scatter will only render on Desktop Browser Environments
   */
  public shouldRender(): boolean {
    return true
  }

  public shouldAutoLogin(): boolean {
    return false
  }

  public async login(_?: string): Promise<User[]> {
    this.users = []

    try {
      for (const chain of this.chains) {
        const user = new WombatUser(chain, this.scatter)
        await user.getKeys()
        this.users.push(user)
      }

      return this.users
    } catch (e) {
      window.open('https://getwombat.io')
      throw new UALWombatError(
        'Unable to login',
        UALErrorType.Login,
        e)
    }
  }

  /**
   * Call logout on scatter.  Throws a Logout Error if unsuccessful
   */
  public async logout(): Promise<void> {
    try {
      this.scatter.logout()
    } catch (error) {
      throw new UALWombatError('Error occurred during logout',
        UALErrorType.Logout,
        error)
    }
  }

  /**
   * Scatter provides account names so it does not need to request it
   */
  public async shouldRequestAccountName(): Promise<boolean> {
    return false
  }

  public isMobile(): boolean {
    const userAgent = window.navigator.userAgent
    const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad')
    const isMobile = userAgent.includes('Mobile')
    const isAndroid = userAgent.includes('Android')
    const isCustom = userAgent.toLowerCase().includes('eoslynx')

    return isIOS || isMobile || isAndroid || isCustom
  }

  public getOnboardingLink(): string {
    return 'https://getwombat.io/'
  }

  public requiresGetKeyConfirmation(): boolean {
    return false
  }

  public getName(): string {
    return Name
  }
}
