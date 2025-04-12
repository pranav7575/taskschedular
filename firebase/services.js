import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

// User Operations
export const createUserProfile = async (userId, userData) => {
  await addDoc(collection(db, 'users'), {
    userId,
    ...userData,
    createdAt: serverTimestamp()
  });
};

export const getUserProfile = async (userId) => {
  const q = query(collection(db, 'users'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0]?.data();
};

// Task Operations
// export const addTask = async (taskData) => {
//   return await addDoc(collection(db, 'tasks'), {
//     ...taskData,
//     createdAt: serverTimestamp(),
//     updatedAt: serverTimestamp()
//   });
// };

// export const getTasks = async (userId, filters = {}) => {
//   let q = query(collection(db, 'tasks'), where('userId', '==', userId));

//   if (filters.status) {
//     q = query(q, where('status', '==', filters.status));
//   }
//   if (filters.priority) {
//     q = query(q, where('priority', '==', filters.priority));
//   }
//   if (filters.dueDate) {
//     q = query(q, where('dueDate', '==', filters.dueDate));
//   }
//   if (filters.projectId) {
//     q = query(q, where('projectId', '==', filters.projectId));
//   }

//   q = query(q, orderBy('createdAt', 'desc'));
  
//   const querySnapshot = await getDocs(q);
//   return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

export const updateTask = async (taskId, taskData) => {
  await updateDoc(doc(db, 'tasks', taskId), {
    ...taskData,
    updatedAt: serverTimestamp()
  });
};

export const deleteTask = async (taskId) => {
  await deleteDoc(doc(db, 'tasks', taskId));
};

// Project Operations
export const addProject = async (projectData) => {
  return await addDoc(collection(db, 'projects'), {
    ...projectData,
    createdAt: serverTimestamp()
  });
};

export const getProjects = async (userId) => {
  const q = query(collection(db, 'projects'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateProject = async (projectId, projectData) => {
  await updateDoc(doc(db, 'projects', projectId), projectData);
};

export const deleteProject = async (projectId) => {
  await deleteDoc(doc(db, 'projects', projectId));
};

// Team Operations
export const addTeamMember = async (teamData) => {
  return await addDoc(collection(db, 'team'), {
    ...teamData,
    createdAt: serverTimestamp()
  });
};

export const getTeamMembers = async (userId) => {
  const q = query(collection(db, 'team'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTeamMember = async (memberId, memberData) => {
  try {
    const memberRef = doc(db, 'teamMembers', memberId);
    await updateDoc(memberRef, {
      ...memberData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating team member: ", error);
    throw error;
  }
};

export const deleteTeamMember = async (memberId) => {
  try {
    const memberRef = doc(db, 'teamMembers', memberId);
    await deleteDoc(memberRef);
  } catch (error) {
    console.error("Error deleting team member: ", error);
    throw error;
  }
};



// Add these new functions for notifications
export const createNotification = async (notificationData) => {
  return await addDoc(collection(db, 'notifications'), {
    ...notificationData,
    read: false,
    createdAt: serverTimestamp()
  });
};

export const markNotificationAsRead = async (notificationId) => {
  await updateDoc(doc(db, 'notifications', notificationId), {
    read: true,
    readAt: serverTimestamp()
  });
};

// Enhanced task operations
export const addTask = async (taskData) => {
  const taskRef = await addDoc(collection(db, 'tasks'), {
    ...taskData,
    status: taskData.status || 'todo', // Default status
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Create notification if task is assigned
  if (taskData.assigneeId && taskData.assigneeId !== taskData.createdBy) {
    await createNotification({
      type: 'task_assigned',
      taskId: taskRef.id,
      recipientId: taskData.assigneeId,
      senderId: taskData.createdBy,
      message: `New task assigned: ${taskData.title}`
    });
  }

  return taskRef;
};

export const updateTaskStatus = async (taskId, newStatus, userId) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    status: newStatus,
    updatedAt: serverTimestamp()
  });

  // Get current task data
  const taskSnap = await getDoc(taskRef);
  const task = taskSnap.data();

  // Create notification for status change
  if (task.assigneeId && task.createdBy) {
    const notifyUserId = newStatus === 'completed' ? task.createdBy : task.assigneeId;
    await createNotification({
      type: 'task_status_changed',
      taskId,
      recipientId: notifyUserId,
      senderId: userId,
      message: `Task status changed to ${newStatus}: ${task.title}`
    });
  }
};

// Enhanced getTasks to include assigned tasks
export const getTasks = async (userId, filters = {}) => {
  let q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId)
  );

  // Add filter for assigned tasks
  if (filters.assignedToMe) {
    q = query(q, where('assigneeId', '==', userId));
  }

  // Existing filters...
  if (filters.status) {
    q = query(q, where('status', '==', filters.status));
  }
  // ... keep other existing filters

  q = query(q, orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add this to get notifications
export const getUserNotifications = async (userId) => {
  const q = query(
    collection(db, 'notifications'),
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};