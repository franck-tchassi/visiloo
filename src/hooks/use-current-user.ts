import { useQuery } from '@tanstack/react-query';

interface CurrentUserData {
    id: string;
    email: string;
    currentOrganizationId?: string;
}

export const useCurrentUser = () => {
    const { data, isLoading, error } = useQuery<CurrentUserData, Error>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await fetch('/api/users/current');
            if (!response.ok) {
                throw new Error('Failed to fetch current user');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // Les données sont considérées comme "fraîches" pendant 5 minutes
        gcTime: 10 * 60 * 1000, // Les données restent dans le cache pendant 10 minutes (anciennement cacheTime)
    });

    return {
        currentUser: data,
        isLoading,
        error,
    };
};
