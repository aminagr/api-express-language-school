
import supabase from '../config/db.js';

export const fetchGroups = async (req, res) => {
  try {

    const { data: levels, error: levelsError } = await supabase.from('levels').select('*');
    const { data: rooms, error: roomsError } = await supabase.from('rooms').select('*');
    const { data: sessions, error: sessionsError } = await supabase.from('sessions').select('*');
    const { data: groups, error: groupsError } = await supabase.from('groups').select('*');

    if (levelsError || roomsError || sessionsError || groupsError) {
      return res.status(400).json({ message: 'Error fetching data' });
    }

    const groupSessions = await Promise.all(groups.map(async (group) => {
      const groupSessionData = await supabase
        .from('group_sessions')
        .select('*')
        .eq('group_id', group.id);
      
      const groupSessionsFormatted = groupSessionData.data.map(session => ({
        day: session.day,
        start_time: session.start_time,
        end_time: session.end_time,
        room_name: rooms.find(room => room.id === session.room_id)?.name,
      }));

      return {
        id: group.id,
        group_name: group.group_name,
        level: levels.find(level => level.id === group.level_id)?.name,
        sessions_per_week: group.sessions_per_week,
        sessions: groupSessionsFormatted,
        session_name: sessions.find(session => session.id === group.session_id)?.session_name,
      };
    }));

    res.json(groupSessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addGroup = async (req, res) => { 
  const { group_name, level_id, sessions_per_week, session_id, group_sessions } = req.body;

  try {

    const { data, error: groupError } = await supabase
      .from('groups')
      .insert([{ group_name, level_id, sessions_per_week, session_id }])
      .select() 
      .single();

    if (groupError || !data) {
      return res.status(400).json({ message: 'Error adding group', error: groupError });
    }

    const groupId = data.id;

    if (group_sessions && group_sessions.length > 0) {
      const sessionInsertPromises = group_sessions.map(session => {
        const { day, start_time, end_time, room_id } = session;
        return supabase
          .from('group_sessions')
          .insert([{ group_id: groupId, day, start_time, end_time, room_id }]);
      });

      await Promise.all(sessionInsertPromises);
    }

    res.status(201).json({ message: 'Group added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { group_name, level_id, sessions_per_week, session_id, group_sessions } = req.body;

  try {

    const { data: updatedGroup, error: groupError } = await supabase
      .from('groups')
      .update({ group_name, level_id, sessions_per_week, session_id })
      .eq('id', id)
      .single();

    if (groupError) {
      return res.status(400).json({ message: 'Error updating group' });
    }

 
    await supabase
      .from('group_sessions')
      .delete()
      .eq('group_id', id);

    const sessionInsertPromises = group_sessions.map(session => {
      const { day, start_time, end_time, room_id } = session;
      return supabase
        .from('group_sessions')
        .insert([{ group_id: id, day, start_time, end_time, room_id }]);
    });

    await Promise.all(sessionInsertPromises);

    res.status(200).json({ message: 'Group updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
  
    const { error: sessionError } = await supabase
      .from('group_sessions')
      .delete()
      .eq('group_id', id);

    if (sessionError) {
      return res.status(400).json({ message: 'Error deleting group sessions' });
    }

 
    const { error: groupError } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);

    if (groupError) {
      return res.status(400).json({ message: 'Error deleting group' });
    }

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
