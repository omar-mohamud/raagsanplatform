"use client";

import { useState } from "react";

export default function CloudinaryUpload({ onUpload, folder = "raagsan" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Get signed upload parameters
      const signResponse = await fetch('/api/uploads/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder }),
      });

      if (!signResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const { timestamp, folder: uploadFolder, signature, cloud_name, api_key } = await signResponse.json();

      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', timestamp);
      formData.append('folder', uploadFolder);
      formData.append('signature', signature);
      formData.append('api_key', api_key);

      // Upload to Cloudinary
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const result = await uploadResponse.json();
      
      // Call the callback with the uploaded image URL
      if (onUpload) {
        onUpload(result.secure_url);
      }

      setProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setProgress(0);
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="cloudinary-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="w-8 h-8 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
          </div>
          <input
            id="cloudinary-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>
      
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
