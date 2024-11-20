import { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

export type TSelectOption = {
  id: string | number;
  label: string;
  value: string;
};

const styles = tv({
  base: 'flex flex-col gap-1'
});

interface SelectProps
  extends Omit<ComponentProps<'select'>, 'onChange' | 'value'>,
    VariantProps<typeof styles> {
  options: TSelectOption[];
  value: TSelectOption;
  label?: string;
  placeholder?: string;
  onChange: (optionSelected: TSelectOption) => void;
}

export default function Select({
  options,
  value,
  label,
  placeholder = 'Selecione uma opção',
  onChange,
  className,
  ...rest
}: SelectProps) {
  return (
    <div className={styles({ className })}>
      {label && (
        <label className='z-0 -mb-3 ml-1 w-fit bg-white px-1 text-xs font-medium text-neutral-400'>
          {label}
        </label>
      )}
      <select
        title={label}
        className='block w-full rounded-lg border p-1 text-sm text-neutral-700'
        value={value.id}
        onChange={(e) => {
          const selectedOption = options.find((option) => option.value === e.target.value);
          if (selectedOption) onChange(selectedOption);
        }}
        {...rest}
      >
        {placeholder && (
          <option value='' disabled hidden>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
