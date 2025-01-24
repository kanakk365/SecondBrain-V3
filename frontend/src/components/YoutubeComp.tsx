
export function YouTubeComp({ url }: { url: string }) {
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(url);


  if (!videoId) {
    return (
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
        <p className="text-red-500">Invalid YouTube URL</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="z-0 aspect-w-16 aspect-h-9">
      <iframe
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
}