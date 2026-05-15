import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Pegawai from '../models/Pegawai';
import MasterGolongan from '../models/MasterGolongan';
import MasterJabatan from '../models/MasterJabatan';
import MasterUnitKerja from '../models/MasterUnitKerja';
import User from '../models/User';
import Riwayat from '../models/Riwayat';
import bcrypt from 'bcryptjs';

const transformPegawai = (p: any) => {
    return {
        id: p.id.toString(),
        nip: p.nip,
        nama: p.nama,
        jabatan: p.jabatan?.nama || '',
        golongan: p.golongan?.kode || '',
        unitKerja: p.unit_kerja?.nama || '',
        email: p.email || '',
        phone: p.phone || '',
        tmtPangkat: p.tmt_pangkat,
        tmtKgb: p.tmt_kgb,
        tanggalMasuk: p.tanggal_masuk,
        status: p.status,
        avatar: p.avatar,
        hasAccount: !!p.user,
        riwayats: p.riwayats || []
    };
};

export const getAllPegawai = async (req: Request, res: Response) => {
    try {
        const { search, unit_kerja_id, golongan_id, status } = req.query;
        
        const whereClause: any = {};
        
        if (search) {
            whereClause[Op.or] = [
                { nama: { [Op.like]: `%${search}%` } },
                { nip: { [Op.like]: `%${search}%` } }
            ];
        }
        
        if (unit_kerja_id) whereClause.unit_kerja_id = unit_kerja_id;
        if (golongan_id) whereClause.golongan_id = golongan_id;
        if (status) whereClause.status = status;

        const data = await Pegawai.findAll({
            where: whereClause,
            include: [
                { model: MasterGolongan, as: 'golongan' },
                { model: MasterJabatan, as: 'jabatan' },
                { model: MasterUnitKerja, as: 'unit_kerja' },
                { model: User, as: 'user', attributes: ['id'] }
            ]
        });

        const transformedData = data.map(transformPegawai);

        res.json({ success: true, data: transformedData });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPegawaiById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await Pegawai.findByPk(id as string, {
            include: [
                { model: MasterGolongan, as: 'golongan' },
                { model: MasterJabatan, as: 'jabatan' },
                { model: MasterUnitKerja, as: 'unit_kerja' },
                { model: Riwayat, as: 'riwayats' }
            ]
        });

        if (!data) {
            return res.status(404).json({ success: false, message: 'Pegawai not found' });
        }

        res.json({ success: true, data: transformPegawai(data) });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const createPegawai = async (req: any, res: Response) => {
    try {
        const { 
            golongan, jabatan, unitKerja, 
            golongan_id, jabatan_id, unit_kerja_id,
            tmtPangkat, tmtKgb, tanggalMasuk, ...rest 
        } = req.body;
        
        let final_golongan_id = golongan_id;
        let final_jabatan_id = jabatan_id;
        let final_unit_kerja_id = unit_kerja_id;

        // Map names/codes to IDs if IDs not provided
        if (!final_golongan_id && golongan) {
            const masterGol = await MasterGolongan.findOne({ where: { kode: golongan } });
            final_golongan_id = masterGol?.id;
        }
        if (!final_jabatan_id && jabatan) {
            const masterJab = await MasterJabatan.findOne({ where: { nama: jabatan } });
            final_jabatan_id = masterJab?.id;
        }
        if (!final_unit_kerja_id && unitKerja) {
            const masterUnit = await MasterUnitKerja.findOne({ where: { nama: unitKerja } });
            final_unit_kerja_id = masterUnit?.id;
        }

        const data = await Pegawai.create({
            ...rest,
            tmt_pangkat: tmtPangkat,
            tmt_kgb: tmtKgb,
            tanggal_masuk: tanggalMasuk,
            golongan_id: final_golongan_id,
            jabatan_id: final_jabatan_id,
            unit_kerja_id: final_unit_kerja_id,
            avatar: req.file?.path
        });

        // Re-fetch to get includes
        const fullData = await Pegawai.findByPk(data.id, {
            include: [
                { model: MasterGolongan, as: 'golongan' },
                { model: MasterJabatan, as: 'jabatan' },
                { model: MasterUnitKerja, as: 'unit_kerja' }
            ]
        });
        res.status(201).json({ success: true, data: transformPegawai(fullData) });
    } catch (error: any) {
        console.error('Error creating pegawai:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updatePegawai = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            golongan, jabatan, unitKerja, 
            golongan_id, jabatan_id, unit_kerja_id,
            tmtPangkat, tmtKgb, tanggalMasuk, ...rest 
        } = req.body;

        const pegawai = await Pegawai.findByPk(id as string);
        if (!pegawai) {
            return res.status(404).json({ success: false, message: 'Pegawai not found' });
        }

        let final_golongan_id = golongan_id;
        let final_jabatan_id = jabatan_id;
        let final_unit_kerja_id = unit_kerja_id;

        // Map names/codes to IDs if IDs not provided
        if (!final_golongan_id && golongan) {
            const masterGol = await MasterGolongan.findOne({ where: { kode: golongan } });
            final_golongan_id = masterGol?.id;
        }
        if (!final_jabatan_id && jabatan) {
            const masterJab = await MasterJabatan.findOne({ where: { nama: jabatan } });
            final_jabatan_id = masterJab?.id;
        }
        if (!final_unit_kerja_id && unitKerja) {
            const masterUnit = await MasterUnitKerja.findOne({ where: { nama: unitKerja } });
            final_unit_kerja_id = masterUnit?.id;
        }

        const updateData: any = { ...rest };
        if (tmtPangkat) updateData.tmt_pangkat = tmtPangkat;
        if (tmtKgb) updateData.tmt_kgb = tmtKgb;
        if (tanggalMasuk) updateData.tanggal_masuk = tanggalMasuk;
        if (final_golongan_id) updateData.golongan_id = final_golongan_id;
        if (final_jabatan_id) updateData.jabatan_id = final_jabatan_id;
        if (final_unit_kerja_id) updateData.unit_kerja_id = final_unit_kerja_id;
        if (req.file?.path) updateData.avatar = req.file.path;

        await pegawai.update(updateData);

        // Sync with User if exists
        await User.update(
            { 
                name: updateData.nama || pegawai.nama,
                email: updateData.email || pegawai.email,
                avatar: updateData.avatar || pegawai.avatar
            },
            { where: { nip: pegawai.nip } }
        );
        
        const updatedData = await Pegawai.findByPk(id as string, {
            include: [
                { model: MasterGolongan, as: 'golongan' },
                { model: MasterJabatan, as: 'jabatan' },
                { model: MasterUnitKerja, as: 'unit_kerja' }
            ]
        });
        
        return res.json({ success: true, data: transformPegawai(updatedData) });
    } catch (error: any) {
        console.error('Error updating pegawai:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deletePegawai = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Pegawai.destroy({ where: { id } });
        
        if (deleted) {
            return res.json({ success: true, message: 'Pegawai deleted' });
        }
        
        res.status(404).json({ success: false, message: 'Pegawai not found' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAccountForPegawai = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role, email, password } = req.body;

        const pegawai = await Pegawai.findByPk(id as string, {
            include: [{ model: MasterJabatan, as: 'jabatan' }]
        });

        if (!pegawai) {
            return res.status(404).json({ success: false, message: 'Pegawai not found' });
        }

        const targetEmail = email || pegawai.email || `${pegawai.nip}@simpeg.local`;

        // Check if NIP already exists
        const existingNip = await User.findOne({ where: { nip: pegawai.nip } });
        if (existingNip) {
            return res.status(400).json({ success: false, message: `Account with NIP ${pegawai.nip} already exists` });
        }

        // Check if Email already exists
        const existingEmail = await User.findOne({ where: { email: targetEmail } });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: `Account with Email ${targetEmail} already exists` });
        }

        const hashedPassword = await bcrypt.hash(password || 'password', 10);

        const newUser = await User.create({
            name: pegawai.nama,
            nip: pegawai.nip,
            email: targetEmail,
            password: hashedPassword,
            role: role || 'pegawai',
            jabatan: pegawai.jabatan?.nama || '',
            avatar: pegawai.avatar
        });

        res.status(201).json({ 
            success: true, 
            message: 'User account created successfully',
            data: {
                id: newUser.id,
                nip: newUser.nip,
                role: newUser.role
            }
        });
    } catch (error: any) {
        console.error('Error creating account:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};
