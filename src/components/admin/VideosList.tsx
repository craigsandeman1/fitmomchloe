import { Edit2, Trash2 } from 'lucide-react';
import { Video as VideoType } from '../../types/video';

interface VideosListProps {
  videos: VideoType[];
  onEdit: (video: VideoType) => void;
  onDelete: (id: string) => void;
}

const VideosList = ({ videos, onEdit, onDelete }: VideosListProps) => {
  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div key={video.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
              <p className="text-gray-600 mb-2">{video.description}</p>
              <div className="space-y-2">
                {video.category && (
                  <p className="text-sm text-gray-600">Category: {video.category.name}</p>
                )}
                {video.difficulty_level && (
                  <p className="text-sm text-gray-600">Level: {video.difficulty_level}</p>
                )}
                {video.duration && (
                  <p className="text-sm text-gray-600">Duration: {video.duration}</p>
                )}
                {video.individual_price && (
                  <p className="text-sm text-gray-600">Price: R{video.individual_price.toFixed(2)}</p>
                )}
                <p className="text-sm text-gray-600">
                  Status: {video.is_premium ? 'Premium' : 'Standard'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(video)}
                className="p-2 text-gray-600 hover:text-primary"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(video.id)}
                className="p-2 text-gray-600 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {videos.length === 0 && (
        <p className="text-center text-gray-500">No videos found</p>
      )}
    </div>
  );
};

export default VideosList;