'use client';
import { useState, useEffect } from 'react';
import { useTeam } from '../../hooks/useTeam';
import MemberCard from '../../components/team/MemberCard';
import TeamForm from '../../components/team/TeamForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Team() {
  const { team, loading, addMember, updateMember, deleteMember } = useTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <div className={`p-4 space-y-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Team Members</h1>
        <Button 
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          className="flex items-center text-sm md:text-base"
        >
          <PlusIcon className="h-4 w-4 md:h-5 md:w-5 mr-1" />
          <span className="hidden sm:inline">Add Member</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Team stats summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-xl font-bold text-blue-700">{team.length}</span>
            <span className="text-sm text-gray-600">Total Members</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
            <span className="text-xl font-bold text-green-700">
              {team.filter(member => member.role === 'admin').length}
            </span>
            <span className="text-sm text-gray-600">Admins</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
            <span className="text-xl font-bold text-purple-700">
              {team.filter(member => member.status === 'active').length}
            </span>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
            <span className="text-xl font-bold text-amber-700">
              {team.filter(member => member.projects && member.projects.length > 0).length}
            </span>
            <span className="text-sm text-gray-600">On Projects</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

      {!loading && team.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <UserGroupIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No team members yet</p>
          <p className="text-gray-500 mt-1 max-w-md">
            Start building your team by adding members using the Add Member button
          </p>
          <Button 
            onClick={() => {
              setEditingMember(null);
              setIsModalOpen(true);
            }}
            className="mt-4"
          >
            Add First Member
          </Button>
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