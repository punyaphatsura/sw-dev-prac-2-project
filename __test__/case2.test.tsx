import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAtom } from 'jotai';

import BookingManagementPage from '@/app/(navbar)/back-office/booking/page';
import { apiClient } from '@/libs/axiosConfig';

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'),
    useAtom: jest.fn(),
}));

jest.mock('../src/libs/axiosConfig.ts', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('BookingManagementPage', () => {
    const mockUser = { id: '123', name: 'Test User', role: 'user' };
    const mockBookings = [
        {
            _id: '1',
            bookingDate: new Date().toISOString(),
            serviceMinute: 60,
            shop: { id: 'shop1' },
            user: '123',
        },
    ];
    const mockUseAtomValue = useAtom as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAtomValue.mockReturnValue(mockUser);
    });

    it('fetches and displays bookings on mount', async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: { data: mockBookings },
        });

        render(<BookingManagementPage />);

        await waitFor(() => {
            expect(screen.getByText(/Booking on/i)).toBeInTheDocument();
        });

        expect(apiClient.get).toHaveBeenCalledWith('/bookings');
    });

    it('displays an error message if fetching bookings fails', async () => {
        (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Error'));

        render(<BookingManagementPage />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Failed to load bookings. Please try again later./i
                )
            ).toBeInTheDocument();
        });
    });
});
