export default function PredictionResult({ result }) {
  const { crop, confidence_percent } = result

  return (
    <section className="result-card" aria-labelledby="prediction-title">
      <h2 id="prediction-title" className="result-label">
        Predicted Crop
      </h2>
      <p className="result-crop">{crop}</p>
      <p className="result-confidence">
        {confidence_percent}%
        <span className="result-confidence-label">Confidence</span>
      </p>
      <p className="result-explanation">
        The model predicts this image as {crop} with {confidence_percent}%
        confidence.
      </p>
    </section>
  )
}
