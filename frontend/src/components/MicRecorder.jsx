import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Mic, Volume2 } from 'lucide-react';

export default function MicRecorder({ onStop }) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);

  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const pcmBuffersRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecordingResources();
    };
  }, []);

  const stopRecordingResources = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const startRecording = async () => {
    pcmBuffersRef.current = [];
    setDuration(0);
    setAudioUrl(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      // Create ScriptProcessor with 4096 buffer size, 1 input channel, 1 output channel
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Store cloned PCM samples
        pcmBuffersRef.current.push(new Float32Array(inputData));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Microphone access failed:', err);
      alert('Could not access microphone. Please check browser permissions.');
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    const mergedPcm = mergeBuffers(pcmBuffersRef.current);
    const wavBlob = encodeWAV(mergedPcm, 16000);
    const url = URL.createObjectURL(wavBlob);
    
    setAudioUrl(url);

    if (processorRef.current) processorRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();

    if (onStop) {
      onStop({ blob: wavBlob, url, duration });
    }
  };

  const mergeBuffers = (buffers) => {
    let totalLength = 0;
    for (let i = 0; i < buffers.length; i++) {
      totalLength += buffers[i].length;
    }
    const result = new Float32Array(totalLength);
    let offset = 0;
    for (let i = 0; i < buffers.length; i++) {
      result.set(buffers[i], offset);
      offset += buffers[i].length;
    }
    return result;
  };

  const encodeWAV = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM Format
    view.setUint16(22, 1, true); // Mono channel
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);
    return new Blob([view], { type: 'audio/wav' });
  };

  const floatTo16BitPCM = (output, offset, input) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-5 bg-white dark:bg-slate-800/80 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50 max-w-sm mx-auto transition-colors duration-300">
      {/* Icon Circle */}
      <div className={`flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
        isRecording 
          ? 'bg-red-50 dark:bg-red-950/20 text-red-500 ring-4 ring-red-100 dark:ring-red-950/50' 
          : 'bg-primary-50 dark:bg-primary-950/20 text-primary-500'
      }`}>
        <Mic className={`h-10 w-10 ${isRecording ? 'animate-pulse' : ''}`} />
      </div>

      {/* Timer and Wave Animation */}
      <div className="text-center w-full">
        <div className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100">
          {formatTime(duration)}
        </div>
        
        {isRecording ? (
          <div className="flex justify-center items-center space-x-1 h-6 mt-4">
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {audioUrl ? 'Ready to submit. Or record again.' : 'Click start to practice.'}
          </p>
        )}
      </div>

      {/* Button Controls */}
      <div className="flex space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>{audioUrl ? 'Re-record' : 'Start Answer'}</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 animate-bounce"
          >
            <Square className="h-4 w-4 fill-white" />
            <span>Stop Recording</span>
          </button>
        )}
      </div>

      {/* Audio Playback Player */}
      {audioUrl && !isRecording && (
        <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-2">
            <Volume2 className="h-3.5 w-3.5" />
            <span>Review your audio sample</span>
          </div>
          <audio src={audioUrl} controls className="w-full h-10 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        </div>
      )}
    </div>
  );
}
