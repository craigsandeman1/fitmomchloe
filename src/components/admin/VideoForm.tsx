import { Video as VideoType, VideoCategory } from '../../types/video';

interface VideoFormProps {
  editingVideo: VideoType | null;
  videoCategories: VideoCategory[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
}

const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

const VideoForm = ({ editingVideo, videoCategories, onSubmit, onCancel }: VideoFormProps) => {
  return (
    <div className="mb-8 p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">
        {editingVideo?.id ? 'Edit' : 'Create'} Video
      </h3>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              defaultValue={editingVideo?.title}
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
              defaultValue={editingVideo?.category_id || ''}
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
            defaultValue={editingVideo?.description}
            className="w-full p-2 border rounded-md"
            rows={3}
            required
          />
        </div>

        {/* Video Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL *
            </label>
            <input
              type="url"
              name="video_url"
              defaultValue={editingVideo?.video_url}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnail_url"
              defaultValue={editingVideo?.thumbnail_url || ''}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (e.g., "30 mins")
            </label>
            <input
              type="text"
              name="duration"
              defaultValue={editingVideo?.duration || ''}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              name="difficulty_level"
              defaultValue={editingVideo?.difficulty_level || ''}
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
              defaultValue={editingVideo?.individual_price || ''}
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
              value="true"
              defaultChecked={editingVideo?.is_premium}
              className="mr-2"
            />
            Premium Content
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;