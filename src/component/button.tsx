import { FC } from 'react';

export enum ButtonVariant {
  Default = 'Default',
  Large = 'Large',
}

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: ButtonVariant;
};

export const Button: FC<Props> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  variant = ButtonVariant.Default,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`sm:inline-flex items-center sm:w-max border border-transparent font-medium text-center rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
      variant === ButtonVariant.Large ? 'text-base sm:text-xs px-4 py-3' : 'text-xs px-4 py-3 sm:py-2.5'
    } ${disabled ? 'bg-gray-300 pointer-events-none text-gray-500' : 'bg-blue-400 hover:bg-blue-500'} ${className}`}
  >
    {children}
  </button>
);
