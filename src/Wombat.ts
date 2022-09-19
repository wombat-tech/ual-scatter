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
  private readonly appName: string
  private error: UALWombatError | null = null
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
    this.error = null

    // set an errored state if scatter doesn't connect
    if (!window.scatter) {
      this.scatterIsLoading = false
      this.error = new UALWombatError('Wombat wallet not found', UALErrorType.Initialization, null)
      return
    }

    try {
      await window.scatter.connect(this.appName)
    } catch (e) {
      this.error = new UALWombatError('Could not connect to Wombat wallet', UALErrorType.Initialization, e)
      return
    }

    this.scatter = window.scatter
    this.scatterIsLoading = false
  }

  public reset(): void {
    this.error = null
    this.scatterIsLoading = false
    this.users = []
    this.scatter = undefined
    this.init().catch(error => console.error('Error resetting Wombat UAL', error))
  }

  public isLoading(): boolean {
    return this.scatterIsLoading
  }

  public isErrored(): boolean {
    return this.error !== null && this.error.type !== UALErrorType.Initialization
  }

  public getError(): UALError | null {
    return this.error
  }

  public getStyle(): ButtonStyle {
    return {
      icon: wombatLogo,
      text: Name,
      textColor: 'white',
      background: '#f43e27'
    }
  }

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
      const origin = window.location.href
      window.open('https://app.getwombat.io/dapp-view?url=' + origin)
      throw new UALWombatError('Unable to login', UALErrorType.Login, e)
    }
  }

  /**
   * Call logout on scatter.  Throws a Logout Error if unsuccessful
   */
  public async logout(): Promise<void> {
    try {
      this.scatter.logout()
    } catch (e) {
      throw new UALWombatError('Error occurred during logout', UALErrorType.Logout, e)
    }
  }

  /**
   * Scatter provides account names so it does not need to request it
   */
  public async shouldRequestAccountName(): Promise<boolean> {
    return false
  }

  public getOnboardingLink(): string {
    return 'https://www.wombat.app/'
  }

  public requiresGetKeyConfirmation(): boolean {
    return false
  }

  public getName(): string {
    return Name
  }
}
