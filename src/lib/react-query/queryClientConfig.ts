import { toast } from '@/components/ui/use-toast';
import { QueryClient } from '@tanstack/react-query';

const STALE_TIME = 1000 * 60 * 5;

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME,
    },
    mutations: {
      onError: (error: Error) => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error.message,
        });
      },
    },
  },
};
export const getQueryClient = new QueryClient(queryClientConfig);
