import { fileUrl } from '../utils/fileUrl'

// Row of photo thumbnails. Clicking one opens the full-size photo in a new tab.
export default function ImageThumbs({ images = [], size = 80 }) {
  if (!images.length) return null

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {images.map((p, i) => (
        <a
          key={p}
          href={fileUrl(p)}
          target="_blank"
          rel="noreferrer"
          title="Open full size"
          style={{ display: 'block', lineHeight: 0 }}
        >
          <img
            src={fileUrl(p)}
            alt={`Photo ${i + 1}`}
            loading="lazy"
            style={{
              width: `${size}px`, height: `${size}px`, objectFit: 'cover',
              borderRadius: '10px', border: '1px solid #e2e8f0', display: 'block',
            }}
          />
        </a>
      ))}
    </div>
  )
}