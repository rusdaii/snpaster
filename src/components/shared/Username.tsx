import { twMerge } from 'tailwind-merge';

type UserNameProps = {
  username: string;
  verified: boolean;
  className?: string;
  size?: number;
  prefix?: boolean;
};
const Username = ({
  username,
  verified,
  className,
  size,
  prefix,
}: UserNameProps) => {
  return (
    <p className={twMerge('flex items-center', className)}>
      {prefix ? '@' : null}
      {username}
      {verified ? (
        <img
          src="/assets/icons/check.svg"
          alt="verified"
          width={size}
          height={size}
        />
      ) : null}
    </p>
  );
};

export default Username;
