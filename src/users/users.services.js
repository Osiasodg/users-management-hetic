import { Prisma } from "../utils/prisma.js";


export function findUserByEmail(mail){
    return prisma.user.findUnique({
        where:{email}
    });
}


export function createUser(data){
    return prisma.user.create({
        data:userData
    });
}

