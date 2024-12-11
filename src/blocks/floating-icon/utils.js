import { clsx } from "clsx"
import classNames from 'classnames';

export function cn(...inputs) {
  return classNames(clsx(inputs))
}
