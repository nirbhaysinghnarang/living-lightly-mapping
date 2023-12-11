import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

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
    <Card style={{width: isExpanded? '100%' :'50%'}}>
      <CardMedia
        component="img"
        image={src}
        alt={alt || 'Expandable image'}
        onClick={toggleExpand}
        style={{ cursor: 'pointer',width:'100%', padding:'10px' }}
      />

      {isExpanded && (
        <IconButton onClick={toggleExpand}>
          <CloseIcon />
        </IconButton>
      )}
      {!isExpanded && (
        <IconButton onClick={toggleExpand}>
          <ZoomInIcon />
        </IconButton>
      )}
    </Card>
  );
};

export default ExpandableImage;
