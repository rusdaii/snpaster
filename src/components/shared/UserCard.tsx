import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import Username from './Username';
import { useToast } from '../ui/use-toast';

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { toast } = useToast();
  return (
    <div className="user-card">
      <Link to={`/profile/${user.$id}`}>
        <img
          src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
          alt="creator"
          className="rounded-full w-14 h-14"
        />
      </Link>
      <div className="flex-center flex-col gap-1">
        <Link to={`/profile/${user.$id}`}>
          <p className="base-medium text-light-1 text-center line-clamp-1 hover:text-light-3">
            {user.name}
          </p>
        </Link>

        <Username
          username={user.username}
          verified={user.isVerified}
          size={18}
          className="small-regular text-light-3 text-center"
        />
      </div>

      <Button
        type="button"
        size="sm"
        className="shad-button_primary px-5"
        onClick={() =>
          toast({
            title: 'Coming soon!',
            description: 'This feature not available yet',
          })
        }
      >
        Follow
      </Button>
    </div>
  );
};

export default UserCard;
