import { useEffect } from 'react';

import TablePage from '@/components/ui/TablePage/TablePage';
import useUserStore from '@/stores/user.store';
import { User } from '@/types/user.type';
import { columns } from './columns';
import UserModal from './user-modal';

const Users = () => {
  const { users, loading, fetchUsers } = useUserStore();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    loadUsers();
  }, [fetchUsers]);

  return (
    <TablePage<User> title="Quản lý người dùng" data={users} columns={columns} Modal={UserModal} loading={loading} />
  );
};

export default Users;
