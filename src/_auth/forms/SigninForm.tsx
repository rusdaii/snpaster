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
import { signInValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useSignInAccount } from '@/lib/react-query/queries';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useUserContext } from '@/context/AuthContext';

const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleSignIn(values: z.infer<typeof signInValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Sign in failed. Please try again.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate('/');
    } else {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Sign in failed. Please try again.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  return (
    <Form {...form}>
      <div className="flex-col sm:w-420 flex-center">
        <h1 className="text-7xl font-allura">Constgram</h1>

        <h2 className="pt-5 h3-bold md:h2-bold sm:pt-12">
          Sign in into your account
        </h2>

        <p className="mt-2 text-light-3 small-medium md:base-regular">
          Welcome back, please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="flex flex-col w-full gap-5 mt-4"
        >
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
            {isSigningIn || isUserLoading ? (
              <div className="gap-2 flex-center">
                <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                Signing in
              </div>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className="mt-2 text-center text-small-regular text-light-2">
            Don&apos;t have an account?{' '}
            <Link
              to="/sign-up"
              className="ml-1 text-primary-500 text-small-semibold"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
