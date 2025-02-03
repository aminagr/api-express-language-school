import supabase from '../config/db.js';


export const getAllStudents = async (req, res) => {
  try {

    const { data: students, error: studentsError } = await supabase.from('students').select('*');
    
    if (studentsError) {
      return res.status(400).json({ message: 'Error fetching students' });
    }

    return res.json(students);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const getStudentsByGroupId = async (req, res) => {
    const { groupId } = req.params;
  
    try {

      const { data: registrations, error: registrationsError } = await supabase.from('registrations').select('*');
      const { data: students, error: studentsError } = await supabase.from('students').select('*');
      const { data: groups, error: groupsError } = await supabase.from('groups').select('*');
  
      if (registrationsError || studentsError || groupsError) {
        return res.status(400).json({ message: 'Error fetching data' });
      }
  
      const group = groups.find((g) => g.id === parseInt(groupId));
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  

      const groupRegistrations = registrations.filter((reg) => reg.group_id === group.id);
  
      const studentDetails = groupRegistrations.map((reg) => {

        const student = students.find((student) => student.id === reg.student_id);
        
        return {
          id: student.id,
          nom: student.nom,
          prenom: student.prenom,
          matricule: student.matricule,
          confirme: reg.confirme,
        };
      });
  
      return res.json(studentDetails);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  

export const fetchStudentById = async (req, res) => {
  const { id } = req.params;

  try {

    const { data: students, error: studentsError } = await supabase.from('students').select('*');
    const { data: groups, error: groupsError } = await supabase.from('groups').select('*');
    const { data: sessions, error: sessionsError } = await supabase.from('sessions').select('*');
    const { data: registrations, error: registrationsError } = await supabase.from('registrations').select('*');
    const { data: levels, error: levelsError } = await supabase.from('levels').select('*');
    const { data: rooms, error: roomsError } = await supabase.from('rooms').select('*');

    if (studentsError || groupsError || sessionsError || registrationsError || levelsError || roomsError) {
      return res.status(400).json({ message: 'Error fetching data' });
    }

    const student = students.find(student => student.id === parseInt(id));

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentGroups = registrations
      .filter(reg => reg.student_id === student.id)
      .map(reg => {
        const group = groups.find(g => g.id === reg.group_id);
        const session = sessions.find(s => s.id === reg.session_id);
        const level = levels.find(l => l.id === reg.level_id);
        return {
          group_name: group?.group_name,
          session_name: session?.session_name,
          level_name: level?.name,
          confirmed: reg.confirme
        };
      });

    return res.json({
      id: student.id,
      matricule: student.matricule,
      nom: student.nom,
      prenom: student.prenom,
      date_naissance: student.date_naissance,
      lieu_naissance: student.lieu_naissance,
      adresse: student.adresse,
      telephone: student.telephone,
      mail: student.mail,
      type: student.type,
      groups: studentGroups
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const addStudent = async (req, res) => {
  const {
    matricule,
    nom,
    prenom,
    date_naissance,
    lieu_naissance,
    adresse,
    telephone,
    mail,
    type,
    usertype,
    genre,
    password
  } = req.body;

  if (!matricule || !nom || !prenom || !date_naissance || !lieu_naissance || !adresse || !telephone || !mail || !type || !usertype || !genre || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {

    const hashedPassword = await bcrypt.hash(password, 10);


    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert([{
        matricule,
        nom,
        prenom,
        date_naissance,
        lieu_naissance,
        adresse,
        telephone,
        mail,
        type,
        usertype,
        genre,
        password: hashedPassword
      }])
      .select('*')
      .single();

    if (studentError) throw studentError;


    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email: mail,
        password: hashedPassword,
        role: 'student',
        student_id: student.id
      }])
      .select('*')
      .single();

    if (userError) throw userError;

    res.status(201).json({ message: 'Étudiant et utilisateur ajoutés avec succès', student, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    matricule,
    nom,
    prenom,
    date_naissance,
    lieu_naissance,
    adresse,
    telephone,
    mail,
    type,
    usertype,
    genre,
    password
  } = req.body;

  try {

    if (!matricule || !nom || !prenom || !date_naissance || !lieu_naissance || !adresse || !telephone || !mail || !type || !usertype || !genre) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    
    let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;


    const { data: student, error: studentError } = await supabase
      .from('students')
      .update({
        matricule,
        nom,
        prenom,
        date_naissance,
        lieu_naissance,
        adresse,
        telephone,
        mail,
        type,
        usertype,
        genre,
        password: hashedPassword || undefined 
      })
      .eq('id', id)
      .select('*')
      .single();

    if (studentError) throw studentError;

  
    const { data: user, error: userError } = await supabase
      .from('users')
      .update({
        email: mail,
        password: hashedPassword || undefined
      })
      .eq('student_id', student.id)
      .select('*')
      .single();

    if (userError) throw userError;

    res.json({ message: 'Étudiant et utilisateur mis à jour avec succès', student, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
  
    const { data: user, error: userError } = await supabase
      .from('users')
      .delete()
      .eq('student_id', id);

    if (userError) throw userError;


    const { data: student, error: studentError } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (studentError) throw studentError;

    res.json({ message: 'Étudiant et utilisateur supprimés avec succès', student, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};