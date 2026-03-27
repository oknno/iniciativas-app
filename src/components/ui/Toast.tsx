export type ToastTone = 'success' | 'error' | 'info'

export type ToastItem = {
  id: number
  tone: ToastTone
  message: string
}

type ToastStackProps = {
  items: ToastItem[]
}

export function ToastStack({ items }: ToastStackProps) {
  return (
    <div className="ui-toast-stack" aria-live="polite" aria-atomic="true">
      {items.map((item) => (
        <div key={item.id} className={`ui-toast ui-toast--${item.tone}`} role="status">
          {item.message}
        </div>
      ))}
    </div>
  )
}
