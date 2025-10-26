const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

// Upload single image to local storage
export const uploadImage = async (file) => {
  console.log('📤 Starting upload...', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  const formData = new FormData();
  formData.append('image', file);

  const token = getToken();
  console.log('🔑 Token:', token ? 'Present' : 'Missing');

  const response = await fetch(`${API_URL}/upload/image`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  console.log('📥 Response status:', response.status);

  const data = await response.json();
  console.log('📦 Response data:', data);

  if (!response.ok) {
    console.error('❌ Upload failed:', data);
    throw new Error(data.message || 'Failed to upload image');
  }

  console.log('✅ Upload successful! URL:', data.imageUrl);
  return data.imageUrl;
};

// Upload multiple images to local storage
export const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  const token = getToken();
  const response = await fetch(`${API_URL}/upload/images`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload images');
  }

  return data.images.map(img => img.url);
};
