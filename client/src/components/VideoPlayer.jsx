export default function VideoPlayer({ videoId }) {
  if (!videoId) return <p>No video selected</p>;

  return (
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${videoId}`}
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  );
}
