import { sidebarLinks } from '@/constants';
import { useUserContext } from '@/context/AuthContext';
import { useSignOutAccount } from '@/lib/react-query/queries';
import { INavLink } from '@/types';
import { useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import Username from './Username';
import AvatarLoader from './AvatarLoader';
import NavbarLoader from './NavbarLoader';
import { Skeleton } from '../ui/skeleton';

const LeftSidebar = () => {
  const { pathname } = useLocation();

  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();

  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex items-center justify-center gap-3">
          <h1 className="text-5xl font-allura">Constgram</h1>
        </Link>

        <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
          {user.id === '' ? (
            <AvatarLoader />
          ) : (
            <>
              <img
                src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                alt="profile"
                className="rounded-full h-14 w-14"
              />
              <div className="flex flex-col">
                <p className="body-bold">{user.name}</p>

                <Username
                  username={user.username}
                  verified={user.isVerified}
                  prefix
                  className="small-regular text-light-3"
                  size={18}
                />
              </div>
            </>
          )}
        </Link>

        {user.id === '' ? (
          <NavbarLoader />
        ) : (
          <ul className="flex flex-col gap-6">
            {sidebarLinks.map((link: INavLink) => {
              const isActive = pathname === link.route;

              return (
                <li
                  key={link.label}
                  className={`leftsidebar-link group ${
                    isActive && 'bg-primary-500'
                  }`}
                >
                  <NavLink
                    to={link.route}
                    className="flex items-center gap-4 p-4"
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className={`group-hover:invert-white ${
                        isActive && 'invert-white'
                      }`}
                    />
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {user.id === '' ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={() => signOut()}
        >
          <img src="/assets/icons/logout.svg" alt="sign out" />
          <p className="small-medium lg:base-medium">Sign Out</p>
        </Button>
      )}
    </nav>
  );
};

export default LeftSidebar;
