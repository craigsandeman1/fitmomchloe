<<<<<<< Updated upstream
import { Edit2, Trash2, Film, Eye } from 'lucide-react';
=======
import { Edit2, Trash2, Play } from 'lucide-react';
>>>>>>> Stashed changes
import { Video as VideoType } from '../../types/video';

interface VideosListProps {
  videos: VideoType[];
  onEdit: (video: VideoType) => void;
  onDelete: (id: string) => void;
}

const VideosList = ({ videos, onEdit, onDelete }: VideosListProps) => {
  // Default thumbnail image to use if none is provided
  const defaultThumbnail = 'https://via.placeholder.com/320x180?text=No+Thumbnail';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
<<<<<<< Updated upstream
          {/* Thumbnail */}
          <div className="relative aspect-video">
            <img 
              src={video.thumbnail_url || defaultThumbnail} 
              alt={`Thumbnail for ${video.title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, replace with default
                (e.target as HTMLImageElement).src = defaultThumbnail;
              }}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              {video.video_url && (
                <a 
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                  title="Preview video"
                >
                  <Eye size={18} />
                </a>
              )}
            </div>
            {video.is_premium && (
              <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                PREMIUM
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">{video.title}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(video)}
                  className="p-1.5 text-gray-600 hover:text-primary bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  title="Edit video"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(video.id)}
                  className="p-1.5 text-gray-600 hover:text-red-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  title="Delete video"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {video.category && (
                <div className="flex items-center">
                  <span className="font-medium">Category:</span>
                  <span className="ml-1 text-gray-600">{video.category.name}</span>
                </div>
              )}
              {video.difficulty_level && (
                <div className="flex items-center">
                  <span className="font-medium">Level:</span>
                  <span className="ml-1 text-gray-600">{video.difficulty_level}</span>
                </div>
              )}
              {video.duration && (
                <div className="flex items-center">
                  <span className="font-medium">Duration:</span>
                  <span className="ml-1 text-gray-600">{video.duration}</span>
                </div>
              )}
              {video.individual_price && (
                <div className="flex items-center">
                  <span className="font-medium">Price:</span>
                  <span className="ml-1 text-gray-600">R{video.individual_price.toFixed(2)}</span>
                </div>
              )}
=======
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail */}
            <div className="md:w-40 lg:w-48 h-auto relative overflow-hidden">
              <div className="aspect-video bg-gray-200">
                {video.thumbnail_url ? (
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x180?text=No+Preview';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Play size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                    {video.category && (
                      <p>Category: <span className="font-medium">{video.category.name}</span></p>
                    )}
                    {video.difficulty_level && (
                      <p>Level: <span className="font-medium">{video.difficulty_level}</span></p>
                    )}
                    {video.duration && (
                      <p>Duration: <span className="font-medium">{video.duration}</span></p>
                    )}
                    {video.individual_price && (
                      <p>Price: <span className="font-medium">R{video.individual_price.toFixed(2)}</span></p>
                    )}
                    <p>
                      Status: <span className={`font-medium ${video.is_premium ? 'text-amber-600' : 'text-green-600'}`}>{video.is_premium ? 'Premium' : 'Standard'}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEdit(video)}
                    className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100"
                    title="Edit video"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(video.id)}
                    className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-gray-100"
                    title="Delete video"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
>>>>>>> Stashed changes
            </div>
          </div>
        </div>
      ))}

      {videos.length === 0 && (
<<<<<<< Updated upstream
        <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
          <Film className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500 text-lg">No videos found</p>
          <p className="text-gray-400 text-sm mt-2">Videos you upload will appear here</p>
        </div>
=======
        <p className="text-center text-gray-500 py-8">No videos found</p>
>>>>>>> Stashed changes
      )}
    </div>
  );
};

export default VideosList;