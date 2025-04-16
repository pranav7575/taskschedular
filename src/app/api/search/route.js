import { getTasks } from '../../../../firebase/services';
import { getServerSession } from 'next-auth';
// import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  try {
    const tasks = await getTasks(session.user.id);
    const filteredTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
    );

    return Response.json(filteredTasks);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}