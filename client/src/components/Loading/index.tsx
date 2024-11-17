import { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import Spinner from '../Spinner';

const styles = tv({
  base: ''
});

interface LoadingProps extends ComponentProps<'div'>, VariantProps<typeof styles> {}

export default function Loading({ className, ...rest }: LoadingProps) {
  return (
    <div
      className={styles({
        className:
          'fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-secondary-900/90'
      })}
      {...rest}
    >
      <Spinner />
    </div>
  );
}
