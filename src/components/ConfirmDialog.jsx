export default function ConfirmDialog({ onCancel, onConfirm }) {
  return (
    <section className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <p>Удалить все задачи?</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Отмена
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </section>
  );
}
