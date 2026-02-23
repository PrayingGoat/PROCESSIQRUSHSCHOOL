import React from 'react';

type AnyProps = Record<string, any>;

const omitMotionProps = (props: AnyProps): AnyProps => {
  const {
    initial,
    animate,
    exit,
    transition,
    whileHover,
    whileTap,
    whileInView,
    viewport,
    layout,
    layoutId,
    variants,
    ...rest
  } = props;
  return rest;
};

const motion = new Proxy(
  {},
  {
    get: (_target, tagName: string) => {
      return React.forwardRef<HTMLElement, AnyProps>((props, ref) =>
        React.createElement(tagName, { ref, ...omitMotionProps(props) })
      );
    }
  }
) as Record<string, React.ComponentType<AnyProps>>;

const AnimatePresence: React.FC<React.PropsWithChildren<AnyProps>> = ({ children }) => <>{children}</>;

export { motion, AnimatePresence };
