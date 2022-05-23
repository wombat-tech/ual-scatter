# UAL for Wombat Authenticator

This authenticator is meant to be used with [Wombat](https://getwombat.io/) and [Universal Authenticator Library](https://github.com/EOSIO/universal-authenticator-library). When used in combination with them, it gives developers the ability to request transaction signatures through Wombat using the common UAL API.

## Getting Started

`npm install wombat-ual --save`

#### Dependencies

You must use one of the UAL renderers below.

React - `ual-reactjs-renderer`


PlainJS - `ual-plainjs-renderer`


#### Basic Usage with React

```javascript
import { Wombat } from 'wombat-ual'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'

const exampleNet = {
  chainId: '',
  rpcEndpoints: [{
    protocol: '',
    host: '',
    port: '',
  }]
}

const App = (props) => <div>{JSON.stringify(props.ual)}</div>
const AppWithUAL = withUAL(App)

const wombat = new Wombat([exampleNet], { appName: 'Example App' })

<UALProvider chains={[exampleNet]} authenticators={[wombat]}>
  <AppWithUAL />
</UALProvider>
```


## License

[MIT](https://github.com/EOSIO/ual-scatter/blob/develop/LICENSE)

## Important


See [LICENSE](./LICENSE) for copyright and license terms.

All repositories and other materials are provided subject to the terms of this [IMPORTANT](./IMPORTANT.md) notice and you must familiarize yourself with its terms.  The notice contains important information, limitations and restrictions relating to our software, publications, trademarks, third-party resources, and forward-looking statements.  By accessing any of our repositories and other materials, you accept and agree to the terms of the notice.
