import supabase from '../config/db.js';
import { fetchGroupsForLatestSession, fetchLatestSession } from './dataController.js';
export const getTotalRooms = async (req, res) => {
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) return res.status(500).json({ message: error.message });
    res.json({ total: data.length });
  };
  
  export const getTotalGroups = async (req, res) => {
    const groups = await fetchGroupsForLatestSession();
    res.json({ total: groups.length });
  };
  
  export const getTotalStudents = async (req, res) => {
    const { data, error } = await supabase.from('students').select('*');
    if (error) return res.status(500).json({ message: error.message });
    res.json({ total: data.length });
  };
  
  export const getTotalLevels = async (req, res) => {
    const { data, error } = await supabase.from('levels').select('*');
    if (error) return res.status(500).json({ message: error.message });
    res.json({ total: data.length });
  };
  
  export const getConfirmedRegistrations = async (req, res) => {
    const latestSession = await fetchLatestSession();
    const { data, error } = await supabase.from('registrations').select('*').eq('session_id', latestSession.id).eq('confirme', true);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ total: data.length });
  };
  
  export const getUnconfirmedRegistrations = async (req, res) => {
    const latestSession = await fetchLatestSession();
    const { data, error } = await supabase.from('registrations').select('*').eq('session_id', latestSession.id).eq('confirme', false);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ total: data.length });
  };
  
  export const getTotalSessions = async (req, res) => {
    const { data, error } = await supabase.from('sessions').select('*');
    if (error) return res.status(500).json({ message: error.message });
    res.json({ total: data.length });
  };
  
  export const getOngoingSessions = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('sessions').select('*').lte('start_date', today).gte('end_date', today);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ total: data.length });
  };
  
  export const getEndedSessions = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('sessions').select('*').lt('end_date', today);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ total: data.length });
  };
  
  export const getUpcomingSessions = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('sessions').select('*').gt('start_date', today);
    if (error) return res.status(500).json({ message: error.message });
    res.json({ total: data.length });
  };


  export const getGroupsByLevel = async (req, res) => { 
    try {
      const groups = await fetchGroupsForLatestSession();
      const { data: levels, error } = await supabase.from('levels').select('*');
  
      if (error) return res.status(500).json({ message: error.message });
  
      const groupsByLevel = levels.map(level => ({
        levelName: level.name,
        groupCount: groups.filter(group => group.level_id === level.id).length,
      }));
  
      res.json(groupsByLevel);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  