import React from 'react';
import dayjs from 'dayjs';
import { Note } from '../utils/storage';

interface NoteViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
}

const NoteViewModal: React.FC<NoteViewModalProps> = ({ isOpen, onClose, note }) => {
    if (!isOpen || !note) return null;

    const isOverdue = dayjs().isAfter(dayjs(note.deadline));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: `4px solid ${note.color}` }}>
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                <h2 className="modal-title" style={{ marginBottom: '1rem' }}>{note.title}</h2>

                <div className="note-meta" style={{ marginBottom: '1.5rem', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
                    <span className={`note-deadline-label ${isOverdue ? 'overdue' : ''}`} style={{ fontSize: '0.9rem' }}>
                        {isOverdue ? 'Overdue!' : 'Deadline:'}
                    </span>
                    <span className="note-deadline-date" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {dayjs(note.deadline).format('MMMM D, YYYY h:mm A')}
                    </span>
                </div>

                <div className="note-body" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <p className="note-description" style={{ fontSize: '1rem', maxHeight: 'none', WebkitLineClamp: 'unset', display: 'block' }}>
                        {note.description}
                    </p>
                </div>

                <div className="modal-actions">
                    <button type="button" onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteViewModal;
