const db = require("../models/index.js");
const Project = db.project;

//necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');



// Display list of all users (with pagination)
exports.findAll = async (req, res) => {
    //get data from request query string (if not existing, they will be undefined)
    let { page, size, titulo } = req.query;
    // console.log(`Page ${page} Size ${size} Nome ${nome}`)

    // validate page
    if (page && !req.query.page.match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Page number must be 0 or a positive integer' });
        return;
    }
    else
        page = parseInt(page); // if OK, convert it into an integer
    // validate size
    if (size && !req.query.size.match(/^([1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Size must be a positive integer' });
        return;
    } else
        size = parseInt(size); // if OK, convert it into an integer

    // Sequelize function findAndCountAll parameters: 
    //      limit -> number of rows to be retrieved
    //      offset -> number of rows to be offseted (not retrieved)
    const limit = size ? size : 3;          // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    // console.log(`Limit ${limit} Offset ${offset}`)

    // search by title require to build a query with the operator L
    const condition = titulo ? { nome: { [Op.like]: `%${titulo}%` } } : null;

    try {
        let projects = await Project.findAndCountAll({ where: condition, limit, offset })
        
        // map default response to desired response data structure
        res.status(200).json({
            success: true,
            totalItems: projects.count,
            projects: projects.rows,
            totalPages: Math.ceil(projects.count / limit),
            currentPage: page ? page : 0
        });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the projects."
        })
        
    }
};

// List just one user
exports.findOne = async (req, res) => {
    try {
        res.status(201).json({ message: "Project found with the correct id"})
    }
    catch (err) {
        if (err.titulo === 'SequelizeValidationError')
        res.status(400).json({ message: err.errors || "Bad request!" });
    else
        res.status(500).json({ message: err.message || "Some error occurred while finding the project!" })
        
    }
};

// Handle user create on POST
exports.create = async (req, res) => {
    try {
        res.status(201).json({ message: "New project created", location: "/projects" + req.params.id})
    }
    catch (err) {
        if (err.titulo === 'SequelizeValidationError')
        res.status(400).json({ message: err.errors || "Bad request!" });
    else
        res.status(500).json({ message: err.message || "Some error occurred while creating the project!" })
        
    }
};

exports.update = async (req, res) => {
    try {
        res.status(200).json({ message: "Project " + req.params.id + " altered" })
    }
    catch (err) {
        if (err.desc === 'SequelizeValidationError')
        res.status(404).json({ message: err.errors || "Not found!" });
    else
        res.status(500).json({ message: err.message || "Some error occurred while updating the project!" })
        
    }
};

exports.delete = async (req, res) => {
    try {
        res.status(204).json({ message: "Project id " + req.params.id + " was deleted." })
    }
    catch (err) {
        if (err.desc === 'SequelizeValidationError')
        res.status(404).json({ message: err.errors || "Not found!"});
    else
        res.status(500).json({ message: err.message || "Some error occurred while deleting the Project!" })
        
    }
};

