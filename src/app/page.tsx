'use client';

import React, { useState, useEffect } from 'react';
import { Note, loadNotes, saveNotes, createNote, updateNote, deleteNote } from '../utils/storage';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import dayjs from 'dayjs';

import NoteViewModal from '../components/NoteViewModal';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [alarmNote, setAlarmNote] = useState<Note | null>(null);
  const [audio] = useState(typeof Audio !== "undefined" ? new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3') : null);

  useEffect(() => {
    setNotes(loadNotes());
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkDeadlines = () => {
      const now = dayjs();
      notes.forEach(note => {
        const deadline = dayjs(note.deadline);
        // Trigger if deadline is passed and it's not already the active alarm
        if (now.isAfter(deadline) && alarmNote?.id !== note.id) {
          triggerAlarm(note);
        }
      });
    };

    const interval = setInterval(checkDeadlines, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [notes, isMounted, alarmNote]);

  const triggerAlarm = (note: Note) => {
    setAlarmNote(note);
    if (audio) {
      audio.loop = true;
      audio.play().catch(e => console.log("Audio play failed", e));
    }
  };

  const stopAlarm = () => {
    setAlarmNote(null);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    const noteToUpdate = notes.find(n => n.id === id);
    if (noteToUpdate) {
      const updatedNote = { ...noteToUpdate, x, y };
      updateNote(updatedNote);
      setNotes(loadNotes());
    }
  };

  const handleCreateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'x' | 'y'> | Note) => {
    if ('id' in noteData) {
      updateNote(noteData as Note);
      setNotes(loadNotes());
    } else {
      createNote(noteData);
      setNotes(loadNotes());
    }
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      setNotes(loadNotes());
    }
  };

  const handleCompleteNote = (id: string) => {
    deleteNote(id);
    setNotes(loadNotes());
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const openViewModal = (note: Note) => {
    setViewingNote(note);
    setIsViewModalOpen(true);
  };

  if (!isMounted) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <main className="app-container">
      {alarmNote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-pulse">
          <div className="bg-red-900/50 border-2 border-red-500 p-8 rounded-2xl text-center max-w-md mx-4 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
            <h2 className="text-4xl font-bold text-white mb-4">⏰ ALARM!</h2>
            <p className="text-xl text-red-200 mb-6">Deadline passed for:<br /><span className="font-bold text-white">{alarmNote.title}</span></p>
            <button
              onClick={stopAlarm}
              className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg transition-transform hover:scale-105"
            >
              Dismiss Alarm
            </button>
          </div>
        </div>
      )}

      <div className="content-wrapper">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              TaskNotes
            </h1>
            <p className="app-subtitle">Manage your tasks with style</p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn btn-primary new-note-btn"
          >
            <span className="plus-icon">+</span> New Note
          </button>
        </header>

        <div className="notes-canvas">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
              onEdit={openEditModal}
              onView={openViewModal}
              onComplete={handleCompleteNote}
              onPositionChange={handlePositionChange}
            />
          ))}
        </div>

        {notes.length === 0 && (
          <div className="empty-state">
            <p>No notes yet. Create one to get started!</p>
          </div>
        )}
      </div>

      <NoteForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateNote}
        initialData={editingNote}
      />

      <NoteViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        note={viewingNote}
      />
    </main>
  );
}
