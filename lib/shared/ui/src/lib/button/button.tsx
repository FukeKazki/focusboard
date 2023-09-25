import { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../helper";
type BaseProps = {
  children: ReactNode;
  className?: string;
};

// TODO: デフォルトがbuttonになるようにしたい
// TODO: as を削除したい
// TODO: to があるときはLinkになるようにしたい
type ButtonProps = BaseProps & {
  as: "button";
} & ComponentProps<"button">;

type LinkProps = BaseProps & {
  as: "link";
} & ComponentProps<typeof Link>;

type Props = ButtonProps | LinkProps;

// TODO: className を共通化したい
export const Button = (props: Props) => {
  const { as, children } = props;

  if (as === "button") {
    const { className, ...buttonProps } = props;
    return (
      <button className={cn("btn", className)} {...buttonProps}>
        {children}
      </button>
    );
  } else if (as === "link") {
    const { className, ...linkProps } = props;
    return (
      <Link className={cn("btn", className)} {...linkProps}>
        {children}
      </Link>
    );
  }

  return null;
};
