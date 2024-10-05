import {IController} from '../utils/icontroller';
import {ExtendedRequest, verifyToken} from '../middlewares/auth'
import express, {NextFunction, Request, Response, Router} from "express";
import {generatePaginationLinks} from '../utils/helper'
import DB from '../utils/db-client'
import {isValidString, isValidId, isValidArrayId} from '../utils/validate'
import process from "node:process";

class GroupController implements IController {
    public router: Router = express.Router();

    constructor() {
        this.initRoutes()
    }

    initRoutes(): void {
        this.router.post('/group/create', verifyToken, this.createGroup)
        this.router.get('/group/list', verifyToken, this.groupFilter)
        this.router.post('/group/ids', verifyToken, this.groupByIds)

        this.router.get('/group/:id', verifyToken, this.groupView)
        this.router.delete('/group/:id', verifyToken, this.groupDelete)
        this.router.put('/group/:id', verifyToken, this.groupEdit)
    }

    groupEdit = async (req: ExtendedRequest, res: Response) => {
        try {
            const groupId = req.params.id;

            if (!groupId || !isValidId(groupId)) {
                throw {
                    status: 401,
                    message: 'Invalid or missing group id'
                }
            }
            const groupInfo = await DB.query(`SELECT
                    id, name, created_at, school_id
                    FROM StudentGroup
                    WHERE id = :id AND school_id = :school_id`, {
                id: groupId,
                school_id: req.user.school_id
            });

            if (groupInfo.length <= 0) {
                throw {
                    status: 404,
                    message: 'Student not found'
                }
            }

            const group = groupInfo[0];

            const {
                name,
                students
            } = req.body


            if (!name || !isValidString(name)) {
                throw {
                    status: 401,
                    message: 'Invalid or missing group name'
                }
            }

            await DB.execute('UPDATE StudentGroup SET name = :name WHERE id = :id', {
                id: group.id,
                name: name
            });

            if (students && Array.isArray(students) && isValidArrayId(students)) {
                const existMembers = await DB.query(`SELECT student_id
                    FROM GroupMember
                    WHERE group_id = :group_id;`, {
                    group_id: group.id
                })

                const existMemberIds = existMembers.map((student: any) => student.student_id);
                const insertStudentIds = students.filter((id: any) => !existMemberIds.includes(id));
                const deleteStudentIds = existMemberIds.filter((id: any) => !students.includes(id));

                if (deleteStudentIds.length > 0) {
                    await DB.query(`DELETE FROM GroupMember 
                        WHERE group_id = :group_id AND student_id IN (:studentIds);`, {
                        group_id: group.id,
                        studentIds: deleteStudentIds
                    });

                    await DB.query(`DELETE FROM PostStudent AS ps
                        WHERE ps.student_id IN (:studentIds) AND ps.group_id = :group_id;`, {
                        group_id: group.id,
                        studentIds: deleteStudentIds
                    });
                }

                if (insertStudentIds.length > 0) {
                    const insertData = insertStudentIds.map((studentId: any) => ({
                        student_id: studentId,
                        group_id: group.id
                    }));
                    const valuesString = insertData.map((item: any) => `(${item.student_id}, ${item.group_id})`).join(', ');
                    await DB.query(`INSERT INTO GroupMember (student_id, group_id)
                        VALUES ${valuesString};`);
                }

            }


            return res.status(200).json({
                message: 'Group changed successfully'
            }).end()
        } catch (e: any) {
            if (e.status) {
                return res.status(e.status).json({
                    error: e.message
                }).end();
            } else {
                return res.status(500).json({
                    error: 'Internal server error'
                }).end();
            }
        }
    }

    groupDelete = async (req: ExtendedRequest, res: Response) => {
        try {
            const groupId = req.params.id;

            if (!groupId || !isValidId(groupId)) {
                throw {
                    status: 401,
                    message: 'Invalid or missing group id'
                }
            }
            const groupInfo = await DB.query(`SELECT
                    id, name, created_at, school_id
                    FROM StudentGroup
                    WHERE id = :id AND school_id = :school_id`, {
                id: groupId,
                school_id: req.user.school_id
            });

            if (groupInfo.length <= 0) {
                throw {
                    status: 404,
                    message: 'Student not found'
                }
            }

            await DB.execute('DELETE FROM StudentGroup WHERE id = :id;', {
                id: groupId
            })

            return res.status(200).json({
                message: 'Group deleted successfully'
            }).end()
        } catch (e: any) {
            if (e.status) {
                return res.status(e.status).json({
                    error: e.message
                }).end();
            } else {
                return res.status(500).json({
                    error: 'Internal server error'
                }).end();
            }
        }
    }

    groupByIds = async (req: ExtendedRequest, res: Response) => {
        try {
            const {groupIds} = req.body

            if (groupIds && Array.isArray(groupIds) && isValidArrayId(groupIds)) {
                const groupList = await DB.query(`SELECT id,name FROM StudentGroup 
                    WHERE id IN (:groups) AND school_id = :school_id;`, {
                    groups: groupIds,
                    school_id: req.user.school_id,
                })

                return res.status(200).json({
                    groupList
                }).end();
            } else {
                throw {
                    status: 401,
                    message: 'Invalid id list'
                }
            }
        } catch (e: any) {
            if (e.status) {
                return res.status(e.status).json({
                    error: e.message
                }).end();
            } else {
                return res.status(500).json({
                    error: 'Internal server error'
                }).end();
            }
        }
    }

