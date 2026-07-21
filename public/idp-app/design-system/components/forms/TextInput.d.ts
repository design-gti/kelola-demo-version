import * as React from 'react';

/**
 * Labelled text field. Label is Avenir 12/700; value is Open Sans 12/400 on white.
 * @startingPoint section="Forms" subtitle="Text field with label, sections, password reveal & error" viewport="700x320"
 */
export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /** @default "text" */
  type?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  /** Show an eye toggle (implied when type="password"). */
  passwordToggle?: boolean;
}

export function TextInput(props: TextInputProps): React.JSX.Element;
