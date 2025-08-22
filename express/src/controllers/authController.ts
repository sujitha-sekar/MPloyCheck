import { Request, Response } from 'express';
import { LoginInput, LoginResponse, User, Record } from '../models/login.model';
import * as fs from 'fs';
import * as xml2js from 'xml2js';

const dataFilePath = 'src/data.xml';

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

let users: User[] = [];

const loadData = () => {
  if (fs.existsSync(dataFilePath)) {
    try {
      const xmlData = fs.readFileSync(dataFilePath, 'utf-8');
      parser.parseString(xmlData, (err, result) => {
        if (err) {
          console.error('Error parsing XML:', err);
          users = [];
          return;
        }
        if (result.database && result.database.users && result.database.users[0].user) {
          users = result.database.users[0].user.map((u: any) => ({
            id: u.id ? u.id[0] : '',
            name: u.name ? u.name[0] : '',
            password: u.password ? u.password[0] : '',
            role: u.role ? u.role[0] : 'General User',
            records: u.records && u.records[0].record ? u.records[0].record.map((r: any) => ({
              recordId: r.recordId ? r.recordId[0] : '',
              title: r.title ? r.title[0] : '',
              status: r.status ? r.status[0] : 'Pending'
            })) : []
          }));
        } else {
          users = [];
          console.warn('Invalid XML structure, initializing empty users array');
        }
      });
    } catch (error) {
      console.error('Error reading XML file:', error);
      users = [];
    }
  } else {
    console.warn('data.xml not found, initializing empty users array');
    users = [];
  }
};

const saveData = () => {
  const data = {
    database: {
      users: { user: users.map(u => ({
        id: [u.id],
        name: [u.name],
        password: [u.password],
        role: [u.role],
        records: { record: u.records.map(r => ({
          recordId: [r.recordId],
          title: [r.title],
          status: [r.status]
        })) }
      })) }
    }
  };
  const xml = builder.buildObject(data);
  fs.writeFileSync(dataFilePath, xml);
};

loadData(); // Load data on startup

export const login = (req: Request, res: Response) => {
  const { id, password, role }: LoginInput = req.body;
  const user = users.find(u => u.id === id && u.password === password && u.role === role);
  if (user) {
    const response: LoginResponse = { success: true, user, message: 'Login successful' };
    res.json(response);
  } else {
    res.status(401).json({ success: false, user: null, message: 'Invalid credentials' });
  }
};

export const getUserDetails = (req: Request, res: Response) => {
  const userId = req.query.id as string || 'u101';
  const user = users.find(u => u.id === userId);
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
};

export const getRecords = (req: Request, res: Response) => {
  const userId = req.query.id as string || 'u101';
  const delayMs = parseInt(req.query.delay as string) || 0;
  const user = users.find(u => u.id === userId);
  if (user) {
    setTimeout(() => res.json(user.records), delayMs);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const getAllUsers = (req: Request, res: Response) => {
  const delayMs = parseInt(req.query.delay as string) || 0;
  setTimeout(() => res.json(users), delayMs);
};

export const addUser = (req: Request, res: Response) => {
  const user: User = req.body;
  users.push(user);
  saveData();
  res.json(user);
};

export const updateUser = (req: Request, res: Response) => {
  const userId = req.params.id;
  const updatedUser: User = req.body;
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = updatedUser;
    saveData();
  }
  res.json(updatedUser);
};

export const deleteUser = (req: Request, res: Response) => {
  const userId = req.params.id;
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    saveData();
  }
  res.sendStatus(204);
};