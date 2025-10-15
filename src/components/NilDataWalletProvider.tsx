import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

import { EXTENSION_ID } from '../keys';

interface StatusState {
  message: string;
  type: 'pending' | 'granted' | 'denied';
}

interface ConnectionChangeCallback {
  connected: boolean;
  nillionDiD: string | null;
}

interface ExtensionMessage {
  type: string;
  granted?: boolean;
  nillionDiD?: string;
  [key: string]: any;
}

interface NilDataWalletContextValue {
  nillionDiD: string | null;
  extensionConnected: boolean;
  status: StatusState;
  requestAccess: () => void;
  disconnect: () => void;
  extensionId: string;
}

interface CustomUIProps extends NilDataWalletContextValue {
  requestBtnText: string;
  requestBtnDisabled: boolean;
  showRequestBtn: boolean;
}

interface NilDataWalletProviderProps {
  extensionId: string;
  children: ReactNode;
  onConnectionChange?: (status: ConnectionChangeCallback) => void;
  customUI?: (props: CustomUIProps) => ReactNode;
  autoConnect?: boolean;
}

interface DefaultConnectionUIProps {
  status: StatusState;
  requestAccess: () => void;
  requestBtnText: string;
  requestBtnDisabled: boolean;
  showRequestBtn: boolean;
  extensionConnected: boolean;
  nillionDiD: string | null;
  disconnect: () => void;
}

// Context for sharing extension state across the app
const NilDataWalletContext = createContext<NilDataWalletContextValue | null>(null);

/**
 * Provider component that wraps the entire app
 * Handles extension connection and provides DID to all child components
 */
