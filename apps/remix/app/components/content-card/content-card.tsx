/**
 * Content Card component for Makeswift
 */
import React from 'react';

export interface ContentCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  textAlign?: 'left' | 'center' | 'right';
  onClick?: () => void;
}

export function ContentCard({
  title = 'Card Title',
  description = 'Card description goes here. Add details about this card.',
  imageUrl,
  backgroundColor = '#ffffff',
  borderRadius = 8,
  padding = 20,
  textAlign = 'left',
  onClick,
}: ContentCardProps) {
  return (
    <div
      style={{
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        maxWidth: '100%',
      }}
      onClick={onClick}
    >
      {imageUrl && (
        <div style={{ marginBottom: '16px' }}>
          <img 
            src={imageUrl} 
            alt={title} 
            style={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: `${Math.max(0, borderRadius - 4)}px`,
              display: 'block'
            }} 
          />
        </div>
      )}
      <h3 style={{ margin: '0 0 8px', fontWeight: 'bold', fontSize: '1.25rem' }}>
        {title}
      </h3>
      <p style={{ margin: 0, color: '#4b5563', fontSize: '1rem', lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  );
}