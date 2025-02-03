import supabase from '../config/db.js';


export const getAllSessions = async (req, res) => {
  const { data, error } = await supabase.from('sessions').select('*');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};


export const createSession = async (req, res) => {
  const { session_name, start_date, end_date, registration_start_date, registration_end_date } = req.body;

  if (!session_name || !start_date || !end_date || !registration_start_date || !registration_end_date) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  const { data, error } = await supabase.from('sessions').insert([{
    session_name,
    start_date,
    end_date,
    registration_start_date,
    registration_end_date
  }]).select('*');

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

export const updateSession = async (req, res) => {
    const { id } = req.params;
    const { session_name, start_date, end_date, registration_start_date, registration_end_date } = req.body;
  

    const updatedFields = {};
  
    if (session_name) updatedFields.session_name = session_name;
    if (start_date) updatedFields.start_date = start_date;
    if (end_date) updatedFields.end_date = end_date;
    if (registration_start_date) updatedFields.registration_start_date = registration_start_date;
    if (registration_end_date) updatedFields.registration_end_date = registration_end_date;
  
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: 'Au moins un champ doit être fourni pour la mise à jour' });
    }
  
    const { data, error } = await supabase.from('sessions')
      .update(updatedFields)  
      .eq('id', id)           
      .select('*');
  
    if (error) return res.status(500).json({ message: error.message });
    if (data.length === 0) return res.status(404).json({ message: 'Session non trouvée' });
  
    res.json(data[0]);
  };
  

export const deleteSession = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('sessions').delete().eq('id', id).select('*');
  if (error) return res.status(500).json({ message: error.message });
  if (data.length === 0) return res.status(404).json({ message: 'Session non trouvée' });
  res.json({ message: 'Session supprimée avec succès' });
};
