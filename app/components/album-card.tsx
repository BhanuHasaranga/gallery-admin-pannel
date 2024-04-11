import React from 'react';

interface AlbumCardProps {
  title: string;
  img: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ title, img }) => (
  <div className="relative overflow-hidden rounded-lg shadow-sm">
    <img src={img} alt={title} className="w-full h-64 object-cover" />
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
      <p className="font-bold">{title}</p>
    </div>
  </div>
);

export default AlbumCard;
