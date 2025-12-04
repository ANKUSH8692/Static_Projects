import { v4 as uuidv4 } from 'uuid';

export interface Note {
    id: string;
    title: string;
    description: string;
    color: string;
    deadline: string; // ISO string
    createdAt: string;
    x: number; // X position on screen
    y: number; // Y position on screen
}

const STORAGE_KEY = 'task_notes_data';

export const loadNotes = (): Note[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const notes: Note[] = JSON.parse(data);
    let hasUpdates = false;

    // Assign positions to legacy notes that don't have them
    const updatedNotes = notes.map((note, index) => {
        if (typeof note.x !== 'number' || typeof note.y !== 'number') {
            hasUpdates = true;
            return {
                ...note,
                x: 50 + (index * 60) % 800, // Wider spread
                y: 50 + (index * 60) % 600, // Wider spread
            };
        }
        return note;
    });

    // Save back if we added positions
    if (hasUpdates) {
        saveNotes(updatedNotes);
    }

    return updatedNotes;
};

export const saveNotes = (notes: Note[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const createNote = (note: Omit<Note, 'id' | 'createdAt' | 'x' | 'y'>): Note => {
    const notes = loadNotes();
    // Random position for new notes (avoid overlap with basic offset)
    const newNote: Note = {
        ...note,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        x: 50 + (notes.length * 60) % 800, // Wider spread
        y: 50 + (notes.length * 60) % 600, // Wider spread
    };
    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    return newNote;
};

export const updateNote = (updatedNote: Note) => {
    const notes = loadNotes();
    const index = notes.findIndex((n) => n.id === updatedNote.id);
    if (index !== -1) {
        notes[index] = updatedNote;
        saveNotes(notes);
    }
};

export const deleteNote = (id: string) => {
    const notes = loadNotes();
    const updatedNotes = notes.filter((n) => n.id !== id);
    saveNotes(updatedNotes);
};
