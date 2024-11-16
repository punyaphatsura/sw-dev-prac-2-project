import Link from 'next/link';

import Typography from '@/common/components/base/Typography';

import AuthForm from './_components/AuthForm';

const AuthPage = () => {
    return (
        <div className="absolute left-1/2 top-1/2 flex h-fit max-h-[90vh] w-fit min-w-[350px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-6 rounded-md">
            <div className="rounded-md border-[1px] p-[24px]">
                <AuthForm />
            </div>
            <Typography variant="body2" className="text-center">
                {"Don't have an account? "}
                <Link
                    href="/register"
                    className="font-semibold text-blue-500 hover:underline"
                >
                    Register
                </Link>
            </Typography>
        </div>
    );
};

export default AuthPage;
