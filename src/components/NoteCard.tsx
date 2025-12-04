import React from 'react';
import Draggable from 'react-draggable';
import dayjs from 'dayjs';
import { Note } from '../utils/storage';

interface NoteCardProps {
    note: Note;
    onDelete: (id: string) => void;
    onEdit: (note: Note) => void;
    onView: (note: Note) => void;
    onComplete: (id: string) => void;
    onPositionChange: (id: string, x: number, y: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onEdit, onView, onComplete, onPositionChange }) => {
    const isOverdue = dayjs().isAfter(dayjs(note.deadline));

    const nodeRef = React.useRef(null);

    const handleDrag = (_e: any, data: any) => {
        onPositionChange(note.id, data.x, data.y);
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            defaultPosition={{ x: note.x, y: note.y }}
            onStop={handleDrag}
        >
            <div
                ref={nodeRef}
                className="note-card"
                style={{
                    borderTop: `4px solid ${note.color}`,
                }}
            >
                <div className="note-header">
                    <h3 className="note-title" title={note.title}>{note.title}</h3>
                    <div className="note-actions">
                        <button
                            onClick={() => onView(note)}
                            className="icon-btn view-btn"
                            title="View"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        <button
                            onClick={() => onEdit(note)}
                            className="icon-btn edit-btn"
                            title="Edit"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(note.id)}
                            className="icon-btn delete-btn"
                            title="Delete"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="note-body">
                    <p className="note-description">
                        {note.description}
                    </p>
                </div>

                <div className="note-footer">
                    <div className="note-meta">
                        <span className={`note-deadline-label ${isOverdue ? 'overdue' : ''}`}>
                            {isOverdue ? 'Overdue!' : 'Deadline'}
                        </span>
                        <span className="note-deadline-date">
                            {dayjs(note.deadline).format('MMM D, h:mm A')}
                        </span>
                    </div>

                    <button
                        onClick={() => onComplete(note.id)}
                        className="complete-btn"
                    >
                        Complete
                    </button>
                </div>
            </div>
        </Draggable>
    );
};

export default NoteCard;
