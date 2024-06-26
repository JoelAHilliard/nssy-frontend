import { useState, useRef } from 'preact/hooks';
import QrReader from 'react-web-qr-reader';
const QRCodeScanner = () => {
    const delay = 500;

    const previewStyle = {
      height: 240,
      width: 320,
    };
  
    const [result, setResult] = useState('No result');
  
    const handleScan = (result) => {
      if (result) {
        setResult(result);
      }
    };
  
    const handleError = (error) => {
      console.log(error);
    };
  return (
    <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
  );
};

export default QRCodeScanner;