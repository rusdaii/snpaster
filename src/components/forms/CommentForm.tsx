import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentValidation } from '@/lib/validation';
import { Button } from '../ui/button';
import { PaperPlaneIcon, ReloadIcon } from '@radix-ui/react-icons';
import { z } from 'zod';
import { useUserContext } from '@/context/AuthContext';
import { useParams } from 'react-router-dom';
import { useCommentPost } from '@/lib/react-query/queries';
import { useToast } from '../ui/use-toast';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

const CommentForm = () => {
  const [isCommentValue, setIsCommentValue] = useState(true);

  const { user } = useUserContext();

  const { id } = useParams();

  const { toast } = useToast();

  const { mutateAsync: commentPost, isPending: isCreateComment } =
    useCommentPost(id || '');

  const form = useForm<z.infer<typeof commentValidation>>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      comment: '',
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) return setIsCommentValue(false);

    setIsCommentValue(true);
  };

  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    const newComment = await commentPost({
      ...values,
      postId: id || '',
      userId: user.id,
    });

    if (!newComment) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong.',
      });

      return;
    }
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        comment: '',
      });

      setIsCommentValue(true);
    }
  }, [form.formState.isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl onChange={onChange}>
                <div className="flex gap-2 w-full items-center ">
                  <Input className="shad-input-comment" {...field} />
                  <Button
                    type="submit"
                    className="shad-button_primary whitespace-nowrap"
                    size="icon"
                    disabled={isCreateComment || isCommentValue}
                  >
                    {isCreateComment ? (
                      <ReloadIcon className="animate-spin" />
                    ) : (
                      <PaperPlaneIcon />
                    )}
                  </Button>
                </div>
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CommentForm;
