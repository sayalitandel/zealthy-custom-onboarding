import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../utils/api';

export default function DataPage() {
  const [rows, setRows] = useState([]);
  // useEffect(() => { (async () => setRows(await getAllUsers()))(); }, []);
  useEffect(() => {
  (async () => {
    try {
      const data = await getAllUsers();                      
      const list = Array.isArray(data) ? data : (data?.users ?? []);
      setRows(list);                                          
    } catch (e) {
      console.error(e);
      setRows([]);                                            
    }
  })();
}, []);
  return (
    <div className="data-card">
      <h2> User Data</h2>
      <div className="table-wrap">
        <table className="data-table">
          <colgroup>
            <col style={{ width: '22%' }} />  {/* Email */}
            <col style={{ width: '34%' }} />  {/* About Me */}
            <col style={{ width: '12%' }} />  {/* Birthdate */}
            <col style={{ width: '18%' }} />  {/* Street Address */}
            <col style={{ width: '12%' }} />  {/* City */}
            <col style={{ width: '10%'  }} />  {/* State */}
            <col style={{ width: '10%' }} />  {/* ZIP */}
          </colgroup>
          <thead>
            <tr>
              <th>Email</th>
              <th>About Me</th>
              <th>Birthdate</th>
              <th>Street Address</th>
              <th>City</th>
              <th>State</th>
              <th>ZIP</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  No users yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="emailCell">{r.email}</td>
                  <td className="aboutMeCell">{r.aboutMe || ""}</td>{" "}
                  <td className="birthdateCell">{r.birthdate || ""}</td>
                  <td className="streetCell">{r.UserAddress?.street || ""}</td>
                  <td className="cityCell">{r.UserAddress?.city || ""}</td>
                  <td className="stateCell">{r.UserAddress?.state || ""}</td>
                  <td>{r.UserAddress?.zip || ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
