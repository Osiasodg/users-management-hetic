import { createUser, findUserByEmail, listUsers, getUserById, deleteUser,updateUser,countUsers,createManyUsers } from "./users.service.js";
import { validateUser,validateUpdateUser } from "./users.validation.js";

//never return password
function excludePassword(user) {
  const { password, ...rest } = user;
  return rest;
}
 
 export async function handleCreateUser(req, res) {
    try{
        //validate user Data
        const result = validateUser(req.body);
        if(!result.ok){
            return res.status(400).json({
                message: 'validation failed',
                errors: result.errors
            });
        }
        
        //email standar
        const email = req.body.email.toLowerCase().trim();

        //check if user already exists
        const existingUser = await findUserByEmail(req.body.email);
        if (existingUser) {
            return res.status(409).json ({message: 'user already exists'});
        }

        // create user 
        const user = await createUser(req.body,email);
        //no password
        return res.status(201).json(excludePassword(user));

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
 }


 export async function handleListUsers(req,res) {
    try{
        const users = await listUsers();
        //no password
        return res.status(200).json(users.map(excludePassword));
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
 }

 //Compteur
export async function handleCountUsers(req, res) {
  try {
    const count = await countUsers();
    return res.status(200).json({ "Users count": count });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//Recherche mail
export async function handleSearchUserByEmail(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Missing email query parameter" });
    }
    const user = await findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // return res.status(200).json(excludePassword(user)); D
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}



 export async function handleGetUserById(req, res) {
    try {
        const{ id }= req.params;
        if (!id) {
            return res.status(400).json({message: 'Missing user ID'});
        }
        const user = await getUserById(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        //no password
        return res.status(200).json(excludePassword(user));
    }catch (error) {
        return res.status(500).json({error: error.message});

    }
 }


 export async function handleDeleteUser(req, res) {
    try {
        const{ id }= req.params;
        if (!id) {
            return res.status(400).json({message: 'Missing user ID'});
        }
        const user = await getUserById(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        await deleteUser(id);

        return res.status(200).json({ message: "user deleted successfully"});
    }catch (error) {
        return res.status(500).json({error: error.message});

    }
 }



export async function handleUpdateUser(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //body
    const allowedFields = ["email", "password", "name"];
    const hasField = allowedFields.some((field) => req.body[field] !== undefined);
    if (!hasField) {
      return res.status(400).json({
        error: "Validation error",
        fields: { body: "Provide at lest one field to update" },
      });
    }

    // validate update data
    const results = validateUpdateUser(req.body);
    if (!results.ok) {
      return res.status(400).json({
        message: "validation failed",
        errors: results.errors,
      });
    }

    //verifie email
    if (results.data.email) {
      const existingUser = await findUserByEmail(results.data.email);
      if (existingUser && String(existingUser.id) !== String(id)) {
        return res.status(409).json({ error: "Email already in use" });
      }
    }


    const updatedUser = await updateUser(id, results.data);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//change password
export async function handleUpdatePassword(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const updatedUser = await updateUser(id, { password });
    //no password
    return res.status(200).json(excludePassword(updatedUser)); 
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Create multiple users
export async function handleBulkCreateUsers(req, res) {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "Provide a non-empty users array" });
    }
    const validationErrors = {};
    for (let i = 0; i < users.length; i++) {
      const result = validateUser(users[i]);
      if (!result.ok) {
        validationErrors[i] = result.errors;
      }
    }
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ error: "Validation failed", details: validationErrors });
    }

    const normalizedUsers = users.map((u) => ({
      ...u,
      email: u.email.toLowerCase().trim(),
    }));

    for (const userData of normalizedUsers) {
      const existing = await findUserByEmail(userData.email);
      if (existing) {
        return res.status(409).json({ error: `Email already in use: ${userData.email}` });
      }
    }

    const created = await createManyUsers(normalizedUsers);
    //no password
    return res.status(201).json(created.map(excludePassword)); 
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

