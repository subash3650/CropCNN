export default function ImagePreview({ src, filename, onRemove, disabled }) {
  return (
    <figure className="preview">
      <div className="preview-frame">
        <img src={src} alt={`Preview of ${filename}`} className="preview-image" />
      </div>
      <figcaption className="preview-meta">
        <span className="preview-filename" title={filename}>
          {filename}
        </span>
        <button
          type="button"
          className="preview-remove"
          onClick={onRemove}
          disabled={disabled}
        >
          Remove image
        </button>
      </figcaption>
    </figure>
  )
}
