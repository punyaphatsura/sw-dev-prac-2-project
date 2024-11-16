import Link from 'next/link';

import Typography from '@/common/components/base/Typography';

import RegisterAuthForm from './_components/RegisterAuthForm';

const AuthPage = () => {
    return (
        <div className="absolute left-1/2 top-1/2 flex h-fit max-h-[90vh] w-fit min-w-[350px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-6 rounded-md">
            <p className="text-center text-2xl font-bold">
                Welcome to Massage shop
            </p>
            <p className="text-center text-sm">
                Create account to book your massage
            </p>
            <div className="rounded-md border-[1px] p-[24px]">
                <RegisterAuthForm />
            </div>
            <Typography variant="body2" className="text-center">
                {'Already have an account? '}
                <Link
                    href="/auth"
                    className="font-semibold text-blue-500 hover:underline"
                >
                    Login
                </Link>
            </Typography>
        </div>
    );
};

export default AuthPage;
