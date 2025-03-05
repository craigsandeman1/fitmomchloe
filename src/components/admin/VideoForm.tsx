<<<<<<< Updated upstream
import { useState, useRef } from 'react';
import { Video as VideoType, VideoCategory } from '../../types/video';
import { Upload, X, Play, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useFileUpload from '../../hooks/useFileUpload';
=======
import { useState, useEffect } from 'react';
import { Video as VideoType, VideoCategory } from '../../types/video';
import { Play, Upload, Info, HelpCircle } from 'lucide-react';
>>>>>>> Stashed changes

interface VideoFormProps {
  editingVideo: VideoType | null;
  videoCategories: VideoCategory[];
  onSubmit: (video: VideoType) => Promise<void>;
  onCancel: () => void;
}

const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

const VideoForm = ({ editingVideo, videoCategories, onSubmit, onCancel }: VideoFormProps) => {
<<<<<<< Updated upstream
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  // Use our custom upload hook
  const { 
    uploadFile, 
    progress: uploadProgress, 
    uploading, 
    error: uploadError 
  } = useFileUpload();
  
  const [formData, setFormData] = useState<Partial<VideoType>>(editingVideo || {
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: null,
    is_premium: false,
    duration: '',
    difficulty_level: '',
    individual_price: null,
    category_id: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'thumbnail') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'video') {
        setSelectedVideo(e.target.files[0]);
      } else {
        setSelectedThumbnail(e.target.files[0]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'individual_price') {
      setFormData({
        ...formData,
        [name]: value ? parseFloat(value) : null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const uploadToSupabase = async (): Promise<{videoUrl: string, thumbnailUrl: string | null}> => {
    let videoUrl = formData.video_url || '';
    let thumbnailUrl = formData.thumbnail_url || null;
    
    try {
      // If we have a new video file, upload it
      if (selectedVideo) {
        // Generate a unique file name
        const fileExt = selectedVideo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `videos/${fileName}`;
        
        // Upload using our custom hook
        const result = await uploadFile('videos', filePath, selectedVideo);
        
        if (result.error) {
          throw new Error(`Error uploading video: ${result.error}`);
        }
        
        videoUrl = result.url || '';
      }
      
      // If we have a new thumbnail file, upload it
      if (selectedThumbnail) {
        // Generate a unique file name
        const fileExt = selectedThumbnail.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;
        
        // Upload using our hook
        const result = await uploadFile('videos', filePath, selectedThumbnail);
        
        if (result.error) {
          throw new Error(`Error uploading thumbnail: ${result.error}`);
        }
        
        thumbnailUrl = result.url;
      }
      
      return { videoUrl, thumbnailUrl };
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      return { videoUrl, thumbnailUrl };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Upload files if selected
      const { videoUrl, thumbnailUrl } = await uploadToSupabase();
      
      // Prepare the video data with uploaded URLs
      const videoData: VideoType = {
        ...formData as VideoType,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      };
      
      // Submit the form data
      await onSubmit(videoData);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

=======
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState(editingVideo?.video_url || '');
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState(editingVideo?.thumbnail_url || '');
  const [videoError, setVideoError] = useState('');
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  // Update thumbnail preview when the thumbnail URL changes
  useEffect(() => {
    setThumbnailPreview(thumbnailUrlInput || null);
  }, [thumbnailUrlInput]);

  // Extract video ID from various video platforms
  const extractVideoId = (url: string): string | null => {
    try {
      // Check if it's already a direct file URL ending with a video extension
      if (/\.(mp4|mov|avi|webm)$/i.test(url)) {
        return url;
      }
      
      // YouTube
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const youtubeMatch = url.match(youtubeRegex);
      if (youtubeMatch?.[1]) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }
      
      // Vimeo
      const vimeoRegex = /vimeo\.com\/(?:.*\/)?(?:videos\/)?([0-9]+)/i;
      const vimeoMatch = url.match(vimeoRegex);
      if (vimeoMatch?.[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
      
      // If it's a direct URL, return it as is
      return url;
    } catch (error) {
      console.error("Error extracting video ID:", error);
      return null;
    }
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setVideoUrlInput(newUrl);
    setVideoError('');
    
    // If there's no thumbnail URL yet, try to generate one from the video URL
    if (newUrl && !thumbnailUrlInput) {
      try {
        // For YouTube videos, we can generate a thumbnail URL
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const youtubeMatch = newUrl.match(youtubeRegex);
        if (youtubeMatch?.[1]) {
          const thumbnailUrl = `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
          setThumbnailUrlInput(thumbnailUrl);
        }
      } catch (error) {
        console.error("Error generating thumbnail URL:", error);
      }
    }
  };

  const getVideoPreviewUrl = (): string | null => {
    return extractVideoId(videoUrlInput);
  };

>>>>>>> Stashed changes
  return (
    <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
        {editingVideo?.id ? 'Edit' : 'Create'} Video
      </h3>
      
<<<<<<< Updated upstream
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
=======
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Section: Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h4 className="font-medium text-gray-700 mb-4 flex items-center">
            <Info className="mr-2 text-primary h-5 w-5" />
            Basic Information
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                defaultValue={editingVideo?.title}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                placeholder="Enter video title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category_id"
                defaultValue={editingVideo?.category_id || ''}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Select Category</option>
                {videoCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
>>>>>>> Stashed changes
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
<<<<<<< Updated upstream
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category_id"
              value={formData.category_id || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Category</option>
              {videoCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            rows={3}
            required
          />
        </div>

        {/* Video Upload */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Video File</h4>
          
          {!selectedVideo && formData.video_url && (
            <div className="mb-3 p-2 border rounded flex justify-between items-center">
              <div className="flex items-center">
                <Play size={16} className="mr-2 text-primary" />
                <span>Current video: {editingVideo?.title}</span>
              </div>
            </div>
          )}
          
          <div className="mb-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e, 'video')}
              accept="video/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload size={16} className="mr-2" />
              {selectedVideo ? 'Change Video' : formData.video_url ? 'Replace Video' : 'Upload Video'}
            </button>
          </div>
          
          {selectedVideo && (
            <div className="mb-3 p-2 border rounded flex justify-between items-center">
              <div className="truncate max-w-xs">
                <span className="font-medium">{selectedVideo.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  ({Math.round(selectedVideo.size / 1024 / 1024 * 10) / 10} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-sm text-gray-600 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
            </div>
          )}
          
          {!selectedVideo && !formData.video_url && (
            <p className="text-sm text-gray-500 my-2">
              Upload your video file here. Max size: 100MB. Supported formats: MP4, WebM, MOV.
            </p>
          )}
        </div>
        
        {/* Thumbnail Upload */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Thumbnail Image (Optional)</h4>
          
          {!selectedThumbnail && formData.thumbnail_url && (
            <div className="mb-3">
              <img 
                src={formData.thumbnail_url} 
                alt="Current thumbnail" 
                className="h-20 object-cover rounded"
              />
            </div>
          )}
          
          <div className="mb-3">
            <input
              type="file"
              ref={thumbnailInputRef}
              onChange={(e) => handleFileChange(e, 'thumbnail')}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload size={16} className="mr-2" />
              {selectedThumbnail ? 'Change Thumbnail' : formData.thumbnail_url ? 'Replace Thumbnail' : 'Upload Thumbnail'}
            </button>
=======
            <textarea
              name="description"
              defaultValue={editingVideo?.description}
              className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
              rows={3}
              placeholder="Describe what this video is about..."
              required
            />
          </div>
        </div>

        {/* Section: Video Content */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h4 className="font-medium text-gray-700 mb-4 flex items-center">
            <Play className="mr-2 text-primary h-5 w-5" />
            Video Content
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Link *
              </label>
              <div className="flex">
                <input
                  type="url"
                  name="video_url"
                  value={videoUrlInput}
                  onChange={handleVideoUrlChange}
                  className="w-full p-2 border rounded-l-md focus:ring-primary focus:border-primary"
                  placeholder="Paste YouTube or video link here"
                  required
                />
                <button 
                  type="button" 
                  className="bg-gray-100 px-3 border-t border-r border-b rounded-r-md"
                  onClick={() => setShowHelpTooltip(!showHelpTooltip)}
                >
                  <HelpCircle size={16} className="text-gray-500" />
                </button>
              </div>
              
              {showHelpTooltip && (
                <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-xs mt-2 mb-2">
                  <p className="font-semibold mb-1">Supported video formats:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>YouTube videos</li>
                    <li>Vimeo videos</li>
                    <li>Direct video links</li>
                  </ul>
                </div>
              )}
              
              {videoError && <p className="text-red-500 text-xs mt-1">{videoError}</p>}
              
              {videoUrlInput && getVideoPreviewUrl() && (
                <div className="mt-3 border rounded-md overflow-hidden aspect-video bg-black">
                  <iframe 
                    src={getVideoPreviewUrl() || ''}
                    className="w-full h-full"
                    allowFullScreen
                    title="Video preview"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail
              </label>
              <input
                type="url"
                name="thumbnail_url"
                value={thumbnailUrlInput}
                onChange={(e) => setThumbnailUrlInput(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                placeholder="Paste thumbnail image link here"
              />
              
              {thumbnailPreview && (
                <div className="mt-3 border rounded-md overflow-hidden aspect-video">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-full h-full object-cover"
                    onError={() => setThumbnailPreview(null)} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section: Additional Details */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h4 className="font-medium text-gray-700 mb-4">
            Additional Details
          </h4>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                defaultValue={editingVideo?.duration || ''}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                placeholder="e.g. 00:30:00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                name="difficulty_level"
                defaultValue={editingVideo?.difficulty_level || ''}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Select Level</option>
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (R)
              </label>
              <input
                type="number"
                name="individual_price"
                defaultValue={editingVideo?.individual_price || ''}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_premium"
                defaultChecked={editingVideo?.is_premium}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Premium Content
              </span>
            </label>
>>>>>>> Stashed changes
          </div>
          
          {selectedThumbnail && (
            <div className="mb-3 p-2 border rounded flex justify-between items-center">
              <div className="truncate max-w-xs">
                <span className="font-medium">{selectedThumbnail.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  ({Math.round(selectedThumbnail.size / 1024) } KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedThumbnail(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {selectedThumbnail && (
            <div className="mb-3">
              <img 
                src={URL.createObjectURL(selectedThumbnail)} 
                alt="Thumbnail preview" 
                className="h-20 object-cover rounded"
              />
            </div>
          )}
        </div>
<<<<<<< Updated upstream

        {/* Additional Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (e.g., "30 mins")
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              name="difficulty_level"
              value={formData.difficulty_level || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Level</option>
              {DIFFICULTY_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Individual Price (ZAR)
            </label>
            <input
              type="number"
              name="individual_price"
              value={formData.individual_price || ''}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Premium Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_premium"
              checked={formData.is_premium || false}
              onChange={(e) => setFormData({...formData, is_premium: e.target.checked})}
              className="mr-2"
            />
            Premium Content
          </label>
        </div>

=======
        
>>>>>>> Stashed changes
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
<<<<<<< Updated upstream
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            disabled={uploading}
=======
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
>>>>>>> Stashed changes
          >
            Cancel
          </button>
          <button
            type="submit"
<<<<<<< Updated upstream
            className="btn-primary flex items-center"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader className="animate-spin mr-2" size={16} />
                Uploading...
              </>
            ) : (
              'Save'
            )}
=======
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            {editingVideo?.id ? 'Update' : 'Create'} Video
>>>>>>> Stashed changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;