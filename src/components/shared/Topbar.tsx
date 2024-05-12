import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queries';
import { useUserContext } from '@/context/AuthContext';

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();

  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="px-5 py-4 flex-between">
        <Link to="/" className="flex items-center justify-center gap-3">
          <h1 className="text-4xl font-allura">Constgram</h1>
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="" />
          </Button>

          <Link to={`/profile/${user.id}`} className="gap-3 flex-center">
            <img
              src={user.imageUrl || '/assets/images/profile-placeholder.svg'}
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
