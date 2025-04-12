import Link from 'next/link';

export default function RecentTasks({ tasks }) {
  const CheckIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 text-green-500 mr-2" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M5 13l4 4L19 7" 
      />
    </svg>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No recent tasks</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {tasks.map(task => (
            <li key={task.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  {task.status === 'completed' ? (
                    <CheckIcon />
                  ) : (
                    <div className={`h-2 w-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-indigo-500'
                    } mr-3`} />
                  )}
                  <div className="truncate">
                    <p className={`text-sm truncate ${
                      task.status === 'completed' ? 
                      'line-through text-gray-500 dark:text-gray-500' : 
                      'text-gray-800 dark:text-gray-200'
                    }`}>
                      {task.title}
                    </p>
                    {task.assignedTo && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {task.assignedTo.name}
                      </p>
                    )}
                  </div>
                </div>
                {task.dueDate && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="text-right">
        <Link 
          href="/tasks" 
          className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View all tasks →
        </Link>
      </div>
    </div>
  );
}