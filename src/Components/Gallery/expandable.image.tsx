import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

interface ExpandableImageProps {
  src: string;
  alt?: string;
  style?: any,
  onExpand?: () => void,
  onShrink?: () => void
}

const ExpandableImage: React.FC<ExpandableImageProps> = ({ src, alt, onExpand, onShrink }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded && onShrink) {
      onShrink();
    } else if (!isExpanded && onExpand) {
      onExpand();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card>
        <CardMedia
          component="img"
          image={src}
          alt={alt || 'Expandable image'}
          onClick={toggleExpand}
          style={{ cursor: 'pointer' }}
        />
        <IconButton onClick={toggleExpand} style={{ position: 'absolute', right: 0, top: 0 }}>
          <ZoomInIcon />
        </IconButton>
      </Card>

      <Modal
        open={isExpanded}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker grey backdrop
          },
        }}
        onClose={toggleExpand}
        style={{display:'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          style={{
            outline: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            borderRadius: '50%', // Circular shape
            width: '80vh', 
            height: '80vh', // Responsive height, based on viewport height
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <img src={src} alt={alt || 'Expanded image'} style={{ maxWidth: '90%', maxHeight: '90%' }} />
          <IconButton onClick={toggleExpand} style={{ position: 'absolute', right: 20, top: 20 }}>
            <ZoomOutIcon />
          </IconButton>
        </div>
      </Modal>
    </div>
  );
};

export default ExpandableImage;
