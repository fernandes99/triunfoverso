import { ComponentProps, ReactNode } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

const styles = tv({
  base: 'flex items-center justify-center gap-2 rounded-md px-5 py-3 font-medium transition-all',
  variants: {
    variant: {
      primary: 'bg-primary-500 text-white shadow-primary-500/40 hover:bg-primary-500-hover',
      secondary: '',
      ghost: 'bg-transparent text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
});

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof styles> {
  children: ReactNode;
}

export default function Button({ children, className, variant, ...rest }: ButtonProps) {
  return (
    <button className={styles({ variant, className })} {...rest}>
      {children}
    </button>
  );
}
