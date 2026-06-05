import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, getDocs, doc, updateDoc, query } from 'firebase/firestore';
import path from 'path';
import { promises as fs } from 'fs';

const MOCK_DB_PATH = path.join(process.cwd(), 'lib', 'mock_users_db.json');

// Check if Firebase configuration is using dummy values
const isDummyFirebase = 
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy_api_key" ||
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "dummy_project_id";

// Helper to read local mock users file
async function readMockUsers() {
  try {
    const data = await fs.readFile(MOCK_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading mock users file, returning empty array', err);
    return [];
  }
}

// Helper to write local mock users file
async function writeMockUsers(users) {
  await fs.writeFile(MOCK_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
}

// Authorization check helper
function checkAuth(request) {
  const authHeader = request.headers.get('authorization');
  return authHeader === 'Bearer mock-admin-token-12345';
}

export async function GET(request) {
  // Authorization verification
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // If Firebase config is dummy, read from local mock database file
    if (isDummyFirebase) {
      const users = await readMockUsers();
      // Filter out hard-deleted users (if any)
      const activeUsers = users.filter(u => !u.deleted);
      return NextResponse.json({ users: activeUsers });
    }

    // Otherwise use real Firestore
    const usersCol = collection(db, 'users');
    const q = query(usersCol);
    const snapshot = await getDocs(q);
    const users = [];
    snapshot.forEach(d => {
      const data = d.data();
      if (!data.deleted) {
        users.push({ id: d.id, ...data });
      }
    });
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request) {
  // Authorization verification
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, userId, role, reason } = body;
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    // Handle local mock DB write back
    if (isDummyFirebase) {
      const users = await readMockUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const user = users[userIndex];

      if (action === 'delete') {
        user.deleted = true;
        user.deletedAt = new Date().toISOString();
        await writeMockUsers(users);
        return NextResponse.json({ ok: true });
      }

      if (action === 'toggleStatus') {
        const isCurrentlySuspended = user.status === 'suspended' || user.suspended === true;
        user.suspended = !isCurrentlySuspended;
        user.status = !isCurrentlySuspended ? 'suspended' : 'active';
        user.suspendedReason = !isCurrentlySuspended ? (reason || 'Violating behavior guidelines') : null;
        user.suspendedAt = !isCurrentlySuspended ? new Date().toISOString() : null;
        await writeMockUsers(users);
        return NextResponse.json({ ok: true, suspended: user.suspended });
      }

      if (action === 'changeRole') {
        if (!role) return NextResponse.json({ error: 'role required' }, { status: 400 });
        user.role = role;
        await writeMockUsers(users);
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: 'unknown action' }, { status: 400 });
    }

    // Firestore path
    const userRef = doc(db, 'users', userId);

    if (action === 'delete') {
      await updateDoc(userRef, { deleted: true, deletedAt: new Date().toISOString() });
      return NextResponse.json({ ok: true });
    }

    if (action === 'toggleStatus') {
      const { getDoc } = await import('firebase/firestore');
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) return NextResponse.json({ error: 'not found' }, { status: 404 });
      const data = snapshot.data();
      const isSuspended = data?.suspended === true;
      
      await updateDoc(userRef, { 
        suspended: !isSuspended,
        status: !isSuspended ? 'suspended' : 'active',
        suspendedReason: !isSuspended ? (reason || 'Violating behavior guidelines') : null,
        suspendedAt: !isSuspended ? new Date().toISOString() : null
      });
      return NextResponse.json({ ok: true, suspended: !isSuspended });
    }

    if (action === 'changeRole') {
      if (!role) return NextResponse.json({ error: 'role required' }, { status: 400 });
      await updateDoc(userRef, { role });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
