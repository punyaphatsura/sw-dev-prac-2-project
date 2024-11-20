import { useRouter } from 'next/navigation';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAtom } from 'jotai';

import RootLayout from '@/app/(navbar)/layout';
import { apiClient } from '@/libs/axiosConfig';

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'),
    useAtom: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../src/libs/axiosConfig.ts', () => ({
    apiClient: {
        get: jest.fn(),
    },
}));

describe('RootLayout Component', () => {
    const mockPush = jest.fn();
    const mockSetUser = jest.fn();
    const mockUseAtom = useAtom as jest.Mock;
    const mockUseRouter = useRouter as jest.Mock;

    beforeEach(() => {
        mockUseRouter.mockReturnValue({ push: mockPush });
        mockUseAtom.mockReturnValue([null, mockSetUser]); // Default no user
        jest.clearAllMocks();
    });

    it('renders the navbar and navigation links', () => {
        render(<RootLayout>Test Content</RootLayout>);

        // Check static links
        expect(screen.getByText(/Massage Shop/i)).toBeInTheDocument();
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/Booking/i)).toBeInTheDocument();
    });

    it('fetches and sets user data on mount', async () => {
        const mockUser = {
            data: {
                data: {
                    _id: '123',
                    name: 'Test User',
                    email: 'test@example.com',
                    tel: '1234567890',
                    role: 'user',
                },
            },
        };

        (apiClient.get as jest.Mock).mockResolvedValueOnce(mockUser);

        render(<RootLayout>Test Content</RootLayout>);

        await waitFor(() => {
            expect(mockSetUser).toHaveBeenCalledWith({
                id: '123',
                name: 'Test User',
                email: 'test@example.com',
                tel: '1234567890',
                role: 'user',
            });
        });
    });

    it('redirects to /auth if user fetch fails', async () => {
        (apiClient.get as jest.Mock).mockRejectedValueOnce(
            new Error('Fetch error')
        );

        render(<RootLayout>Test Content</RootLayout>);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/auth');
        });
    });

    it('displays user info when logged in', () => {
        const mockUser = { id: '123', name: 'Test User', role: 'user' };
        mockUseAtom.mockReturnValue([mockUser, mockSetUser]);

        render(<RootLayout>Test Content</RootLayout>);

        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    });

    it('calls logout handler and redirects to /auth on logout via dialog', async () => {
        const mockUser = { id: '123', name: 'Test User', role: 'user' };
        mockUseAtom.mockReturnValue([mockUser, mockSetUser]);

        render(<RootLayout>Test Content</RootLayout>);

        const userButton = screen.getByText(/Test User/i);
        userEvent.click(userButton);

        const logoutButton = await screen.findByText(/Logout/i);
        expect(await screen.findByText(/user/)).toBeInTheDocument();
        expect(logoutButton).toBeInTheDocument();

        userEvent.click(logoutButton);

        await waitFor(() => {
            expect(mockSetUser).toHaveBeenCalledWith(null);
            expect(mockPush).toHaveBeenCalledWith('/auth');
        });
    });

    it('renders admin-specific navigation links when user is an admin', () => {
        const mockAdminUser = { id: '123', name: 'Admin User', role: 'admin' };
        mockUseAtom.mockReturnValue([mockAdminUser, mockSetUser]);

        render(<RootLayout>Test Content</RootLayout>);

        expect(screen.getByText(/Shop Management/i)).toBeInTheDocument();
        expect(screen.getByText(/Booking Management/i)).toBeInTheDocument();

        expect(screen.getByText(/Admin User/i)).toBeInTheDocument();
    });
});
