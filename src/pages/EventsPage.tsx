import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { FileImageUpload } from '../components/FileImageUpload/FileImageUpload';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../services/eventsService';
import type { Event } from '../types/Event';

export function EventsPage() {
  const { addToast } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event> & { imageFile?: File | null }>({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    getEvents()
      .then(setEvents)
      .catch(() => addToast('Unable to load events', 'error'))
      .finally(() => setLoading(false));
  };
  const filteredEvents = events.filter(
    (e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        shortDesc: event.shortDesc,
        fullDesc: event.fullDesc,
        image: event.image || '',
        publishDate: event.publishDate,
        terminationDate: event.terminationDate
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        shortDesc: '',
        fullDesc: '',
        image: '',
        publishDate: new Date().toISOString().split('T')[0],
        terminationDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.terminationDate) {
      addToast('Title and termination date are required', 'error');
      return;
    }

    try {
      if (editingEvent) {
        const updated = await updateEvent(editingEvent.id, {
          ...formData,
          imageFile: formData.imageFile ?? null
        });
        setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? updated : e)));
        addToast('Event updated successfully', 'success');
      } else {
        const created = await createEvent({
          ...formData,
          imageFile: formData.imageFile ?? null
        } as Omit<Event, 'id'> & { imageFile?: File | null });
        setEvents((prev) => [created, ...prev]);
        addToast('Event created successfully', 'success');
      }
      setIsModalOpen(false);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to save event', 'error');
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete);
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete));
      addToast('Event deleted successfully', 'success');
      setEventToDelete(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to delete event', 'error');
    }
  };
  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage upcoming and past events.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white">
          
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search events..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Loading events...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No events found.
                  </td>
                </tr>
              ) : filteredEvents.map((event) =>
              <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {event.image ?
                    <img
                      src={event.image}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover mr-3" /> :


                    <div className="h-10 w-10 rounded-md bg-indigo-50 flex items-center justify-center mr-3 text-indigo-500">
                          <Calendar className="w-5 h-5" />
                        </div>
                    }
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                          {event.shortDesc}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Pub: {new Date(event.publishDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      End:{' '}
                      {new Date(event.terminationDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isExpired(event.terminationDate) ?
                  <Badge variant="neutral">Past Event</Badge> :

                  <Badge variant="success">Active</Badge>
                  }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(event)}
                      className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50">
                      
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEventToDelete(event.id);
                        setIsDeleteOpen(true);
                      }}
                      className="text-rose-600 hover:text-rose-900 hover:bg-rose-50">
                      
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
        size="xl">
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <Input
              value={formData.title || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value
                }))
              } />
            
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date
              </label>
              <Input
                type="date"
                value={formData.publishDate || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    publishDate: e.target.value
                  }))
                } />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Termination Date
              </label>
              <Input
                type="date"
                value={formData.terminationDate || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    terminationDate: e.target.value
                  }))
                } />
              
            </div>
          </div>
          <Textarea
            label="Short Description"
            value={formData.shortDesc || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shortDesc: e.target.value
              }))
            }
            rows={2} />
          
          <Textarea
            label="Full Description"
            value={formData.fullDesc || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                fullDesc: e.target.value
              }))
            }
            rows={4} />
          
          <FileImageUpload
            label="Event Image"
            value={formData.image || ''}
            onChange={(file) => {
              setFormData((prev) => ({
                ...prev,
                image: file ? URL.createObjectURL(file) : '',
                imageFile: file
              }));
            }} />
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Event</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone." />
      
    </div>);

}