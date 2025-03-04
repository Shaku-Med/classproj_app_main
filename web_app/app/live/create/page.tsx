'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Copy, Check, Info, Video, Radio, Settings, ChevronDown, AlertCircle } from 'lucide-react';

function CreateStreamPage() {
  const [streamTitle, setStreamTitle] = useState('');
  const [streamCategory, setStreamCategory] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [showStreamKey, setShowStreamKey] = useState(false);
  const [streamKey, setStreamKey] = useState('live_123456789_xyzABCdefGHI');
  const [rtmpUrl, setRtmpUrl] = useState('rtmp://stream.yourdomain.com/live');
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const [streamQuality, setStreamQuality] = useState('720p');
  const [copySuccess, setCopySuccess] = useState({ key: false, url: false });
  const [streamMode, setStreamMode] = useState<'rtmp' | 'webrtc'>('rtmp');
  const videoRef = useRef<HTMLVideoElement>(null);

  const categories = ['Gaming', 'Just Chatting', 'Music', 'Art', 'Sports', 'Education', 'Science & Technology', 'Food & Drink', 'Travel & Outdoors', 'Other'];

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTag && !tags.includes(currentTag) && tags.length < 5) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => setTags(tags.filter(tag => tag !== tagToRemove));

  const copyToClipboard = (text: string, type: 'key' | 'url') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopySuccess(prev => ({ ...prev, [type]: false })), 2000);
    });
  };

  const generateNewStreamKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newKey = 'live_';
    for (let i = 0; i < 20; i++) {
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setStreamKey(newKey);
  };

  useEffect(() => {
    if (streamMode === 'webrtc' && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          videoRef.current!.srcObject = stream;
        })
        .catch(console.error);
    }
  }, [streamMode]);

  const handleGoLive = () => {
    alert('Going live with title: ' + streamTitle);
  };

  return (
    <div className=" h-full overflow-auto text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-purple-400">StreamHub</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Create a Live Stream</h2>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setStreamMode('rtmp')} className={`px-4 py-2 rounded-lg ${streamMode === 'rtmp' ? 'bg-purple-600' : 'bg-gray-700'}`}>Use RTMP</button>
          <button onClick={() => setStreamMode('webrtc')} className={`px-4 py-2 rounded-lg ${streamMode === 'webrtc' ? 'bg-purple-600' : 'bg-gray-700'}`}>Use WebRTC</button>
        </div>

        {streamMode === 'rtmp' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">RTMP Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Stream Key</label>
                <div className="flex items-center bg-gray-700 rounded-lg px-4 py-3">
                  <span className="flex-1 truncate">{showStreamKey ? streamKey : '••••••••••••'}</span>
                  <button onClick={() => setShowStreamKey(!showStreamKey)}>{showStreamKey ? <EyeOff /> : <Eye />}</button>
                  <button onClick={() => copyToClipboard(streamKey, 'key')}>{copySuccess.key ? <Check /> : <Copy />}</button>
                  <button onClick={generateNewStreamKey}><Radio /></button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">RTMP URL</label>
                <div className="flex items-center bg-gray-700 rounded-lg px-4 py-3">
                  <span className="flex-1 truncate">{rtmpUrl}</span>
                  <button onClick={() => copyToClipboard(rtmpUrl, 'url')}>{copySuccess.url ? <Check /> : <Copy />}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {streamMode === 'webrtc' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">WebRTC Preview</h3>
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black" />
          </div>
        )}

        <button onClick={handleGoLive} className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold">Go Live</button>
      </div>
    </div>
  );
}

export default CreateStreamPage;
