import { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type BaseProps = {
  children: ReactNode;
};

// TODO: デフォルトがbuttonになるようにしたい
// TODO: as を削除したい
// TODO: to があるときはLinkになるようにしたい
type ButtonProps = BaseProps & {
  as: 'button';
} & ComponentProps<'button'>;

type LinkProps = BaseProps & {
  as: 'link';
} & ComponentProps<typeof Link>;

type Props = ButtonProps | LinkProps;

// TODO: className を共通化したい
export const Button = (props: Props) => {
  const { as, children } = props;

  if (as === 'button') {
    const { ...buttonProps } = props;
    return (
      <button className="py-2 px-4 border" {...buttonProps}>
        {children}
      </button>
    );
  } else if (as === 'link') {
    const { ...linkProps } = props;
    return (
      <Link className="py-2 px-4 border" {...linkProps}>
        {children}
      </Link>
    );
  }

  return null;
};
