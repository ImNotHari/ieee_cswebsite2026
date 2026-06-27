import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { eventSchema } from '../utils/schemas';

interface AddEventPanelProps {
  onSuccess: () => void;
  editingEvent?: any;
  onCancelEdit?: () => void;
  activeTab: string;
}

export default function AddEventPanel({ onSuccess, editingEvent, onCancelEdit, activeTab }: AddEventPanelProps) {
  // Mode State
  const [mode, setMode] = useState<'normal' | 'json'>('normal');

  // Form State
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [jsonInput, setJsonInput] = useState('');
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number>();

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const promptText = `You are an expert data extraction assistant. I am providing you with an image of an event poster or flyer. Your task is to extract the event details from this image and output a single, valid JSON object that strictly adheres to my database schema.

### Step 1: Extraction & Formatting Rules
Analyze the image and construct a JSON object using ONLY the following keys. Adhere strictly to the formatting rules:

1. "title" (String, required): The main name or title of the event.
2. "date" (String, required): The date of the event. MUST be converted to "YYYY-MM-DD" format. If no year is present, assume the current year unless context implies otherwise.
3. "time" (String, required): The start time of the event. MUST be converted to 24-hour format: "HH:MM" (e.g., "14:30" for 2:30 PM). 
4. "location" (String, optional): The venue, room, platform, or address where the event takes place. 
5. "description" (String, optional): A concise summary of the event details, speakers, or topics. Combine relevant sub-text from the poster into a single readable paragraph.

DO NOT include any other keys.
DO NOT wrap the JSON in markdown formatting if it prevents the output from being parsed directly (output raw JSON).

### Step 2: Ambiguity & Missing Data Check (CRITICAL)
Before outputting the JSON, you must check for missing required fields or ambiguous information. 

If any of the following are true, DO NOT output the JSON yet. Instead, output a list of questions asking me to clarify:
- The "title" is entirely missing or unreadable.
- The "date" is missing or it is impossible to determine the exact calendar date.
- The "time" is missing or ambiguous (e.g., it says "8:00" but it is unclear if it is AM or PM based on context).
- There are multiple conflicting dates, times, or locations on the poster.

If there are ambiguities, phrase your response like this:
"I need clarification before generating the JSON:
1. Is the time 8:00 AM or 8:00 PM?
2. The poster mentions both 'Main Hall' and 'Room 101'. Which should be the primary location?"

If all required fields (title, date, time) can be confidently determined, output ONLY the JSON object and nothing else.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setIsCopied(true);
    clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = window.setTimeout(() => setIsCopied(false), 2000);
  };

  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setEventDate(editingEvent.date || '');
      setTime(editingEvent.time || '');
      setLocation(editingEvent.location || '');
      setDescription(editingEvent.description || '');
      setSelectedFile(null);
      setMode('normal'); // Force normal mode for editing
    } else {
      resetForm();
    }
  }, [editingEvent, activeTab]);

  useEffect(() => {
    if (!message.text) return;
    const id = setTimeout(() => {
      if (isMounted.current) {
        setMessage({ text: '', type: '' });
      }
    }, 5000);
    return () => clearTimeout(id);
  }, [message.text]);

  const safeSetState = useCallback((fn: () => void) => {
    if (isMounted.current) fn();
  }, []);

  const resetForm = () => {
    setTitle('');
    setEventDate('');
    setTime('');
    setLocation('');
    setDescription('');
    setSelectedFile(null);
    setJsonInput('');
    setJsonErrors({});
    setErrors({});
  };

  const isFormDirty = () => {
    if (mode === 'normal') {
      return title !== '' || eventDate !== '' || time !== '' || location !== '' || description !== '' || selectedFile !== null;
    }
    return jsonInput.trim() !== '' || selectedFile !== null;
  };

  const handleModeSwitch = (newMode: 'normal' | 'json') => {
    if (mode === newMode) return;
    if (isFormDirty()) {
      if (!window.confirm("You have unsaved changes. Switching modes will clear them. Continue?")) {
        return;
      }
    }
    resetForm();
    setMode(newMode);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const uploadPoster = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('posters')
      .upload(fileName, selectedFile);

    if (uploadError) {
      throw uploadError;
    }
    return uploadData.path;
  };

  const handlePublish = async () => {
    setMessage({ text: '', type: '' });
    setErrors({});
    setJsonErrors({});

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setMessage({ text: 'Session expired. Please log in again.', type: 'error' });
      return;
    }

    setLoading(true);
    let posterPath: string | null = null;
    
    try {
      // Assuming IST (+05:30) since users/events are in India.
      // This creates a globally accurate UTC timestamp for the database.
      const computeStartTimestamp = (d: string, t: string) => {
        return new Date(`${d}T${t}:00+05:30`).toISOString();
      };

      if (mode === 'normal') {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = 'Event Title is required';
        if (!eventDate) newErrors.eventDate = 'Date is required';
        if (!time) newErrors.time = 'Time is required';

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          throw new Error('Please fill in all required fields.');
        }

        const parsedDate = new Date(eventDate);
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Invalid calendar date.');
        }

        posterPath = await uploadPoster();

        const eventData: any = {
          title,
          date: eventDate,
          time,
          location,
          description,
          is_published: true,
          start_timestamp: computeStartTimestamp(eventDate, time)
        };
        if (posterPath) eventData.poster_path = posterPath;

        if (editingEvent) {
          const { error: updateError } = await supabase
            .from('events')
            .update(eventData)
            .eq('id', editingEvent.id);
          if (updateError) throw updateError;
          setMessage({ text: 'Event updated successfully!', type: 'success' });
          if (onCancelEdit) onCancelEdit();
        } else {
          const { error: insertError } = await supabase
            .from('events')
            .insert(eventData);
          if (insertError) throw insertError;
          setMessage({ text: 'Event published successfully!', type: 'success' });
          resetForm();
        }
      } else if (mode === 'json') {
        let parsedJson;
        try {
          // AI tools often stubbornly wrap output in markdown despite instructions.
          // Clean up markdown code blocks if they exist.
          let cleanedInput = jsonInput.trim();
          cleanedInput = cleanedInput.replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '');
          
          parsedJson = JSON.parse(cleanedInput);
        } catch (err: any) {
          throw new Error(`Invalid JSON syntax: ${err.message}`);
        }

        const validationResult = eventSchema.safeParse(parsedJson);
        if (!validationResult.success) {
          const formattedErrors: Record<string, string> = {};
          validationResult.error.issues.forEach(issue => {
            const key = issue.path[0]?.toString() || 'general';
            formattedErrors[key] = issue.message;
          });
          setJsonErrors(formattedErrors);
          throw new Error('JSON validation failed. See errors below.');
        }

        posterPath = await uploadPoster();

        // ONLY use destructured validated fields from Zod
        const eventData = {
          ...validationResult.data,
          is_published: true,
          start_timestamp: computeStartTimestamp(validationResult.data.date, validationResult.data.time)
        } as any;
        
        if (posterPath) {
          eventData.poster_path = posterPath;
        }

        const { error: insertError } = await supabase
          .from('events')
          .insert(eventData);
          
        if (insertError) throw insertError;
        
        setMessage({ text: 'Event published successfully via JSON!', type: 'success' });
        resetForm();
      }
      
      onSuccess();
    } catch (err: any) {
      safeSetState(() => {
        setMessage({ text: err.message || 'An error occurred', type: 'error' });
      });
    } finally {
      safeSetState(() => {
        setLoading(false);
      });
    }
  };

  return (
    <>
      <div className="dashboard-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="gradient-text">{editingEvent ? 'Edit Event' : 'Add New Event'}</h1>
        
        {!editingEvent && (
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', padding: '0.25rem', borderRadius: '12px', alignItems: 'center' }}>
            <button 
              type="button"
              onClick={() => handleModeSwitch('normal')}
              style={{
                background: mode === 'normal' ? 'var(--accent-gradient)' : 'transparent',
                color: mode === 'normal' ? '#fff' : 'var(--color-text-secondary)',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                boxShadow: mode === 'normal' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Normal
            </button>
            <button 
              type="button"
              onClick={() => handleModeSwitch('json')}
              style={{
                background: mode === 'json' ? 'var(--accent-gradient)' : 'transparent',
                color: mode === 'json' ? '#fff' : 'var(--color-text-secondary)',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                boxShadow: mode === 'json' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              JSON
            </button>
          </div>
        )}
      </div>
      
      {message.text && (
        <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: message.type === 'error' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(76, 201, 240, 0.1)', color: message.type === 'error' ? '#ff6b6b' : 'var(--sky-aqua)', border: `1px solid ${message.type === 'error' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(76, 201, 240, 0.2)'}` }}>
          {message.text}
        </div>
      )}

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', marginTop: '1rem' }}>
        
        {mode === 'normal' && (
          <>
            <div className="form-section">
              <h3 className="dashboard-section-title">Basic Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label">Event Title <span style={{ color: '#ff6b6b' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="Enter the event title..." 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className={`form-input ${errors.title ? 'error' : ''}`} 
                />
                {errors.title && <span className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{errors.title}</span>}
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="dashboard-section-title">Schedule</h3>
              <div className="form-row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <label className="form-label">Date <span style={{ color: '#ff6b6b' }}>*</span></label>
                  <input 
                    type="date" 
                    value={eventDate} 
                    onChange={e => setEventDate(e.target.value)} 
                    className={`form-input ${errors.eventDate ? 'error' : ''}`} 
                  />
                  {errors.eventDate && <span className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{errors.eventDate}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <label className="form-label">Time <span style={{ color: '#ff6b6b' }}>*</span></label>
                  <input 
                    type="time" 
                    step="60" 
                    value={time} 
                    onChange={e => setTime(e.target.value)} 
                    className={`form-input ${errors.time ? 'error' : ''}`} 
                  />
                  {errors.time && <span className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{errors.time}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="dashboard-section-title">Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="form-label">Location (Optional)</label>
                  <input type="text" placeholder="e.g. Main Auditorium" value={location} onChange={e => setLocation(e.target.value)} className="form-input" />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="form-label">Event Description</label>
                  <textarea placeholder="Write something about the event..." value={description} onChange={e => setDescription(e.target.value)} className="form-input" style={{ minHeight: '150px' }} />
                </div>
              </div>
            </div>
          </>
        )}

        {mode === 'json' && (
          <div className="form-section">
            <h3 className="dashboard-section-title">JSON Payload <span style={{ color: '#ff6b6b' }}>*</span></h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, flex: 1, minWidth: '200px' }}>
                Paste your raw JSON object here. You can use an AI to extract this from a poster.
              </p>
              <button type="button" className={`prompt-copy-btn ${isCopied ? 'copied' : ''}`} onClick={handleCopyPrompt}>
                <div className="icon-wrapper">
                  <svg width="19px" height="21px" viewBox="0 0 19 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g transform="translate(-142.000000, -122.000000)">
                        <g transform="translate(142.000000, 122.000000)">
                          <path d="M3.4,4 L11.5,4 L11.5,4 L16,8.25 L16,17.6 C16,19.4777681 14.4777681,21 12.6,21 L3.4,21 C1.52223185,21 6.74049485e-16,19.4777681 0,17.6 L0,7.4 C2.14128934e-16,5.52223185 1.52223185,4 3.4,4 Z" fill="#FFE8CC"></path>
                          <path d="M6.4,0 L12,0 L12,0 L19,6.5 L19,14.6 C19,16.4777681 17.4777681,18 15.6,18 L6.4,18 C4.52223185,18 3,16.4777681 3,14.6 L3,3.4 C3,1.52223185 4.52223185,7.89029623e-16 6.4,0 Z" fill="#FFA94D"></path>
                          <path d="M12,0 L12,5.5 C12,6.05228475 12.4477153,6.5 13,6.5 L19,6.5 L19,6.5 L12,0 Z" fill="#E57800"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                  <svg width="19px" height="21px" viewBox="0 0 19 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g transform="translate(-142.000000, -122.000000)">
                        <g transform="translate(142.000000, 122.000000)">
                          <path d="M3.4,4 L11.5,4 L11.5,4 L16,8.25 L16,17.6 C16,19.4777681 14.4777681,21 12.6,21 L3.4,21 C1.52223185,21 6.74049485e-16,19.4777681 0,17.6 L0,7.4 C2.14128934e-16,5.52223185 1.52223185,4 3.4,4 Z" fill="#FFE8CC"></path>
                          <path d="M6.4,0 L12,0 L12,0 L19,6.5 L19,14.6 C19,16.4777681 17.4777681,18 15.6,18 L6.4,18 C4.52223185,18 3,16.4777681 3,14.6 L3,3.4 C3,1.52223185 4.52223185,7.89029623e-16 6.4,0 Z" fill="#FFA94D"></path>
                          <path d="M12,0 L12,5.5 C12,6.05228475 12.4477153,6.5 13,6.5 L19,6.5 L19,6.5 L12,0 Z" fill="#E57800"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <span>{isCopied ? 'Copied!' : 'Copy Prompt'}</span>
              </button>
            </div>
            <textarea 
              placeholder={`{\n  "title": "Annual Tech Symposium",\n  "date": "2026-08-15",\n  "time": "14:30",\n  "location": "Main Auditorium",\n  "description": "Guest speakers discussing AI..."\n}`} 
              value={jsonInput} 
              onChange={e => setJsonInput(e.target.value)} 
              className={`form-input ${Object.keys(jsonErrors).length > 0 ? 'error' : ''}`} 
              style={{ minHeight: '250px', fontFamily: 'monospace' }} 
            />
            {Object.keys(jsonErrors).length > 0 && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {Object.entries(jsonErrors).map(([key, msg]) => (
                  <span key={key} className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>
                    <strong>{key === 'general' ? 'Schema Error' : key}:</strong> {msg}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="form-section">
          <h3 className="dashboard-section-title">Media (Optional)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">Event Cover Image</label>
            <label 
              className={`custom-file-upload ${dragActive ? 'drag-active' : ''}`} 
              htmlFor="file" 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{ 
                padding: selectedFile ? '0' : '1.5rem', 
                overflow: 'hidden',
                borderColor: dragActive ? 'var(--accent-color)' : '',
                background: dragActive ? 'rgba(255, 255, 255, 0.05)' : ''
              }}
            >
            {selectedFile ? (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img src={previewUrl || ''} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                  <span style={{ color: 'white', fontWeight: 500 }}>Change Image</span>
                </div>
              </div>
            ) : (
              <>
                <div className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="var(--sky-aqua)" viewBox="0 0 24 24" width="48" height="48">
                    <path fill="currentColor" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clipRule="evenodd" fillRule="evenodd"></path>
                  </svg>
                </div>
                <div className="text">
                  <span>Click or drag image here</span>
                </div>
              </>
            )}
            <input type="file" id="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} disabled={loading} />
          </label>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            className="publish-btn primary-cta" 
            onClick={handlePublish} 
            disabled={loading || (mode === 'normal' && (!title.trim() || !eventDate || !time)) || (mode === 'json' && !jsonInput.trim())}
            style={{ opacity: loading || (mode === 'normal' && (!title.trim() || !eventDate || !time)) || (mode === 'json' && !jsonInput.trim()) ? 0.5 : 1, cursor: loading || (mode === 'normal' && (!title.trim() || !eventDate || !time)) || (mode === 'json' && !jsonInput.trim()) ? 'not-allowed' : 'pointer', flex: 1 }}
          >
            {loading ? (editingEvent ? 'Updating...' : 'Publishing...') : (editingEvent ? 'Update Event' : 'Publish Event')}
          </button>
          {editingEvent && (
            <button 
              type="button" 
              className="publish-btn" 
              onClick={onCancelEdit} 
              disabled={loading}
              style={{ marginTop: '1rem', padding: '1rem', flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </>
  );
}
