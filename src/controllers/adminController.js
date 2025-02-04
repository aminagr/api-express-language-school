import supabase from '../config/db.js';
import bcrypt from 'bcrypt'; 


export const getAllAdmins = async (req, res) => {
  try {
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .select('*');
    
    if (adminsError) {
      return res.status(400).json({ message: 'Erreur lors de la récupération des administrateurs' });
    }

    return res.json(admins);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .single();

    if (adminError) {
      return res.status(400).json({ message: 'Erreur lors de la récupération de l\'administrateur' });
    }

    if (!admin) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    return res.json(admin);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addAdmin = async (req, res) => {
  const { email, username, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ message: 'Les champs email et password sont requis' });
  }

  try {

    const hashedPassword = await bcrypt.hash(password, 10);


    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .insert([{ email, username: username || null }]) 
      .select('*')
      .single();

    if (adminError) throw adminError;

    
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email,
        password: hashedPassword,
        role: 'admin',
        admin_id: admin.id
      }])
      .select('*')
      .single();

    if (userError) throw userError;


    res.status(201).json({ message: 'Administrateur et utilisateur ajoutés avec succès', admin, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { email, username, password } = req.body;

  try {
    let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;


    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .update({ email, username })
      .eq('id', id)
      .select('*')
      .single();

    if (adminError) throw adminError;


    const { data: user, error: userError } = await supabase
      .from('users')
      .update({ email, password: hashedPassword || undefined })
      .eq('admin_id', admin.id)
      .select('*')
      .single();

    if (userError) throw userError;

    res.json({ message: 'Administrateur et utilisateur mis à jour avec succès', admin, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {

    const { data: user, error: userError } = await supabase
      .from('users')
      .delete()
      .eq('admin_id', id);

    if (userError) throw userError;


    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    if (adminError) throw adminError;

    res.json({ message: 'Administrateur et utilisateur supprimés avec succès', admin, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};