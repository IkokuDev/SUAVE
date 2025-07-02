import React from 'react';

const SuaveLogo = ({ size = 'normal' }: { size?: 'normal' | 'large' }) => {
  const textSize = size === 'large' ? 'text-3xl' : 'text-xl';
  const subTextSize = size === 'large' ? 'text-sm' : 'text-xs';

  return (
    <div className="text-center">
      <p className={`text-white font-bold ${textSize}`}>SUAVE</p>
      <p className={`text-white ${subTextSize} tracking-widest`}>DESIGNS</p>
    </div>
  );
};

export default SuaveLogo;
