
import supabase from '../config/db.js';

export const fetchRegistrations = async (req, res) => {
  try {
   
    const { data: students, error: studentsError } = await supabase.from('students').select('*');
    const { data: groups, error: groupsError } = await supabase.from('groups').select('*');
    const { data: sessions, error: sessionsError } = await supabase.from('sessions').select('*');
    const { data: levels, error: levelsError } = await supabase.from('levels').select('*');

    if (studentsError || groupsError || sessionsError || levelsError) {
      return res.status(400).json({ message: 'Error fetching data' });
    }

  
    const { data: registrations, error: registrationsError } = await supabase.from('registrations').select('*');
    if (registrationsError) {
      return res.status(400).json({ message: 'Error fetching registrations' });
    }

    const formattedRegistrations = registrations.map(reg => {
      const student = students.find(s => s.id === reg.student_id);
      const group = groups.find(g => g.id === reg.group_id);
      const session = sessions.find(s => s.id === reg.session_id);
      const level = levels.find(l => l.id === reg.level_id);

      return {
        id: reg.id,
        matricule: student?.matricule,
        nom_prenom: `${student?.nom} ${student?.prenom}`,
        session: session?.session_name,
        niveau: level?.name,
        groupe: group?.group_name,
        date: reg.date,
        confirme: reg.confirme,
      };
    });

    res.json(formattedRegistrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const addRegistration = async (req, res) => {
  const { student_id, session_id, level_id, group_id, date, confirme } = req.body;

  if (!student_id || !session_id || !level_id || !group_id || !date || confirme === undefined) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .insert([{ student_id, session_id, level_id, group_id, date, confirme }])
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Inscription ajoutée avec succès', data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateRegistration = async (req, res) => {
  const { id } = req.params;
  const { student_id, session_id, level_id, group_id, date, confirme } = req.body;

  try {
    const { data, error } = await supabase
      .from('registrations')
      .update({ student_id, session_id, level_id, group_id, date, confirme })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    res.json({ message: 'Inscription mise à jour avec succès', data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteRegistration = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from('registrations').delete().eq('id', id);

    if (error) throw error;

    res.json({ message: 'Inscription supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};