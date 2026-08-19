const CROPS = ['Maize', 'Paddy', 'Sugarcane', 'Sunflower', 'Wheat']

export default function About() {
  return (
    <section className="about-card" aria-labelledby="about-title">
      <h2 id="about-title">About CropCNN</h2>
      <p>
        CropCNN uses a MobileNetV2 transfer-learning model to classify crop
        images into five categories:
      </p>
      <ul className="crop-list" aria-label="Supported crop classes">
        {CROPS.map((crop) => (
          <li key={crop} className="crop-chip">
            {crop}
          </li>
        ))}
      </ul>
      <p className="about-note">
        The model achieved <strong>98.33% test accuracy</strong> on the
        evaluation set. Results are not guaranteed for every real-world image.
      </p>
    </section>
  )
}
