// components\album-card.tsx
import React from 'react';

interface AlbumCardProps {
  albumId: number;
  title: string;
  img: string;
  albumType: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ title, img = ''}) => {
  const getFileExtension = (url: string): string => {
    return url.split('.').pop()?.toLowerCase() || '';
  };

  const isImage = (url: string): boolean => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extension = getFileExtension(url);
    return imageExtensions.includes(extension);
  };

  const renderMedia = () => {
    if (!img) {
      return (
        <div className="w-full h-64 flex items-center justify-center text-gray-400">
          This album has no media file
        </div>
      );
    } else if (isImage(img)) {
      return <img src={img} alt={title} className="w-full h-64 object-cover" />;
    } else {
      return (
        <video controls className="w-full h-64 object-cover">
          <source src={img} type="video/mp4" />
          {/* Add additional source types if needed (e.g., WebM, Ogg) */}
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg shadow-sm">
      {renderMedia()}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
        <p className="font-bold">{title}</p>
      </div>
    </div>
  );
};

export default AlbumCard;
