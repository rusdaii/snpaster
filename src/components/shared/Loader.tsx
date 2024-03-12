import { ReloadIcon } from '@radix-ui/react-icons';
import { twMerge } from 'tailwind-merge';

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className="flex-center w-full">
      <ReloadIcon className={twMerge('animate-spin', className)} />
    </div>
  );
};

export default Loader;
