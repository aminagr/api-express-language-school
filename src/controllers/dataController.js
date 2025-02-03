import supabase from '../config/db.js';



export const getAllGroups = async (req, res) => {
  const { data, error } = await supabase.from('groups').select('*');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

export const getAllRegistrations = async (req, res) => {
  const { data, error } = await supabase.from('registrations').select('*');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};



export const fetchLatestSession = async () => {
  const { data, error } = await supabase.from('sessions').select('*').order('start_date', { ascending: false }).limit(1);
  if (error) throw new Error(error.message);
  return data[0];
};

export const fetchGroupsForLatestSession = async () => {
  const latestSession = await fetchLatestSession();
  const { data, error } = await supabase.from('groups').select('*').eq('session_id', latestSession.id);
  if (error) throw new Error(error.message);
  return data;
};


export const getLatestSession = async (req, res) => {
  try {
    const latestSession = await fetchLatestSession();
    res.json(latestSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getGroupsForLatestSession = async (req, res) => {
  try {
    const groups = await fetchGroupsForLatestSession();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
