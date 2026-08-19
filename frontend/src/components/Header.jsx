export default function Header() {
  return (
    <header className="app-header">
      <h1 className="app-brand">
        <svg
          className="brand-icon"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M12 21v-8a5 5 0 0 1 5-5h1.5A1.5 1.5 0 0 1 20 9.5V12a9 9 0 0 1-8 9Z"
          />
          <path
            fill="currentColor"
            d="M12 21v-8a5 5 0 0 0-5-5H5.5A1.5 1.5 0 0 0 4 9.5V12a9 9 0 0 0 8 9Z"
          />
          <path
            fill="currentColor"
            d="M12 3c2 2 3 4.5 3 7h-6c0-2.5 1-5 3-7Z"
          />
        </svg>
        CropCNN
      </h1>
      <p className="app-tagline">AI Crop Classification</p>
    </header>
  )
}
