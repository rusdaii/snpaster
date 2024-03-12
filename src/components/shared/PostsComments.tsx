import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import { ScrollArea } from '../ui/scroll-area';

type PostCommentsProps = {
  post: Models.Document;
};
const PostsComments = ({ post }: PostCommentsProps) => {
  const comments = post.comments;

  return (
    <ScrollArea className="h-80 w-full">
      <div>
        <ul className="flex flex-col gap-5">
          {comments?.map((comment: Models.Document) => (
            <li key={comment.$id} className="flex gap-2">
              <div className="w-10">
                <Link to={`/profile/${comment.user.$id}`}>
                  <img
                    src={comment.user.imageUrl}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                </Link>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-col gap-1">
                  <Link to={`/profile/${comment.user.$id}`}>
                    <span className="hover:text-light-3">
                      {comment.user.username}
                    </span>
                  </Link>
                  <p className="small-regular">{comment.comment}</p>
                </div>

                <span>
                  <p className="text-light-3 small-regular">
                    {multiFormatDateString(comment.$createdAt)}
                  </p>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  );
};

export default PostsComments;
