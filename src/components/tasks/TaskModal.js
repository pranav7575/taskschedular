'use client';
import { useState, useEffect } from 'react';
import { updateTask } from '../../firebase/services';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function TaskModal({ task, onClose }) {
  const [taskData, setTaskData] = useState(task);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTaskData(task);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateTask(task.id, taskData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!task) return null;

  return (
    <Modal isOpen={!!task} onClose={onClose} title="Task Details">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            name="title"
            value={taskData.title}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            name="status"
            value={taskData.status}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}