'use client';
import { useState } from 'react';
import { useTeam } from '../../hooks/useTeam';
import MemberCard from '../../components/team/MemberCard';
import TeamForm from '../../components/team/TeamForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function Team() {
  const { team, loading, addMember, updateMember, deleteMember } = useTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const handleSubmit = async (memberData) => {
    if (editingMember) {
      await updateMember(editingMember.id, memberData);
      setEditingMember(null);
    } else {
      await addMember(memberData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
        <Button onClick={() => {
          setEditingMember(null);
          setIsModalOpen(true);
        }}>
          Add Member
        </Button>
      </div>

      {loading ? (
        <div>Loading team members...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={() => {
                setEditingMember(member);
                setIsModalOpen(true);
              }}
              onDelete={() => deleteMember(member.id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TeamForm
          onSubmit={handleSubmit}
          initialValues={editingMember || {}}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}