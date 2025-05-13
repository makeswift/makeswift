/**
 * Simple text component for Makeswift
 */
export interface SimpleTextProps {
  text?: string;
  color?: string;
  fontSize?: number;
}

export function SimpleText({ text = 'Default text', color = '#000000', fontSize = 16 }: SimpleTextProps) {
  return (
    <div 
      style={{ 
        color, 
        fontSize: `${fontSize}px`,
        padding: '1rem',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {text}
    </div>
  );
}