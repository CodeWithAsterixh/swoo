import React from 'react';
import Link from 'next/link';

const Dashboard: React.FC = () => {
  const demoId = 'demo-project';

  return (
    <main style={{padding: 24}}>
      <h1>Business Card Editor</h1>
      <p>Projects dashboard</p>
      <ul>
        <li>
          <Link href={`/business-card-editor/editor/${demoId}`}>
            Open Demo Project
          </Link>
        </li>
      </ul>
    </main>
  );
};

export default Dashboard;
