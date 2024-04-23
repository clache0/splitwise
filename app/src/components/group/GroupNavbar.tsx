import { useEffect, useState } from 'react';
import config from '../../../config.json'

const GroupNavbar = () => {
    const serverUrl = config.serverUrl + '/groups' + '/662306fcc4de419f942fc418';

    const [group, setGroup] = useState(null);

    useEffect(() => {
        fetch(serverUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch data');
            })
            .then(data => {
                setGroup(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);



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