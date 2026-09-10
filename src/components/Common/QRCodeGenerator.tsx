import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeSVG: React.FC<QRCodeProps> = ({ value, size = 160, className = '' }) => {
  const [svgString, setSvgString] = useState<string>('');

  useEffect(() => {
    QRCode.toString(value, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((svg) => {
        setSvgString(svg);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });
  }, [value]);

  if (!svgString) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`bg-slate-800 animate-pulse rounded flex items-center justify-center text-xs text-slate-500 ${className}`}
      >
        جاري إنشاء الرمز...
      </div>
    );
  }

  return (
    <div
      className={`inline-block bg-white p-2 rounded-lg shadow-inner ${className}`}
      dangerouslySetInnerHTML={{ __html: svgString }}
      style={{ width: size, height: size }}
    />
  );
};
