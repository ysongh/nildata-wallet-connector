# 🔐 NilData Wallet Connector

React provider for seamless NilData Wallet browser extension authentication and data management.

[![npm version](https://badge.fury.io/js/nildata-wallet-connector.svg)](https://www.npmjs.com/package/nildata-wallet-connector)

## Prerequisites

Before using this package, you need to install the NilData Wallet browser extension:

**[📥 Download NilData Wallet Extension](https://github.com/ysongh/NilDataWallet)**

## Installation

```bash
npm install nildata-wallet-connector
```

## Quick Start

```typescript
import { NilDataWalletProvider, useNilDataWallet, sendDataToExtension } from 'nildata-wallet-connector';

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
  
  const handleStoreData = () => {
    sendDataToExtension(
      'my-collection',
      'sensitive user data',
      'builder-did-123',
      'delegation-token-xyz',
      'collection-id-456'
    );
  };
  
  return (
    <div>
      {extensionConnected && (
        <>
          <p>Connected: {nillionDiD}</p>
          <button onClick={handleStoreData}>Store Private Data</button>
        </>
      )}
    </div>
  );
}
```

## Features

- 🎯 Simple Provider/Hook pattern
- 🔐 Secure data storage via extension
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

### Storing Private Data

Use `sendDataToExtension` to securely store user data via the NilData Wallet extension:

```typescript
import { sendDataToExtension } from 'nildata-wallet-connector';

function DataStorageComponent() {
  const handleSubmit = async (userData: string) => {
    sendDataToExtension(
      'user-profiles',           // Collection name
      userData,                  // User's private data
      'builder-did-123',         // Builder DID
      'delegation-token-xyz',    // Delegation token
      'collection-id-456'        // Collection ID
    );
  };

  return (
    <button onClick={() => handleSubmit('sensitive-data')}>
      Store Data Securely
    </button>
  );
}
```

#### Complete Example

```typescript
import { useNilDataWallet, sendDataToExtension } from 'nildata-wallet-connector';
import { useState } from 'react';

function SecureDataForm() {
  const { extensionConnected, nillionDiD } = useNilDataWallet();
  const [formData, setFormData] = useState('');
  const [status, setStatus] = useState('');

  const handleStore = () => {
    if (!extensionConnected) {
      setStatus('Please connect your wallet first');
      return;
    }

    sendDataToExtension(
      'medical-records',         // Collection name
      formData,                  // Private data
      nillionDiD,               // Builder DID (from wallet)
      'your-delegation-token',   // Your delegation token
      'your-collection-id'       // Your collection ID
    );
    
    setStatus('Data sent to extension for secure storage');
  };

  return (
    <div>
      <textarea 
        value={formData}
        onChange={(e) => setFormData(e.target.value)}
        placeholder="Enter private data..."
      />
      <button onClick={handleStore} disabled={!extensionConnected}>
        Store Securely
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
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

### sendDataToExtension Function

Sends private data to the NilData Wallet extension for secure storage.

#### Parameters

```typescript
sendDataToExtension(
  collectionName: string,      // Name of the data collection
  userPrivateData: string,     // The private data to store
  builderDid: string,          // Builder's DID
  delegationToken: string,     // Delegation token for authorization
  collectionId: string         // Unique collection identifier
): void
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `collectionName` | `string` | Human-readable name for the data collection |
| `userPrivateData` | `string` | The sensitive data to be stored securely |
| `builderDid` | `string` | Decentralized identifier of the builder/app |
| `delegationToken` | `string` | Authorization token for data access |
| `collectionId` | `string` | Unique identifier for the collection |

#### Usage Example

```typescript
sendDataToExtension(
  'health-records',
  JSON.stringify({ bloodType: 'O+', allergies: ['peanuts'] }),
  'did:nillion:builder123',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'collection-uuid-12345'
);
```

#### Notes

- The function automatically adds timestamp and origin information
- Opens the extension popup for user confirmation
- Data is sent securely to the extension for processing
- Logs success/error to console

## Data Flow

```
Your App → sendDataToExtension() → Extension → Nillion Network
    ↓
User confirms in extension popup
    ↓
Data stored securely
```

## Requirements

- React 16.8+
- Chrome/Chromium browser
- **NilData Wallet extension installed** - [Download here](https://github.com/ysongh/NilDataWallet)

## Security Considerations

- **Never hardcode tokens**: Always use environment variables for delegation tokens
- **User consent**: The extension popup ensures users approve each data storage operation
- **Data format**: Consider encrypting sensitive data before passing to `sendDataToExtension`
- **Token management**: Implement proper token refresh mechanisms for delegation tokens

## Example: Complete Integration

```typescript
import { 
  NilDataWalletProvider, 
  useNilDataWallet, 
  sendDataToExtension 
} from 'nildata-wallet-connector';

function App() {
  return (
    <NilDataWalletProvider autoConnect>
      <SecureDataApp />
    </NilDataWalletProvider>
  );
}

function SecureDataApp() {
  const { extensionConnected, nillionDiD } = useNilDataWallet();
  
  const saveUserPreferences = (preferences: object) => {
    if (!extensionConnected) {
      alert('Please connect your wallet first');
      return;
    }

    sendDataToExtension(
      'user-preferences',
      JSON.stringify(preferences),
      nillionDiD!,
      process.env.VITE_DELEGATION_TOKEN!,
      process.env.VITE_COLLECTION_ID!
    );
  };

  return (
    <div>
      <h1>My Secure App</h1>
      {extensionConnected ? (
        <>
          <p>Connected as: {nillionDiD}</p>
          <button onClick={() => saveUserPreferences({ theme: 'dark' })}>
            Save Preferences
          </button>
        </>
      ) : (
        <p>Please connect your NilData Wallet</p>
      )}
    </div>
  );
}

export default App;
```

## Troubleshooting

### "Extension not detected"
- **Install the extension first**: [Download NilData Wallet](https://github.com/ysongh/NilDataWallet)
- Ensure NilData Wallet extension is installed and enabled
- Refresh the page after installation

### Data not being stored
- Check that `extensionConnected` is `true`
- Verify all parameters are provided to `sendDataToExtension`
- Check browser console for error messages
- Ensure delegation token is valid

### Extension popup not opening
- Check if popup blockers are disabled
- Verify `openPopup: true` in the message payload
- Check browser permissions for the extension

## Links

- [NPM Package](https://www.npmjs.com/package/nildata-wallet-connector)
- [GitHub Repository](https://github.com/ysongh/nildata-wallet-connector)
- [Report Issues](https://github.com/ysongh/nildata-wallet-connector/issues)
- [NilData Wallet Extension](https://github.com/ysongh/NilDataWallet) - Download the browser extension
- [Nillion Network](https://nillion.com/)