# Video Compression Instructions

Follow these steps to compress the videos for better performance:

## Required Videos

You need to compress two videos:
1. `src/assets/videos/working-out.mp4` (currently 59MB)
2. `src/assets/videos/Meal-Plan.mp4` (currently 21MB)

## Compression Options

### Option 1: Using HandBrake (Recommended)

1. Download [HandBrake](https://handbrake.fr/) (free and open source)
2. Open the source video
3. Select a preset:
   - For `working-out.mp4`: Use "Fast 720p30" or "Web Optimized"
   - For `Meal-Plan.mp4`: Use "Fast 720p30" or "Web Optimized"
4. In the "Video" tab:
   - Set Constant Quality to around 26-28 (higher number = smaller file size)
   - Check "Web Optimized"
5. Target file sizes:
   - `working-out.mp4`: Aim for 5-10MB
   - `Meal-Plan.mp4`: Aim for 3-5MB
6. Click "Start Encode"
7. Save the compressed files to:
   - `public/videos/working-out.mp4`
   - `public/videos/Meal-Plan.mp4`

### Option 2: Online Compression Services

If you prefer online tools:
1. Visit [Clipchamp](https://clipchamp.com/en/video-compressor/) or [FreeConvert](https://www.freeconvert.com/video-compressor)
2. Upload your video
3. Choose compression settings (medium quality)
4. Download the compressed version
5. Rename and save to your `public/videos/` folder

## After Compression

After adding the compressed videos to the `public/videos/` directory:

1. Commit and push the changes:
```
git add public/videos
git commit -m "Add compressed videos for better loading"
git push origin dev
```

This will trigger a new deployment with working videos. 