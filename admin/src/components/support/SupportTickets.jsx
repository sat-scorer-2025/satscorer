import React, { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import TicketModal from './TicketModal';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { TicketIcon } from '@heroicons/react/24/outline';

const SupportTickets = () => {
  const { tickets, setTickets, isAdmin } = useOutletContext();
  const { token } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [draggedTicket, setDraggedTicket] = useState(null);

  const columns = {
    New: tickets.filter((ticket) => ticket.status === 'open'),
    'In Progress': tickets.filter((ticket) => ticket.status === 'in_progress'),
    Resolved: tickets.filter((ticket) => ticket.status === 'resolved'),
  };

  const statusToBackend = {
    New: 'open',
    'In Progress': 'in_progress',
    Resolved: 'resolved',
  };

  const handleDragStart = (e, ticket) => {
    setDraggedTicket(ticket);
    e.dataTransfer.setData('text/plain', ticket._id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Debounced API call to reduce server load
  const updateTicketStatus = useCallback(
    debounce(async (ticketId, newStatus, callback) => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/support/${ticketId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        callback(response.data.supportTicket);
        toast.success('Ticket status updated successfully');
      } catch (error) {
        toast.error('Failed to update ticket status');
      }
    }, 300),
    [token]
  );

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Only admins can change ticket status');
      return;
    }
    if (draggedTicket) {
      const backendStatus = statusToBackend[newStatus];
      // Optimistic update
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === draggedTicket._id ? { ...ticket, status: backendStatus } : ticket
        )
      );
      updateTicketStatus(draggedTicket._id, backendStatus, (updatedTicket) => {
        if (updatedTicket) {
          setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket._id === draggedTicket._id ? updatedTicket : ticket
            )
          );
        } else {
          // Revert on failure
          setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket._id === draggedTicket._id ? draggedTicket : ticket
            )
          );
        }
      });
      setDraggedTicket(null);
    }
  };

  const handleUpdateTicket = (updatedTicket) => {
    if (!updatedTicket) {
      setTickets(tickets.filter((ticket) => ticket._id !== selectedTicket._id));
      setSelectedTicket(null);
    } else {
      setTickets(tickets.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket)));
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Support Tickets</h2>
      {Object.keys(columns).length === 0 && (
        <div className="text-center py-8">
          <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600 text-lg">No tickets found.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(columns).map((status) => (
          <div
            key={status}
            className="bg-gray-100 rounded-xl p-6 min-h-[400px] border border-gray-200 shadow-sm"
            onDragOver={isAdmin ? handleDragOver : null}
            onDrop={isAdmin ? (e) => handleDrop(e, status) : null}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{status}</h3>
            <div
              className={`space-y-4 ${columns[status].length >= 5 ? 'max-h-[500px] overflow-y-auto pr-2' : ''}`}
            >
              {columns[status].length === 0 ? (
                <p className="text-gray-600 text-sm">No tickets</p>
              ) : (
                columns[status].map((ticket) => (
                  <div
                    key={ticket._id}
                    className={`bg-white rounded-md border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                      isAdmin ? 'cursor-move' : 'cursor-pointer'
                    }`}
                    draggable={isAdmin}
                    onDragStart={isAdmin ? (e) => handleDragStart(e, ticket) : null}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{ticket.query.substring(0, 30)}...</h4>
                    <p className="text-xs text-gray-600 mt-1">{ticket.userId?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-600 truncate mt-1">{ticket.query}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                    {ticket.courseId && (
                      <p className="text-xs text-gray-600 mt-1">Course: {ticket.courseId.title}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <TicketModal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onUpdate={handleUpdateTicket}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default SupportTickets;