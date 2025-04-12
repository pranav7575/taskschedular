import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../../firebase/services';

export function useTeam() {
  const { currentUser } = useAuth();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchTeam = async () => {
      setLoading(true);
      const team = await getTeamMembers(currentUser.uid);
      setTeam(team);
      setLoading(false);
    };

    fetchTeam();
  }, [currentUser]);

  const handleAddMember = async (memberData) => {
    const newMember = await addTeamMember({
      ...memberData,
      userId: currentUser.uid
    });
    setTeam([...team, { id: newMember.id, ...memberData }]);
  };

  const handleUpdateMember = async (memberId, memberData) => {
    await updateTeamMember(memberId, memberData);
    setTeam(team.map(member => 
      member.id === memberId ? { ...member, ...memberData } : member
    ));
  };

  const handleDeleteMember = async (memberId) => {
    await deleteTeamMember(memberId);
    setTeam(team.filter(member => member.id !== memberId));
  };

  return {
    team,
    loading,
    addMember: handleAddMember,
    updateMember: handleUpdateMember,
    deleteMember: handleDeleteMember
  };
}