    groupView = async (req: ExtendedRequest, res: Response) => {
        try {
            const groupId = req.params.id;

            if (!groupId || !isValidId(groupId)) {
                throw {
                    status: 401,
                    message: 'Invalid or missing group id'
                }
            }
            const groupInfo = await DB.query(`SELECT id,name,created_at FROM StudentGroup 
                WHERE id = :id AND school_id = :school_id`, {
                id: groupId,
                school_id: req.user.school_id
            });

            if (groupInfo.length <= 0) {
                throw {
                    status: 404,
                    message: 'Group not found'
                }
            }

            const group = groupInfo[0];

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(process.env.PER_PAGE + '');
            const offset = (page - 1) * limit;

            const email = req.query.email as string || '';
            const student_number = req.query.student_number as string || '';

            const filters = [];
            const params: any = {
                group_id: group.id,
                limit: limit,
                offset: offset
            };

            if (email) {
                filters.push('st.email LIKE :email');
                params.email = `%${email}%`;
            }
            if (student_number) {
                filters.push('st.student_number LIKE :student_number');
                params.student_number = `%${student_number}%`;
            }

            const whereClause = filters.length > 0 ? 'AND ' + filters.join(' AND ') : '';

            const groupMembers = await DB.query(`SELECT
                    st.id,st.phone_number,st.email,
                    st.student_number, st.given_name, st.family_name
                FROM GroupMember AS gm
                INNER JOIN Parents.Student AS st on gm.student_id = st.id
                WHERE gm.group_id = :group_id ${whereClause}
                ORDER BY gm.id DESC
                LIMIT :limit OFFSET :offset;`, params)

            const totalMembers = (await DB.query(`SELECT COUNT(*) as total
                FROM GroupMember as gm
                INNER JOIN Parents.Student AS st on gm.student_id = st.id
                WHERE gm.group_id = :group_id ${whereClause};`, params))[0].total

            const totalPages = Math.ceil(totalMembers / limit);

            const pagination = {
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_members: totalMembers,
                next_page: page < totalPages ? page + 1 : null,
                prev_page: page > 1 ? page - 1 : null,
                links: generatePaginationLinks(page, totalPages)
            };


            return res.status(200).json({
                group: group,
                members: groupMembers,
                pagination: pagination
            }).end()
        } catch (e: any) {
            if (e.status) {
                return res.status(e.status).json({
                    error: e.message
                }).end();
            } else {
                return res.status(500).json({
                    error: 'Internal server error'
                }).end();
            }
        }
    }

    groupFilter = async (req: ExtendedRequest, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(process.env.PER_PAGE + '');
            const offset = (page - 1) * limit;

            const name = req.query.name as string || '';

            const filters = [];
            const params: any = {
                school_id: req.user.school_id,
                limit: limit,
                offset: offset
            };

            if (name) {
                filters.push('sg.name LIKE :name');
                params.name = `%${name}%`;
            }

            const whereClause = filters.length > 0 ? 'AND ' + filters.join(' AND ') : '';

            const groupList = await DB.query(`SELECT sg.id, sg.name,
                (SELECT COUNT(*) AS total FROM GroupMember WHERE group_id = sg.id) as member_count
                FROM StudentGroup as sg
                WHERE sg.school_id = :school_id ${whereClause}
                ORDER BY sg.id DESC
                LIMIT :limit OFFSET :offset;`, params);

            const totalGroups = (await DB.query(`SELECT COUNT(*) as total
                FROM StudentGroup AS sg WHERE sg.school_id = :school_id ${whereClause};`, params))[0].total

            const totalPages = Math.ceil(totalGroups / limit);

            const pagination = {
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_groups: totalGroups,
                next_page: page < totalPages ? page + 1 : null,
                prev_page: page > 1 ? page - 1 : null,
                links: generatePaginationLinks(page, totalPages)
            };

            return res.status(200).json({
                groups: groupList,
                pagination: pagination
            }).end();
        } catch (e: any) {
            if (e.status) {
                return res.status(e.status).json({
                    error: e.message
                }).end();
            } else {
                return res.status(500).json({
                    error: 'Internal server error'
                }).end();
            }
        }
    }

    createGroup = async (req: ExtendedRequest, res: Response) => {
        try {
            const {
                name,
                students
            } = req.body


            if (!name || !isValidString(name)) {
                throw {
                    status: 401,
                    message: 'Invalid or missing group name'
                }
            }


            const groupInsert = await DB.execute(
                `INSERT INTO StudentGroup(name, created_at, school_id) 
                        VALUE (:name, NOW(), :school_id);`, {
                    name: name,
                    school_id: req.user.school_id,
                });

            const groupId = groupInsert.insertId;
            const attachedMembers: any[] = [];

            if (students && Array.isArray(students) && isValidArrayId(students)
                && students.length > 0) {
                const studentRows = await DB.query('SELECT id FROM Student WHERE id IN (:students) AND school_id = :school_id;', {
                    students: students,
                    school_id: req.user.school_id,
                })


                if (studentRows.length > 0) {
                    const values = studentRows.map((student: any) => `(${student.id}, ${groupId})`).join(', ');
                    await DB.execute(`INSERT INTO GroupMember(student_id, group_id) VALUES ${values}`);

                    const studentList = await DB.query(`SELECT 
                                st.id,st.phone_number,st.email,
                                st.student_number,st.given_name,st.family_name 
                            FROM GroupMember AS gm
                            INNER JOIN Student as st ON gm.student_id = st.id
                            WHERE group_id = :group_id;`, {
                        group_id: groupId,
                    })

                    attachedMembers.push(...studentList);
                }
            }

            return res.status(200).json({
                group: {
                    id: groupId,
                    name: name,
                    members: attachedMembers
                }
            }).end()
        } catch (e: any) {
            if (e.status) {
                return res.status(e.status).json({
                    error: e.message
                }).end();
            } else {
                return res.status(500).json({
                    error: 'Internal server error'
                }).end();
            }
        }
    }
}

export default GroupController