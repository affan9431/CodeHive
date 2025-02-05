import { useState } from "react";
import axios from "axios";
import { User } from "lucide-react";
import toast from "react-hot-toast";

const NotesSection = ({ notes, courseId, userId }) => {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitNote = async (e) => {
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:8080/api/notes`, {
        content: newNote,
        userId,
        courseId,
      });
      toast.success("Your note has been successfully saved!");
      setNewNote("");
      setIsSubmitting(false);
    } catch (error) {
      toast.error("Failed to save your note. Please try again.");
    }
  };

  return (
    <>
      {/* Question Input Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h1>Your Notes</h1>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[100px]"
          placeholder="Create your notes here"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmitNote}
            disabled={isSubmitting || !newNote.trim()}
          >
            <button className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Save Note"}
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            {/* Question Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg text-gray-900 mb-1">{note.content}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Created: {new Date(note.createdAt).toLocaleString()}
                    </span>
                    <span className="text-gray-300">•</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotesSection;
