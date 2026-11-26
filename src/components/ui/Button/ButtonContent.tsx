import NewTabHint from '@/components/ui/NewTabHint';

type ButtonContentProps = {
  label: string;
  svg?: React.ReactNode;
  newTab?: boolean;
};

const ButtonContent = ({ label, svg, newTab = false }: ButtonContentProps) => (
  <span className='w-full flex items-center justify-center gap-2 relative z-10'>
    <span>
      {label}
      {newTab && <NewTabHint />}
    </span>
    <span className='transition-transform duration-200 group-hover:translate-x-1 group-hover:rotate-6'>
      {svg}
    </span>
  </span>
);

export default ButtonContent;
