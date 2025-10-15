# 🔐 NilData Wallet Connector

React provider for seamless NilData Wallet browser extension authentication.

[![npm version](https://badge.fury.io/js/nil-data-wallet-connector.svg)](https://www.npmjs.com/package/nil-data-wallet-connector)

## Installation

```bash
npm install nil-data-wallet-connector
```

## Quick Start

```typescript
import { NilDataWalletProvider, useNilDataWallet } from 'nil-data-wallet-connector';

// 1. Wrap your app
function App() {
  return (
    <NilDataWalletProvider extensionId="your-extension-id">
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

### Environment Setup

```env
# .env
VITE_EXTENSION_ID=your_extension_id_here
```

### Basic Usage

```typescript
<NilDataWalletProvider extensionId={import.meta.env.VITE_EXTENSION_ID}>
  <App />
</NilDataWalletProvider>
```

### Custom UI

```typescript
<NilDataWalletProvider 
  extensionId="..."
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
| `extensionId` | `string` | Yes | - |
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
  extensionId: string;
}
```

## Requirements

- React 16.8+
- Chrome/Chromium browser
- NilData Wallet extension installed

## License

MIT © [ysongh](https://github.com/ysongh)

## Links

- [GitHub](https://github.com/ysongh/nil-data-wallet-connector)
- [Issues](https://github.com/ysongh/nil-data-wallet-connector/issues)
- [NPM](https://www.npmjs.com/package/nil-data-wallet-connector)