import type { ButtonHTMLAttributes } from 'react'

// Adapted from Samuel Breznjak's Neobrutalism Button (MIT); see LICENSE-neobrutalism.txt.
type NeoButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'neutral' | 'noShadow' | 'reverse'
}

export function NeoButton({ className = '', variant = 'default', type = 'button', ...props }: NeoButtonProps) {
  return <button type={type} data-slot="button" className={`neo-button neo-button--${variant} ${className}`} {...props} />
}
