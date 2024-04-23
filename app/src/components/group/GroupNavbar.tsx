import { useEffect, useState } from 'react';
import config from '../../../config.json'

type Group = {
  name: string;
  members: Member[];
};

type Member = {
  _id: string;
}

type Error = {
  message: string;
};

const GroupNavbar = () => {
  const serverUrl = config.serverUrl + '/groups' + '/662306fcc4de419f942fc418';

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(serverUrl)
      .then(response => response.json())
      .then((data: Group) => {
        setGroup(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Group Navbar</h1>
      <h1>Group Name: {group?.name}</h1>
    </>
  )
}

export default GroupNavbar;