import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';

// NOTE: These endpoints assume your deployment protects the admin area.
// For production, add an authorization check here (custom header, session, or Firebase Admin SDK).

export async function GET() {
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol);
    const snapshot = await getDocs(q);
    const users = [];
    snapshot.forEach(d => {
      users.push({ id: d.id, ...d.data() });
    });
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, userId, role } = body;
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const userRef = doc(db, 'users', userId);

    if (action === 'delete') {
      // Soft-delete: mark deleted flag. Removing Firebase Auth user requires firebase-admin.
      await updateDoc(userRef, { deleted: true, deletedAt: new Date().toISOString() });
      return NextResponse.json({ ok: true });
    }

    if (action === 'toggleStatus') {
      const { getDoc } = await import('firebase/firestore');
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) return NextResponse.json({ error: 'not found' }, { status: 404 });
      const data = snapshot.data();
      const isSuspended = data?.suspended === true;
      await updateDoc(userRef, { suspended: !isSuspended });
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
