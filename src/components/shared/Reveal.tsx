import clsx from 'clsx';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  as?: 'div' | 'section' | 'header' | 'p' | 'li' | 'span';
};

/**
 * Fades/slides content in the first time it enters the viewport. Server
 * component on purpose: a client boundary here serialises every wrapped subtree
 * a second time into the flight payload (~197 KB of the home page's 388 KB).
 * `noscript` in the root layout un-hides `.reveal`, since JS adds `is-visible`.
 */
const Reveal = ({ children, className, id, delay = 0, as: Component = 'div' }: RevealProps) => {
  return (
    <Component
      id={id}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={clsx('reveal', className)}
    >
      {children}
    </Component>
  );
};

export default Reveal;
