import Contact, { DEFAULT_IMAGE } from "../models/Contact.js";

// accepts ["vip","leads"] or "vip, leads"
const makeTagsArray = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string" && tags.trim() !== "") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
  }
  return [];
};

// empty image text means "use the default picture"
const makeImage = (image) => {
  return image && image.trim() !== "" ? image.trim() : DEFAULT_IMAGE;
};

// one place to turn errors into responses
const handleError = (res, error) => {
  // duplicate phone number
  if (error.code === 11000) {
    return res.status(409).json({ message: "A contact with this phone number already exists" });
  }
  // wrong id format
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid contact id" });
  }
  // validation errors (missing name, etc.)
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: "Server error", error: error.message });
};

// GET /api/contacts?page=1&limit=10
export const getContacts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments();
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      contacts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/contacts/:id
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    handleError(res, error);
  }
};

// POST /api/contacts
export const createContact = async (req, res) => {
  try {
    const { name, phone, email, tags, image } = req.body;

    const contact = await Contact.create({
      name,
      phone,
      email,
      tags: makeTagsArray(tags),
      image: makeImage(image),
    });

    res.status(201).json(contact);
  } catch (error) {
    handleError(res, error);
  }
};

// PUT /api/contacts/:id
export const updateContact = async (req, res) => {
  try {
    const { name, phone, email, tags, image } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        email,
        tags: makeTagsArray(tags),
        image: makeImage(image),
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    handleError(res, error);
  }
};