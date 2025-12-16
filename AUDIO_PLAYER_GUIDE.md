# Custom Audio Player - Usage Guide

## Overview

The audio player has been completely rewritten with improved state management, better controls, and advanced playback features including jump-to-section functionality.

## New Features

### 1. **Enhanced State Management**
- Centralized audio state in `stores/audio.ts`
- Better synchronization between UI and audio element
- Proper error handling and loading states

### 2. **Playback Controls**
- Play/Pause with visual feedback
- Skip forward/backward (15 seconds)
- Variable playback speed (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- Volume control with mute toggle
- Loading indicators

### 3. **Jump-to-Section Functionality**
- **Playback Marks**: Bookmark specific moments in the audio
- **Timeline Hover Preview**: See timestamp on hover
- **Visual Mark Indicators**: Marks shown on progress bar
- **Quick Jump**: Click marks to jump to that position

### 4. **Progress Bar Enhancements**
- Time formatting (MM:SS)
- Smooth dragging
- Visual progress indicator
- Hover preview with timestamp
- Marks visualization on timeline

## Components

### AudioPlayer
Main container component that brings everything together.

### Controls
Handles play/pause, skip forward/backward, and playback speed.

```tsx
import Controls from "./components/AudioPlayer/Controls";
```

### ProgressBar
Interactive timeline with marks and hover preview.

```tsx
import ProgressBar from "./components/AudioPlayer/ProgressBar";
```

### PlaybackMarks
Manage bookmarks/sections in the audio.

```tsx
import PlaybackMarks from "./components/AudioPlayer/PlaybackMarks";
```

### JumpToTime
Reusable component for creating clickable timestamps.

```tsx
import JumpToTime from "./components/AudioPlayer/JumpToTime";

// Usage
<JumpToTime time={125.5} label="Introduction" />
```

### VolumeControl
Volume slider with mute toggle and visual feedback.

## Store Functions

### Basic Playback
```typescript
import { 
    setIsPlaying, 
    togglePlayPause,
    jumpToTime,
    skipForward,
    skipBackward 
} from "../stores/audio";

// Play/pause
togglePlayPause();
setIsPlaying(true);

// Jump to specific time (in seconds)
jumpToTime(125.5);

// Skip 15 seconds forward/backward
skipForward(15);
skipBackward(15);
```

### Playback Marks
```typescript
import { 
    addPlaybackMark, 
    removePlaybackMark,
    clearPlaybackMarks 
} from "../stores/audio";

// Add a bookmark
addPlaybackMark({
    id: "intro",
    label: "Introduction",
    time: 10.5
});

// Remove a bookmark
removePlaybackMark("intro");

// Clear all bookmarks
clearPlaybackMarks();
```

### Playback Settings
```typescript
import { 
    setVolume, 
    setIsMuted,
    setPlaybackRate 
} from "../stores/audio";

// Set volume (0-100)
setVolume(75);

// Mute/unmute
setIsMuted(true);

// Change playback speed
setPlaybackRate(1.5); // 1.5x speed
```

## Integration with Transcript

Use the `JumpToTime` component in your transcript to make segments clickable:

```tsx
import JumpToTime from "./components/AudioPlayer/JumpToTime";

const TranscriptSegment = ({ text, startTime }) => {
    return (
        <div>
            <JumpToTime time={startTime} className="text-blue-400" />
            <p>{text}</p>
        </div>
    );
};
```

Or see the full example in `TranscriptWithJump.tsx`:

```tsx
import TranscriptWithJump from "./components/TranscriptWithJump";

const segments = [
    {
        id: "1",
        text: "Welcome to the podcast...",
        startTime: 0,
        endTime: 15.5,
        speaker: "Host"
    },
    // ... more segments
];

<TranscriptWithJump segments={segments} />
```

## Keyboard Shortcuts (Future Enhancement)

You can add keyboard shortcuts by listening to keyboard events:

```typescript
// Example: Space to play/pause, Left/Right arrows to skip
useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        }
        if (e.code === 'ArrowLeft') {
            skipBackward(5);
        }
        if (e.code === 'ArrowRight') {
            skipForward(5);
        }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

## Styling

The components use Tailwind CSS classes. Customize colors and styles by modifying the className props:

```tsx
// Example: Custom progress bar colors
<ProgressBar className="bg-purple-500" />
```

## API Reference

### Audio Store State
```typescript
{
    selectedAudio: TAudio | null;      // Currently playing audio
    audios: TAudio[];                  // All available audios
    currentTime: number;               // Current playback position (seconds)
    duration: number;                  // Total duration (seconds)
    isPlaying: boolean;                // Playing state
    volume: number;                    // Volume (0-100)
    isMuted: boolean;                  // Mute state
    playbackRate: number;              // Playback speed multiplier
    isLoading: boolean;                // Loading state
    playbackMarks: PlaybackMark[];     // Bookmarked positions
}
```

### PlaybackMark Type
```typescript
{
    id: string;        // Unique identifier
    label: string;     // Display name
    time: number;      // Position in seconds
}
```

## Best Practices

1. **Always check if audio is loaded** before using playback functions
2. **Use JumpToTime component** instead of manually calling jumpToTime for better UX
3. **Clear playback marks** when switching audio files
4. **Use playback marks** for important sections like chapters or key moments
5. **Provide visual feedback** when jumping to sections

## Troubleshooting

**Audio not playing:**
- Check if `selectedAudio` has a valid `filePath`
- Verify the audio file is accessible
- Check browser console for CORS errors

**Marks not appearing:**
- Ensure duration is loaded before adding marks
- Verify mark times are within 0 and duration
- Check that marks array is not empty

**Progress bar not updating:**
- Verify audio element ref is properly connected
- Check that isPlaying state is updating
- Look for errors in browser console
