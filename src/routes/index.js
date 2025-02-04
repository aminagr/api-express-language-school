import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import { getLatestSession, getGroupsForLatestSession } from '../controllers/dataController.js';
import { getAllRooms, createRoom, updateRoom, deleteRoom } from '../controllers/roomsController.js';
import { getAllSessions, createSession, updateSession, deleteSession } from '../controllers/sessionsController.js';
    
import { getTotalGroups,
    getTotalStudents,
    getTotalLevels,
    getTotalRooms,
    getConfirmedRegistrations,
    getUnconfirmedRegistrations,
    getTotalSessions,
    getOngoingSessions,
    getEndedSessions,
    getUpcomingSessions,getGroupsByLevel } from '../controllers/statsController.js';
import { createLevel, updateLevel, deleteLevel, getAllLevels } from '../controllers/levelsController.js';
import { protectAdmin, protectStudent } from '../middlewares/auth.js';
import { fetchGroups, addGroup, updateGroup, deleteGroup } from '../controllers/groupsController.js';
import { fetchRegistrations,addRegistration, updateRegistration, deleteRegistration } from '../controllers/registrationsController.js';
import { getStudentsByGroupId, fetchStudentById,getAllStudents,addStudent, updateStudent, deleteStudent  } from '../controllers/studentController.js';
import { getAllAdmins,  addAdmin, updateAdmin, deleteAdmin,getAdminById  } from '../controllers/adminController.js';
const router = express.Router();


router.post('/login', loginUser);
router.post('/register', registerUser);


router.get('/admins', getAllAdmins);
router.post('/admins', addAdmin);
router.put('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);
router.get('/admins/:id', getAdminById);

router.get('/students', getAllStudents);
router.get('/students/:id', fetchStudentById);
router.post('/students', addStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.get('/students/group/:groupId', getStudentsByGroupId);

router.get('/levels', getAllLevels);
router.post('/levels', createLevel);
router.put('/levels/:id', updateLevel);
router.delete('/levels/:id', deleteLevel);


router.get('/rooms', getAllRooms);                 
router.post('/rooms', createRoom);                 
router.put('/rooms/:id', updateRoom);               
router.delete('/rooms/:id', deleteRoom);          

router.get('/sessions', getAllSessions);          
router.post('/sessions', createSession);           
router.put('/sessions/:id', updateSession);         
router.delete('/sessions/:id', deleteSession);      

router.get('/groups', fetchGroups);
router.post('/groups', addGroup);                 
router.put('/groups/:id', updateGroup);           
router.delete('/groups/:id', deleteGroup);   


router.get('/registrations', fetchRegistrations);
router.post('/registrations', addRegistration);                 
router.put('/registrations/:id', updateRegistration);           
router.delete('/registrations/:id',deleteRegistration );  



router.get('/total-rooms', getTotalRooms);
router.get('/total-groups', getTotalGroups);
router.get('/total-students', getTotalStudents);
router.get('/total-levels', getTotalLevels);
router.get('/confirmed-registrations', getConfirmedRegistrations);
router.get('/unconfirmed-registrations', getUnconfirmedRegistrations);
router.get('/total-sessions', getTotalSessions);
router.get('/ongoing-sessions', getOngoingSessions);
router.get('/ended-sessions', getEndedSessions);
router.get('/upcoming-sessions', getUpcomingSessions);

router.get('/latest-session', getLatestSession);
router.get('/groups-for-latest-session', getGroupsForLatestSession);
router.get('/groups-by-level', getGroupsByLevel);
export default router;
