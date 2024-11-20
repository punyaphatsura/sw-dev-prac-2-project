import { render, screen, waitFor } from '@testing-library/react';
import { useAtom } from 'jotai';

import BookingManagementPage from '@/app/(navbar)/back-office/booking/page';
import ShopManagementPage from '@/app/(navbar)/back-office/shop/page';
import Home from '@/app/(navbar)/page';
import { Shop } from '@/common/interface/shop';
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

describe('BookingWaterfallPage', () => {
    const mockUser = { id: '123', name: 'Test User', role: 'user' };
    const mockShops = [
        {
            id: '1',
            name: 'Shop 1',
            address: 'Address 1',
            priceLevel: 1,
            province: 'Province 1',
            postalcode: '12345',
            tel: '1234567890',
            picture: 'Picture 1',
        },
        {
            id: '2',
            name: 'Shop 2',
            address: 'Address 2',
            priceLevel: 2,
            province: 'Province 2',
            postalcode: '23456',
            tel: '2345678901',
            picture: 'Picture 2',
        },
        {
            id: '3',
            name: 'Shop 3',
            address: 'Address 3',
            priceLevel: 3,
            province: 'Province 3',
            postalcode: '34567',
            tel: '3456789012',
            picture: 'Picture 3',
        },
    ];
    const mockUseAtomValue = useAtom as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAtomValue.mockReturnValue(mockUser);
    });

    it('fetches and displays shops correctly', async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: { data: mockShops },
        });

        render(<ShopManagementPage />);

        await waitFor(() => {
            expect(screen.getByText(/Shop 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Shop 2/i)).toBeInTheDocument();
            expect(screen.getByText(/Shop 3/i)).toBeInTheDocument();
        });

        expect(apiClient.get).toHaveBeenCalledWith('/shops');
    });

    it('displays the detail of each shop correctly', async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: { data: mockShops },
        });

        render(<ShopManagementPage />);

        await waitFor(() => {
            // address
            expect(screen.getByText(/Address 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Address 2/i)).toBeInTheDocument();
            expect(screen.getByText(/Address 3/i)).toBeInTheDocument();

            // province
            expect(screen.getByText(/Province 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Province 2/i)).toBeInTheDocument();
            expect(screen.getByText(/Province 3/i)).toBeInTheDocument();

            // tel
            expect(screen.getByText(/1234567890/i)).toBeInTheDocument();
            expect(screen.getByText(/2345678901/i)).toBeInTheDocument();
            expect(screen.getByText(/3456789012/i)).toBeInTheDocument();
        });

        expect(apiClient.get).toHaveBeenCalledWith('/shops');
    });
});
