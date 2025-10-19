import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

const TicketModal = ({ open, onClose, ticket, onUpdate, isAdmin }) => {
  if (!open || !ticket) return null;

  const { token } = useAuth();
  const [status, setStatus] = useState(ticket.status);
  const [response, setResponse] = useState(ticket.response || '');

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('Only admins can update tickets');
      return;
    }
    try {
      const updatedTicket = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/support/${ticket._id}`,
        { status, response },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(updatedTicket.data.supportTicket);
      toast.success('Ticket updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const handleDelete = async () => {
    if (!isAdmin && ticket.userId?._id !== useAuth().user?._id) {
      toast.error('You can only delete your own tickets');
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/support/${ticket._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(null);
      onClose();
      toast.success('Ticket deleted successfully');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  const formatDateWithDay = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{ticket.query.substring(0, 30)}...</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out"
            aria-label="Close ticket modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 text-gray-600 text-sm">
          <div className="flex items-center">
            <span className="font-medium w-28">Student:</span>
            <span>{ticket.userId?.name || 'Unknown'}</span>
          </div>
          {ticket.courseId && (
            <div className="flex items-center">
              <span className="font-medium w-28">Course:</span>
              <span>{ticket.courseId.title}</span>
            </div>
          )}
          <div className="flex items-center">
            <span className="font-medium w-28">Date Created:</span>
            <span>{formatDateWithDay(ticket.createdAt)}</span>
          </div>
          <div>
            <span className="font-medium block mb-1">Query:</span>
            <p className="p-3 bg-gray-100 rounded-md border border-gray-200 text-gray-800">{ticket.query}</p>
          </div>
          <div>
            <span className="font-medium block mb-1">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!isAdmin}
              className="w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-sm disabled:bg-gray-100 disabled:text-gray-500"
              aria-label="Ticket status"
            >
              <option value="open">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <span className="font-medium block mb-1">Response:</span>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              disabled={!isAdmin}
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-sm disabled:bg-gray-100 disabled:text-gray-500"
              aria-label="Ticket response"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          {(isAdmin || ticket.userId?._id === useAuth().user?._id) && (
            <button
              onClick={handleDelete}
              className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-2 rounded-full text-sm font-semibold hover:bg-red-200 hover:scale-105 transition-all duration-200"
              aria-label="Delete ticket"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all duration-200"
            aria-label="Close modal"
          >
            Close
          </button>
          {isAdmin && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              aria-label="Save ticket changes"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketModal;