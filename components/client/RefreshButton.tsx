'use client';

import { useRouter } from 'next/navigation';

interface RefreshButtonProps {
  className?: string;
  label?: string;
}

const RefreshButton = ({ className = '', label = 'Rafraîchir' }: RefreshButtonProps) => {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <button 
      onClick={handleRefresh} 
      className={`robot-button text-xs ${className}`}
    >
      {label}
    </button>
  );
};

export default RefreshButton;