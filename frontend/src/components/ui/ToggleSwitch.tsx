'use client';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
    small:  { trackW: 40, trackH: 24, thumb: 18, padding: 3, thumbRadius: 6 },
    medium: { trackW: 44, trackH: 26, thumb: 20, padding: 3, thumbRadius: 8 },
    large:  { trackW: 64, trackH: 40, thumb: 34, padding: 3, thumbRadius: 12 },
};

export const ToggleSwitch = ({ enabled, onChange, size = 'medium' }: ToggleSwitchProps) => {
    const { trackW, trackH, thumb, padding, thumbRadius } = sizeMap[size];

    const toggle = () => {
        onChange(!enabled);
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                toggle();
            }}
            style={{
                width: `${trackW}px`,
                height: `${trackH}px`,
                borderRadius: `${trackH / 2}px`,
                backgroundColor: '#eef2ff', 
                position: 'relative',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    width: `${thumb}px`,
                    height: `${thumb}px`,
                    borderRadius: `${thumbRadius}px`, 
                    backgroundColor: enabled ? '#6366f1' : '#a8a29e',
                    position: 'absolute',
                    top: '50%',
                    transform: `translateY(-50%) translateX(${enabled ? trackW - thumb - padding : padding}px)`,
                    transition: 'all 0.2s ease-in-out',
                }}
            />
        </button>
    );
}; 