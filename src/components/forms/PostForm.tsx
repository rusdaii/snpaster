import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import FileUploader from '../shared/FileUploader';
import { postValidation, updatePostValidation } from '@/lib/validation';
import { Models } from 'appwrite';
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queries';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '../ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useNavigate } from 'react-router-dom';
import { ReloadIcon } from '@radix-ui/react-icons';

type PostFormProps = {
  post?: Models.Document;
  action: 'create' | 'update';
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();

  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  const { user } = useUserContext();

  const navigate = useNavigate();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(
      action === 'update' ? updatePostValidation : postValidation
    ),
    defaultValues: {
      caption: post ? post?.caption : '',
      file: [],
      location: post ? post?.location : '',
      tags: post ? post.tags.join(',') : '',
    },
  });

  const onSubmit = async (values: z.infer<typeof postValidation>) => {
    if (post && action === 'update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });

      if (!updatedPost) {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: 'Please try again',
        });
      }

      return navigate(`/post/${post.$id}`);
    }

    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Please try again',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    navigate('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Art, Sports, Gaming"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex justify-end items-center gap-4">
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || isLoadingUpdate ? (
              <>
                <ReloadIcon className="mr-2 h-6 w-6 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>{action === 'create' ? 'Post' : 'Update'}</span>
            )}
          </Button>
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
