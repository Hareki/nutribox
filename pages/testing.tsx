import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const Testing: NextPage = () => {
  const { data, status, update } = useSession();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const onSubmit = async () => {
    console.log('run');
    const result = await signIn('credentials', {
      redirect: false,
      email: 'admin@gmail.com',
      password: '123456',
      userType: 'employee',
    });

    console.log('result:', result);
  };
  return (
    <div>
      <button onClick={onSubmit}>Testing</button>
    </div>
  );
};

export default Testing;
