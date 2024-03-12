import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from '@/lib/react-query/queries';
import { checkIsLiked } from '@/lib/utils';
import { Models } from 'appwrite';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

type PostStatsProps = {
  post: Models.Document;
  userId: string;
  showSaved?: boolean;
  showWords?: boolean;
};
const PostStats = ({ post, userId, showSaved, showWords }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSaving } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);

    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);

      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });

      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-5 items-center">
        <div className="flex gap-2">
          <img
            src={
              checkIsLiked(likes, userId)
                ? '/assets/icons/liked.svg'
                : '/assets/icons/like.svg'
            }
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            className="cursor-pointer"
          />
          {showWords ? (
            <p className="small-regular">{likes.length + ' ' + 'likes'}</p>
          ) : (
            <p>{likes.length}</p>
          )}
        </div>

        <Link to={`/post/${post.$id}`} className="flex gap-2 items-center">
          <ChatBubbleIcon width={20} height={20} className="text-primary-500" />
          {showWords ? (
            <p className="small-regular">
              {post.comments.length + ' ' + 'comments'}
            </p>
          ) : (
            post.comments.length
          )}
        </Link>
      </div>

      {showSaved ? (
        <div className="flex gap-2">
          {isSaving ? (
            <Loader className="w-6 h-6" />
          ) : (
            <img
              src={
                isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'
              }
              alt="like"
              width={20}
              height={20}
              onClick={handleSavePost}
              className="cursor-pointer"
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PostStats;
