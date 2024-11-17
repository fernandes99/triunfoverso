import { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

const styles = tv({
  base: 'text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white'
});

interface SpinnerProps extends ComponentProps<'div'>, VariantProps<typeof styles> {}

export default function Spinner({ className, ...rest }: SpinnerProps) {
  return <div className={styles({ className })} {...rest} />;
}
