import Link from 'next/link';

import { Button } from '@/components/ui/button';


export default async function Home() {

    return (
        <div>
            <Link href="/auth/login">Login</Link>

            <Button>Test</Button>
        </div>
    );
}
