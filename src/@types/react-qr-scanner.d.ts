declare module 'react-qr-scanner' {
  import React from 'react';

  interface QrScannerProps {
    onError: (error: Error) => void;
    onScan: (data: string | null) => void;
    style?: React.CSSProperties;
  }

  const QrScanner: React.FC<QrScannerProps>;
  export default QrScanner;
}
