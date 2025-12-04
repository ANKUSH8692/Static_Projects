import React, { useState, useEffect } from 'react';
import { Note } from '../utils/storage';
import dayjs from 'dayjs';

interface NoteFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (note: Omit<Note, 'id' | 'createdAt'> | Note) => void;
    initialData?: Note | null;
}

const COLORS = [
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#22c55e', // Green
    '#eab308', // Yellow
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#f97316', // Orange
    '#06b6d4', // Cyan
];

const NoteForm: React.FC<NoteFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setColor(initialData.color);
            setDeadline(dayjs(initialData.deadline).format('YYYY-MM-DDTHH:mm'));
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setColor(COLORS[0]);
        setDeadline(dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm'));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const noteData = {
            title,
            description,
            color,
            deadline: new Date(deadline).toISOString(),
            ...(initialData && { id: initialData.id, createdAt: initialData.createdAt }),
        };

        onSubmit(noteData as any);
        onClose();
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    onClick={onClose}
                    className="modal-close-btn"
                >
                    ✕
                </button>

                <h2 className="modal-title">
                    {initialData ? 'Edit Note' : 'New Note'}
                </h2>

                <form onSubmit={handleSubmit} className="note-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-input"
                            placeholder="Enter note title..."
                            autoFocus
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-input form-textarea"
                            placeholder="Enter note details..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Color</label>
                        <div className="color-picker">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`color-swatch ${color === c ? 'selected' : ''}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Deadline</label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {initialData ? 'Save Changes' : 'Create Note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteForm;
