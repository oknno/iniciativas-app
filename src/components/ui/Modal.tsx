import type { PropsWithChildren, ReactNode } from 'react'

type ModalProps = PropsWithChildren<{
  title: string
  open: boolean
  onClose: () => void
  footer?: ReactNode
  size?: 'wizard' | 'dialog'
}>

export function Modal({ title, open, onClose, children, footer, size = 'dialog' }: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="ui-overlay" onClick={onClose} role="presentation">
      <div
        className={`ui-modal ui-modal--${size}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="ui-modal__header">
          <h2>{title}</h2>
        </header>
        <div className="ui-modal__body">{children}</div>
        {footer ? <footer className="ui-modal__footer">{footer}</footer> : null}
      </div>
    </div>
  )
}
