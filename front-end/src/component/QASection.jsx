import { useState } from "react";
import axios from "axios";
import { MessageCircle, ThumbsUp, User, Send } from "lucide-react";
import BasicModal from "./BasicModal";
import toast from "react-hot-toast";

const QASection = ({ questions, courseId, userId }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:8080/api/questions/${courseId}`, {
      // await axios.post(
      //   `${import.meta.env.VITE_BACKEND_URL}/api/questions/${courseId}`,
      //   {
          content: newQuestion,
          courseId,
          userId,
        }
      );
      setNewQuestion("");
      toast.success(
        "Your question has been successfully recorded. Our team will reach out to you shortly."
      );
    } catch (error) {
      toast.error("Failed to submit your question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6">Questions & Answers</h3>

      {/* Question Input Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[100px]"
          placeholder="Ask a question..."
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmitQuestion}
            disabled={isSubmitting || !newQuestion.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Ask Question"}
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div
            key={question.id}
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
                  <p className="text-lg text-gray-900 mb-1">
                    {question.content}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Asked by {question.user.userName}
                    </span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <BasicModal courseId={courseId} userId={userId}>
                        <MessageCircle className="w-4 h-4 mr-1 cursor-pointer" />
                      </BasicModal>
                      {question.answers.length} answers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers Section */}
            <div className="divide-y divide-gray-100">
              {question.answers.map((answer) => (
                <div key={answer.id} className="p-4 bg-gray-50">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 mb-1">{answer.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Answered by {answer.user.email}
                        </span>
                        <button className="flex items-center text-sm text-gray-500 hover:text-purple-500 transition-colors">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QASection;
