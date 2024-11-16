import { forwardRef } from 'react';

import { Overlay as SheetOverlayBase } from '@radix-ui/react-dialog';

import { cn } from '@/libs/utils';

const SheetOverlay = forwardRef<
    React.ElementRef<typeof SheetOverlayBase>,
    React.ComponentPropsWithoutRef<typeof SheetOverlayBase>
>(({ className, ...props }, ref) => (
    <SheetOverlayBase
        className={cn(
            'bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm',
            className
        )}
        {...props}
        ref={ref}
    />
));

SheetOverlay.displayName = SheetOverlayBase.displayName;

export default SheetOverlay;
