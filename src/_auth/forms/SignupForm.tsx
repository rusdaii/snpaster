import { Link, useNavigate } from 'react-router-dom';
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
import { signUpValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import {
  useCreateUserAccount,
  useSignInAccount,
} from '@/lib/react-query/queries';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useUserContext } from '@/context/AuthContext';

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();

  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const handleSignUp = async (values: z.infer<typeof signUpValidation>) => {
    try {
      const newUser = await createUserAccount(values);

      if (!newUser) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Sign up failed. Please try again.',
        });

        return;
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Sign in failed. Please try again.',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });

        navigate('/sign-in');

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate('/');
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Sign in failed. Please try again.',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });

        return;
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <Form {...form}>
      <div className="flex-col sm:w-420 flex-center">
        <h1 className="text-7xl font-allura">Constgram</h1>

        <h2 className="pt-5 h3-bold md:h2-bold sm:pt-12">
          Create a new account
        </h2>

        <p className="mt-2 text-light-3 small-medium md:base-regular">
          To use Snapster, you need to create an account.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignUp)}
          className="flex flex-col w-full gap-5 mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount ? (
              <div className="gap-2 flex-center">
                <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                Creating account
              </div>
            ) : (
              'Sign up'
            )}
          </Button>

          <p className="mt-2 text-center text-small-regular text-light-2">
            Already have an account?{' '}
            <Link
              to="/sign-in"
              className="ml-1 text-primary-500 text-small-semibold"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
