import supabase from '../config/db.js';


export const getAllLevels = async (req, res) => {
  const { data, error } = await supabase.from('levels').select('*');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};


export const createLevel = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Le nom est requis' });

  const { data, error } = await supabase.from('levels').insert([{ name }]).select('*');
  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

export const updateLevel = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Le nom est requis' });

  const { data, error } = await supabase.from('levels').update({ name }).eq('id', id).select('*');
  if (error) return res.status(500).json({ message: error.message });
  if (data.length === 0) return res.status(404).json({ message: 'Niveau non trouvé' });
  res.json(data[0]);
};


export const deleteLevel = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('levels').delete().eq('id', id).select('*');
  if (error) return res.status(500).json({ message: error.message });
  if (data.length === 0) return res.status(404).json({ message: 'Niveau non trouvé' });
  res.json({ message: 'Niveau supprimé avec succès' });
};
