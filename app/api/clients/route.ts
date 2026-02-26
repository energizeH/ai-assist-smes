import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// GET - Fetch all clients for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the logged-in user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch clients
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ clients });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new client
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the logged-in user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, phone, company, status, notes } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create client
    const { data: client, error } = await supabase
      .from('clients')
      .insert([{
        user_id: session.user.id,
        name,
        email,
        phone: phone || null,
        company: company || null,
        status: status || 'active',
        notes: notes || null
      }])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase
      .from('activities')
      .insert([{
        user_id: session.user.id,
        type: 'client_created',
        title: 'New Client Added',
        description: `Added ${name} as a new client`,
        related_id: client.id,
        related_type: 'client'
      }]);

    return NextResponse.json({ client }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a client
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, email, phone, company, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Update client
    const { data: client, error } = await supabase
      .from('clients')
      .update({
        name,
        email,
        phone,
        company,
        status,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase
      .from('activities')
      .insert([{
        user_id: session.user.id,
        type: 'client_updated',
        title: 'Client Updated',
        description: `Updated ${name}'s information`,
        related_id: client.id,
        related_type: 'client'
      }]);

    return NextResponse.json({ client });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a client
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Get client name before deleting
    const { data: client } = await supabase
      .from('clients')
      .select('name')
      .eq('id', id)
      .single();

    // Delete client
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;

    // Log activity
    if (client) {
      await supabase
        .from('activities')
        .insert([{
          user_id: session.user.id,
          type: 'client_deleted',
          title: 'Client Deleted',
          description: `Removed ${client.name} from clients`
        }]);
    }

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
