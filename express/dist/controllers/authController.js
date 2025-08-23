"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.addUser = exports.getAllUsers = exports.getRecords = exports.getUserDetails = exports.login = void 0;
const fs = __importStar(require("fs"));
const xml2js = __importStar(require("xml2js"));
const dataFilePath = 'src/data.xml';
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
let users = [];
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
                    users = result.database.users[0].user.map((u) => ({
                        id: u.id ? u.id[0] : '',
                        name: u.name ? u.name[0] : '',
                        password: u.password ? u.password[0] : '',
                        role: u.role ? u.role[0] : 'General User',
                        records: u.records && u.records[0].record ? u.records[0].record.map((r) => ({
                            recordId: r.recordId ? r.recordId[0] : '',
                            title: r.title ? r.title[0] : '',
                            status: r.status ? r.status[0] : 'Pending'
                        })) : []
                    }));
                }
                else {
                    users = [];
                    console.warn('Invalid XML structure, initializing empty users array');
                }
            });
        }
        catch (error) {
            console.error('Error reading XML file:', error);
            users = [];
        }
    }
    else {
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
const login = (req, res) => {
    const { id, password, role } = req.body;
    const user = users.find(u => u.id === id && u.password === password && u.role === role);
    if (user) {
        const response = { success: true, user, message: 'Login successful' };
        res.json(response);
    }
    else {
        res.status(401).json({ success: false, user: null, message: 'Invalid credentials' });
    }
};
exports.login = login;
const getUserDetails = (req, res) => {
    const userId = req.query.id || 'u101';
    const user = users.find(u => u.id === userId);
    if (user) {
        const response = { success: true, user, message: 'Get user details successful' };
        res.json(response);
    }
    else
        res.status(404).json({ success: false, user: null, message: 'User not found' });
};
exports.getUserDetails = getUserDetails;
const getRecords = (req, res) => {
    const userId = req.query.id || 'u101';
    const delayMs = parseInt(req.query.delay) || 0;
    const user = users.find(u => u.id === userId);
    if (user) {
        const response = { success: true, user, message: 'Get user records successful' };
        setTimeout(() => res.json(response), delayMs);
    }
    else {
        res.status(404).json({ success: false, user: null, message: 'User not found' });
    }
};
exports.getRecords = getRecords;
const getAllUsers = (req, res) => {
    const delayMs = parseInt(req.query.delay) || 0;
    setTimeout(() => res.json(users), delayMs);
};
exports.getAllUsers = getAllUsers;
const addUser = (req, res) => {
    const user = req.body;
    users.push(user);
    saveData();
    res.json(user);
};
exports.addUser = addUser;
const updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index] = updatedUser;
        saveData();
    }
    res.json(updatedUser);
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    const userId = req.params.id;
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users.splice(index, 1);
        saveData();
    }
    res.sendStatus(204);
};
exports.deleteUser = deleteUser;
