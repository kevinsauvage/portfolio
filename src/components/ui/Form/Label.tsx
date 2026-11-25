import RequiredIndicator from './RequiredIndicator';

import clsx from 'clsx';

type Properties = {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
};

const Label = ({ children, className, required, ...rest }: Properties) => (
  <label className={clsx('flex text-sm font-medium text-zinc-200', className)} {...rest}>
    {required ? (
      <span className='relative w-fit'>
        {children}
        <RequiredIndicator />
      </span>
    ) : (
      children
    )}
  </label>
);

export default Label;
