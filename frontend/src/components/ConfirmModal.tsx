interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  confirmClass?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function ConfirmModal({ title, message, confirmLabel = 'Confirmar', confirmClass = 'btn-danger', onClose, onConfirm, loading }: Props) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className={`btn ${confirmClass}`} onClick={onConfirm} disabled={loading}>
            {loading ? <><span className="spinner" style={{width:16,height:16,borderWidth:2}}></span> Aguarde...</> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
