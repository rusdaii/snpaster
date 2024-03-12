import { Skeleton } from '../ui/skeleton';

const NavbarLoader = () => {
  return (
    <ul className="flex flex-col gap-7">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </ul>
  );
};

export default NavbarLoader;