export const NilDataWalletProvider = ({ 
  children,
  onConnectionChange,
  customUI,
  autoConnect = false
}: NilDataWalletProviderProps) => {
  const extensionId = EXTENSION_ID;

  const [nillionDiD, setNillionDiD] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusState>({
    message: 'Extension not detected - Please install the extension first',
    type: 'pending'
  });
  const [extensionConnected, setExtensionConnected] = useState<boolean>(false);
  const [requestBtnText, setRequestBtnText] = useState<string>('Connect DID');
  const [requestBtnDisabled, setRequestBtnDisabled] = useState<boolean>(true);
  const [showRequestBtn, setShowRequestBtn] = useState<boolean>(true);

  useEffect(() => {
    if (!extensionId) {
      throw new Error('extensionId is required for NilDataWalletProvider');
    }

    const checkExtension = () => {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage(
          extensionId,
          { type: 'PING' },
          (response: any) => {
            if (chrome.runtime.lastError) {
              console.log(response);
              setStatus({
                message: 'Extension not found - Please install and reload page',
                type: 'denied'
              });
            } else {
              setStatus({
                message: 'Extension detected! Click to request access',
                type: 'pending'
              });
              setRequestBtnDisabled(false);
              
              // Auto-connect if enabled
              if (autoConnect) {
                setTimeout(() => requestAccess(), 500);
              }
            }
          }
        );
      } else {
        setStatus({
          message: 'Not running in a browser that supports extensions',
          type: 'denied'
        });
      }
    };

    const timer = setTimeout(checkExtension, 500);

    // Listen for messages from extension
    const messageListener = (event: MessageEvent) => {
      if (event.data.type === 'FROM_EXTENSION') {
        const message: ExtensionMessage = event.data.data;
        console.log('Received from extension:', message);
        
        if (message.type === 'ACCESS_RESPONSE') {
          if (message.granted) {
            setExtensionConnected(true);
            setStatus({
              message: 'Access Granted! You can now use extension features',
              type: 'granted'
            });
            setShowRequestBtn(false);
            if (message.nillionDiD) {
              setNillionDiD(message.nillionDiD);
            }
            
            // Callback for connection change
            if (onConnectionChange) {
              onConnectionChange({ 
                connected: true, 
                nillionDiD: message.nillionDiD || null
              });
            }
          } else {
            handleAccessDenied();
          }
        }
        else if (message.type === 'REJECTED') {
          handleAccessDenied();
        }
      }
    };

    const handleAccessDenied = () => {
      setStatus({
        message: 'Access Denied by user',
        type: 'denied'
      });
      setRequestBtnDisabled(false);
      setRequestBtnText('Request Again');
      
      if (onConnectionChange) {
        onConnectionChange({ connected: false, nillionDiD: null });
      }
    };

    window.addEventListener('message', messageListener);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', messageListener);
    };
  }, [extensionId, autoConnect, onConnectionChange]);

  const requestAccess = () => {
    setRequestBtnDisabled(true);
    setRequestBtnText('Requesting...');
    setStatus({
      message: 'Requesting access... Extension popup will open shortly!',
      type: 'pending'
    });

    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage(
        extensionId,
        {
          type: 'REQUEST_ACCESS',
          origin: window.location.origin,
          timestamp: Date.now(),
          openPopup: true
        },
        (response: any) => {
          if (chrome.runtime.lastError) {
            setStatus({
              message: 'Failed to connect to extension',
              type: 'denied'
            });
            setRequestBtnDisabled(false);
            setRequestBtnText('Try Again');
          } else if (response && response.granted) {
            setExtensionConnected(true);
            setStatus({
              message: 'Access Granted! You can now use extension features',
              type: 'granted'
            });
            setShowRequestBtn(false);
            
            if (onConnectionChange) {
              onConnectionChange({ 
                connected: true, 
                nillionDiD: response.nillionDiD || null
              });
            }
          } else if (response && response.popupOpened) {
            setStatus({
              message: 'Extension popup opened - Please Allow or Deny the request',
              type: 'pending'
            });
          } else {
            setStatus({
              message: 'Access Denied by user',
              type: 'denied'
            });
            setRequestBtnDisabled(false);
            setRequestBtnText('Request Again');
          }
        }
      );
    }
  };

  const disconnect = () => {
    setExtensionConnected(false);
    setNillionDiD(null);
    setShowRequestBtn(true);
    setRequestBtnDisabled(false);
    setRequestBtnText('Connect DID');
    setStatus({
      message: 'Disconnected. Click to reconnect',
      type: 'pending'
    });
    
    if (onConnectionChange) {
      onConnectionChange({ connected: false, nillionDiD: null });
    }
  };

  const contextValue: NilDataWalletContextValue = {
    nillionDiD,
    extensionConnected,
    status,
    requestAccess,
    disconnect,
    extensionId
  };

  return (
    <NilDataWalletContext.Provider value={contextValue}>
      {/* Custom UI or default UI */}
      {customUI ? (
        customUI({
          ...contextValue,
          requestBtnText,
          requestBtnDisabled,
          showRequestBtn
        })
      ) : (
        <DefaultConnectionUI 
          status={status}
          requestAccess={requestAccess}
          requestBtnText={requestBtnText}
          requestBtnDisabled={requestBtnDisabled}
          showRequestBtn={showRequestBtn}
          extensionConnected={extensionConnected}
          nillionDiD={nillionDiD}
          disconnect={disconnect}
        />
      )}
      
      {children}
    </NilDataWalletContext.Provider>
  );
};

/**
 * Default UI component for connection
 */
const DefaultConnectionUI = ({
  requestAccess,
  requestBtnText,
  requestBtnDisabled,
  showRequestBtn,
  nillionDiD,
  disconnect
}: DefaultConnectionUIProps) => {
  // if (extensionConnected) {
  //   return null; // Don't show UI when connected
  // }

  const truncateDID = (did: string | null, startChars: number = 20, endChars: number = 20): string | null => {
    try {
      if (!did) return null;
      if (did.length <= startChars + endChars) return did;
      return `${did.slice(0, startChars)}...${did.slice(-endChars)}`;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return (
    <div className="bg-gray-100 flex flex-row justify-end">
      <div className="bg-white p-1 rounded-lg shadow-lg flex flex-row items-center">
        {nillionDiD && <div className="py-2 mr-2">
           {truncateDID(nillionDiD)}
        </div>}

        <div className="">
          {showRequestBtn ? (
            <button
              onClick={requestAccess}
              disabled={requestBtnDisabled}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-base"
            >
              {requestBtnText}
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-base"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to access extension context in any component
 */
export const useNilDataWallet = (): NilDataWalletContextValue => {
  const context = useContext(NilDataWalletContext);
  
  if (!context) {
    throw new Error(
      'useNilDataWallet must be used within NilDataWalletProvider'
    );
  }
  
  return context;
};
