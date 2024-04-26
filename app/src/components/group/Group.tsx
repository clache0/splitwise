import GroupNavbar from "./GroupNavbar"
import { useEffect, useState } from 'react';
import config from '../../../config.json'

export type Member = {
  _id: string;
};

export type Group = {
  name: string;
  members: Member[];
};



const Group = () => {
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

  return (
    <>
      <h1>Group</h1>
      <GroupNavbar group={group} loading={loading} error={error}/>
    </>
  )
}

export default Group;