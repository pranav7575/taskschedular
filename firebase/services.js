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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';






// User Operations
export const createUserProfile = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp()
  }, { merge: true });
};


export const updateUserProfile = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp()
  });
};

export const getUserProfile = async (userId) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};


export const updateUserProfileImage = async (userId, imageUrl) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    photoURL: imageUrl,
    updatedAt: serverTimestamp()
  });
  return imageUrl;
};



// Task Operations
export const addTask = async (taskData) => {
  const taskRef = await addDoc(collection(db, 'tasks'), {
    ...taskData,
    status: taskData.status || 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Schedule reminder if needed
  if (taskData.reminderMinutesBefore > 0 && taskData.dueDate) {
    const dueDate = new Date(taskData.dueDate);
    const reminderTime = new Date(dueDate.getTime() - taskData.reminderMinutesBefore * 60000);
    
    await addDoc(collection(db, 'reminders'), {
      taskId: taskRef.id,
      userId: taskData.userId,
      dueDate: Timestamp.fromDate(dueDate),
      reminderTime: Timestamp.fromDate(reminderTime),
      title: taskData.title,
      description: taskData.description,
      status: 'scheduled',
      createdAt: serverTimestamp()
    });
  }

  // Create notification if task is assigned
  if (taskData.assignedTo && taskData.assignedTo !== taskData.userId) {
    await createNotification({
      type: 'task_assigned',
      taskId: taskRef.id,
      recipientId: taskData.assignedTo,
      senderId: taskData.userId,
      message: `New task assigned: ${taskData.title}`
    });
  }

  return taskRef;
};

export const getTasks = async (userId, filters = {}) => {
  let q = query(collection(db, 'tasks'), where('userId', '==', userId));

  if (filters.status) {
    q = query(q, where('status', '==', filters.status));
  }
  if (filters.priority) {
    q = query(q, where('priority', '==', filters.priority));
  }
  if (filters.dueDate) {
    q = query(q, where('dueDate', '==', filters.dueDate));
  }
  if (filters.projectId) {
    q = query(q, where('projectId', '==', filters.projectId));
  }
  if (filters.assignedToMe) {
    q = query(q, where('assignedTo', '==', userId));
  }

  q = query(q, orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTask = async (taskId, taskData) => {
  await updateDoc(doc(db, 'tasks', taskId), {
    ...taskData,
    updatedAt: serverTimestamp()
  });

  // Update reminder if dueDate or reminderMinutesBefore changed
  if (taskData.dueDate || taskData.reminderMinutesBefore !== undefined) {
    // First get the current task data
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    const task = taskDoc.data();
    
    // Delete existing reminders
    const remindersQuery = query(
      collection(db, 'reminders'),
      where('taskId', '==', taskId)
    );
    const remindersSnapshot = await getDocs(remindersQuery);
    remindersSnapshot.forEach(async (reminderDoc) => {
      await deleteDoc(reminderDoc.ref);
    });

    // Create new reminder if needed
    if (task.reminderMinutesBefore > 0 && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const reminderTime = new Date(dueDate.getTime() - task.reminderMinutesBefore * 60000);
      
      await addDoc(collection(db, 'reminders'), {
        taskId: taskId,
        userId: task.userId,
        dueDate: Timestamp.fromDate(dueDate),
        reminderTime: Timestamp.fromDate(reminderTime),
        title: task.title,
        description: task.description,
        status: 'scheduled',
        createdAt: serverTimestamp()
      });
    }
  }
};

export const deleteTask = async (taskId) => {
  // First delete any associated reminders
  const remindersQuery = query(
    collection(db, 'reminders'),
    where('taskId', '==', taskId)
  );
  const remindersSnapshot = await getDocs(remindersQuery);
  remindersSnapshot.forEach(async (reminderDoc) => {
    await deleteDoc(reminderDoc.ref);
  });

  // Then delete the task
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

// Notification Operations
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

export const getUserNotifications = async (userId) => {
  const q = query(
    collection(db, 'notifications'),
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Reminder Operations
export const getPendingReminders = async () => {
  const now = new Date();
  const q = query(
    collection(db, 'reminders'),
    where('reminderTime', '<=', Timestamp.fromDate(now)),
    where('status', '==', 'scheduled')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const markReminderAsSent = async (reminderId) => {
  await updateDoc(doc(db, 'reminders', reminderId), {
    status: 'sent',
    sentAt: serverTimestamp()
  });
};