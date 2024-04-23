import { useEffect, useState } from 'react';
import config from '../../../config.json'

const GroupNavbar = () => {
  const serverUrl = config.serverUrl + '/groups' + '/662306fcc4de419f942fc418';

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(serverUrl)
      .then(response => response.json())
      .then(data => {
        setGroup(data);
        setLoading(false);
      })
      .catch(error => {
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

      {group ? (
        <h1>Group Name: {group.name}</h1>
      ) : (
        <p>Loading...</p>
      )
      }
    </>
  )
}

export default GroupNavbar;