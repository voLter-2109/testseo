import { useEffect, useState } from 'react';

// Определяем типы для интерфейса Connection
interface NetworkConnectionInfo {
  rtt?: number;
  type?: string;
  saveData?: boolean;
  downLink?: number;
  downLinkMax?: number;
  effectiveType?: string;
}

// Определяем тип для состояния хука
interface NetworkState extends NetworkConnectionInfo {
  since?: string;
  online: boolean;
}

function getNetworkConnection(): any {
  const nav = navigator as any;
  return nav.connection || nav.mozConnection || nav.webkitConnection || null;
}

function getNetworkConnectionInfo(): NetworkConnectionInfo {
  const connection = getNetworkConnection();
  if (!connection) {
    return {};
  }
  // Обязательно проверяем, что все свойства существуют
  return {
    rtt: connection.rtt,
    type: connection.type,
    saveData: connection.saveData,
    downLink: connection.downLink,
    downLinkMax: connection.downLinkMax,
    effectiveType: connection.effectiveType,
  };
}

function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>(() => {
    return {
      since: undefined,
      online: navigator.onLine,
      ...getNetworkConnectionInfo(),
    };
  });

  useEffect(() => {
    const handleOnline = () => {
      setState((prevState) => ({
        ...prevState,
        online: true,
        since: new Date().toString(),
      }));
    };

    const handleOffline = () => {
      setState((prevState) => ({
        ...prevState,
        online: false,
        since: new Date().toString(),
      }));
    };

    const handleConnectionChange = () => {
      setState((prevState) => ({
        ...prevState,
        ...getNetworkConnectionInfo(),
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = getNetworkConnection();
    connection?.addEventListener('change', handleConnectionChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      connection?.removeEventListener('change', handleConnectionChange);
    };
  }, []);

  return state;
}

export default useNetwork;
