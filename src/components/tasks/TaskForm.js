'use client';
import { useState, useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTeam } from '../../hooks/useTeam';
import Button from '../ui/Button';

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const reminderOptions = [
  { value: '0', label: 'None' },
  { value: '15', label: '15 minutes before' },
  { value: '30', label: '30 minutes before' },
  { value: '60', label: '1 hour before' },
  { value: '1440', label: '1 day before' },
  { value: 'custom', label: 'Custom time' }
];

export default function TaskForm({ onSubmit, initialValues, onCancel }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [dueDate, setDueDate] = useState(initialValues.dueDate || '');
  const [dueTime, setDueTime] = useState(initialValues.dueTime || '');
  const [priority, setPriority] = useState(initialValues.priority || 'medium');
  const [projectId, setProjectId] = useState(initialValues.projectId || '');
  const [assignedTo, setAssignedTo] = useState(initialValues.assignedTo || '');
  const [reminderOption, setReminderOption] = useState(initialValues.reminderOption || '0');
  const [customReminderMinutes, setCustomReminderMinutes] = useState(initialValues.customReminderMinutes || '');
  const [showCustomReminder, setShowCustomReminder] = useState(false);
  
  const { projects } = useProjects();
  const { team } = useTeam();

  useEffect(() => {
    setShowCustomReminder(reminderOption === 'custom');
  }, [reminderOption]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine date and time for deadline
    const deadline = dueDate && dueTime ? `${dueDate}T${dueTime}:00` : dueDate;
    
    // Calculate reminder time
    let reminderMinutesBefore = 0;
    if (reminderOption === 'custom') {
      reminderMinutesBefore = parseInt(customReminderMinutes) || 0;
    } else {
      reminderMinutesBefore = parseInt(reminderOption) || 0;
    }

    onSubmit({
      title,
      description,
      dueDate: deadline,
      priority,
      projectId: projectId || null,
      assignedTo: assignedTo || null,
      status: initialValues.status || 'pending',
      reminderMinutesBefore,
      ...(initialValues.id && { id: initialValues.id })
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {initialValues.id ? 'Edit Task' : 'Add New Task'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title*</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date*</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Time</label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority*</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reminder</label>
          <select
            value={reminderOption}
            onChange={(e) => setReminderOption(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {reminderOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {showCustomReminder && (
            <div className="mt-2">
              <input
                type="number"
                min="1"
                value={customReminderMinutes}
                onChange={(e) => setCustomReminderMinutes(e.target.value)}
                placeholder="Minutes before deadline"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">No Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        )}

        {team?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign To</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Unassigned</option>
              {team.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialValues.id ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
}