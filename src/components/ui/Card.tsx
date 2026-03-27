import type { HTMLAttributes, PropsWithChildren } from 'react'

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <section className={`ui-card ${className}`.trim()} {...props}>
      {children}
    </section>
  )
}
