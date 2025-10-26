import { useState } from "react";
import { Play, X } from "lucide-react";
import demoVideo from "./video.mp4"; // adjust path as needed


export default function VideoPlayer(): JSX.Element {
  const [showVideo, setShowVideo] = useState<boolean>(false);

  return (
    <div>
      {!showVideo ? (
        <button
          onClick={() => setShowVideo(true)}
          className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <div className="bg-white p-3 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
            <Play className="h-6 w-6" />
          </div>
          <span className="font-medium">Watch How It Works</span>
        </button>
      ) : (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl px-4">
            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0 bg-white p-2 rounded-full shadow"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Video */}
            <video
              controls
              autoPlay
              className="w-full rounded-lg shadow-lg"
  src={demoVideo}
            />
          </div>
        </div>
      )}
    </div>
  );
}