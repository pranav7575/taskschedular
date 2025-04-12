'use client';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday } from 'date-fns';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';

const priorityIcons = {
  high: (
    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  ),
  medium: (
    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  ),
  low: (
    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
};

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus, teamMembers, compact = false }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const assignedMember = teamMembers?.find(member => member.id === task.assignedTo);

  return (
    <div className={`bg-white rounded-lg shadow ${compact ? 'p-1' : 'p-2 sm:p-4'} border-l-4 ${
      task.status === 'completed' ? 'border-green-500' : 'border-indigo-500'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`${compact ? 'text-xs' : 'text-sm sm:text-base'} font-medium ${
            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
          }`}>
            {task.title}
          </h3>
          {!compact && task.description && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          {!compact && assignedMember && (
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {assignedMember.name}
            </div>
          )}
        </div>
        
        {!compact && (
          <Dropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            trigger={
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            }
          >
            <button
              onClick={() => {
                onEdit();
                setIsDropdownOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsDropdownOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </Dropdown>
        )}
      </div>

      <div className={`flex items-center justify-between ${compact ? 'mt-1' : 'mt-2 sm:mt-4'} pt-2 border-t border-gray-100`}>
        <div className="flex items-center space-x-1 sm:space-x-2">
          {task.dueDate && (
            <span className="flex items-center text-xs text-gray-500">
              <svg className="h-3 w-3 mr-0.5 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {compact ? format(new Date(task.dueDate), 'MM/dd') : new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {task.priority && (
            <span className="flex items-center text-xs">
              {priorityIcons[task.priority]}
              {!compact && <span className="ml-1 capitalize">{task.priority}</span>}
            </span>
          )}
        </div>

        {!compact && (
          <Button
            size="sm"
            variant={task.status === 'completed' ? 'secondary' : 'primary'}
            onClick={onToggleStatus}
          >
            {task.status === 'completed' ? (
              <>
                <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completed
              </>
            ) : (
              'Mark Complete'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}