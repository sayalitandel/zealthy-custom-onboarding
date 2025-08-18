import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../utils/api';

export default function DataPage() {
  const [rows, setRows] = useState([]);
  // useEffect(() => { (async () => setRows(await getAllUsers()))(); }, []);
  useEffect(() => {
  (async () => {
    try {
      const data = await getAllUsers();                       // data may be [] or {users: []}
      const list = Array.isArray(data) ? data : (data?.users ?? []);
      setRows(list);                                          // always an array
    } catch (e) {
      console.error(e);
      setRows([]);                                            // keep it an array on error
    }
  })();
}, []);
  return (
    <div style={{padding:24}}>
      <h2>Collected Users</h2>
      <table border="1" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr>
          <th>Email</th><th>About Me</th><th>Birthdate</th>
          <th>Street</th><th>City</th><th>State</th><th>Zip</th>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.email}</td>
              <td>{r.aboutMe || ''}</td>
              <td>{r.birthdate || ''}</td>
              <td>{r.UserAddress?.street || ''}</td>
              <td>{r.UserAddress?.city || ''}</td>
              <td>{r.UserAddress?.state || ''}</td>
              <td>{r.UserAddress?.zip || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
