import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { ExpandLess, ExpandMore, ZoomIn, ZoomOut } from '@mui/icons-material';

interface ExpandableImageProps {
  src: string;
  alt?: string;
  style:any
}

const ExpandableImage: React.FC<ExpandableImageProps> = ({ src, alt, style }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{ position: 'relative', width: isExpanded ? '100%' : '50%' }}>
        <Card >
        <CardMedia
            component="img"
            image={src}
            alt={alt || 'Expandable image'}
            onClick={toggleExpand}
            style={{ cursor: 'pointer',width:'100%', padding:'10px' }}
        />

        {isExpanded && (
            <IconButton onClick={toggleExpand}  style={{ position: 'absolute', right: 0, top: 0 }}>
            <ZoomOut />
            </IconButton>
        )}
        {!isExpanded && (
            <IconButton onClick={toggleExpand} style={{ position: 'absolute', right: 0, top: 0 }}>
            <ZoomIn />
            </IconButton>
        )}
        </Card>
    </div>
  );
};

export default ExpandableImage;
