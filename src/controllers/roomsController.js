import supabase from '../config/db.js';


export const getAllRooms = async (req, res) => {
  const { data, error } = await supabase.from('rooms').select('*');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};


export const createRoom = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Le nom de la salle est requis' });

  const { data, error } = await supabase.from('rooms').insert([{ name }]).select('*');
  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Le nom de la salle est requis' });

  const { data, error } = await supabase.from('rooms').update({ name }).eq('id', id).select('*');
  if (error) return res.status(500).json({ message: error.message });
  if (data.length === 0) return res.status(404).json({ message: 'Salle non trouvée' });
  res.json(data[0]);
};


export const deleteRoom = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('rooms').delete().eq('id', id).select('*');
  if (error) return res.status(500).json({ message: error.message });
  if (data.length === 0) return res.status(404).json({ message: 'Salle non trouvée' });
  res.json({ message: 'Salle supprimée avec succès' });
};
