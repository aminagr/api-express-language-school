import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supabase from '../config/db.js';


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const registerUser = async (req, res) => {
  const { role, email, password, matricule, nom, prenom, date_naissance, lieu_naissance, adresse, telephone, type, genre, username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

 
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword, role }])
      .select('*')
      .single();

    if (userError) {
      return res.status(400).json({ message: userError.message });
    }

    const userId = userData.id;

    if (role === 'student') {

      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([{ id: userId, matricule, nom, prenom, date_naissance, lieu_naissance, adresse, telephone, mail: email, type, genre }]);

      if (studentError) {
        return res.status(400).json({ message: studentError.message });
      }

     
      await supabase
        .from('users')
        .update({ student_id: userId })
        .eq('id', userId);

      return res.status(201).json({ message: 'Student registered successfully' });

    } else if (role === 'admin') {
     
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .insert([{ id: userId, email, username }]);

      if (adminError) {
        return res.status(400).json({ message: adminError.message });
      }

  
      await supabase
        .from('users')
        .update({ admin_id: userId })
        .eq('id', userId);

      return res.status(201).json({ message: 'Admin registered successfully' });

    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};