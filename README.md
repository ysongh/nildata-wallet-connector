# 🔐 NilData Wallet Connector

React provider for seamless NilData Wallet browser extension authentication.

[![npm version](https://badge.fury.io/js/nildata-wallet-connector.svg)](https://www.npmjs.com/package/nildata-wallet-connector)

## Installation

```bash
npm install nildata-wallet-connector
```

## Quick Start

```typescript
import { NilDataWalletProvider, useNilDataWallet } from 'nildata-wallet-connector';

// 1. Wrap your app
function App() {
  return (
    <NilDataWalletProvider>
      <Dashboard />
    </NilDataWalletProvider>
  );
}

// 2. Use the hook
function Dashboard() {
  const { nillionDiD, extensionConnected } = useNilDataWallet();
  
  return (
    <div>
      {extensionConnected && <p>Connected: {nillionDiD}</p>}
    </div>
  );
}
```

## Features

- 🎯 Simple Provider/Hook pattern
- 🎨 Customizable UI
- 🔄 Auto-connect support
- 🛡️ Full TypeScript support
- 📦 Zero dependencies

## Usage

### Basic Usage

```typescript
<NilDataWalletProvider>
  <App />
</NilDataWalletProvider>
```

### Custom UI

```typescript
<NilDataWalletProvider 
  customUI={({ requestAccess, extensionConnected }) => (
    <button onClick={requestAccess}>
      {extensionConnected ? 'Connected' : 'Connect Wallet'}
    </button>
  )}
>
  <App />
</NilDataWalletProvider>
```

### Using the Hook

```typescript
const { 
  nillionDiD,
  extensionConnected,
  requestAccess,
  disconnect 
} = useNilDataWallet();
```

## API

### Provider Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| `children` | `ReactNode` | Yes | - |
| `customUI` | `function` | No | - |
| `autoConnect` | `boolean` | No | `false` |
| `onConnectionChange` | `function` | No | - |

### Hook Returns

```typescript
{
  nillionDiD: string | null;
  extensionConnected: boolean;
  status: { message: string; type: string };
  requestAccess: () => void;
  disconnect: () => void;
}
```

## Requirements

- React 16.8+
- Chrome/Chromium browser
- NilData Wallet extension installed

## License

MIT © [ysongh](https://github.com/ysongh)

## Links

- [GitHub](https://github.com/ysongh/nildata-wallet-connector)
- [Issues](https://github.com/ysongh/nildata-wallet-connector/issues)
- [NPM](https://www.npmjs.com/package/nildata-wallet-connector)