import Contact, { DEFAULT_IMAGE } from "../models/Contact.js";

// accepts ["vip","leads"] or "vip, leads"
const makeTagsArray = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string" && tags.trim() !== "") {
    return tags.split(",").map((tag) => tag.trim());
  }
  return [];
};

export const createContact = async (req, res) => {
  try {
    const { name, phone, email, tags, image } = req.body;

    const contact = await Contact.create({
      name,
      phone,
      email,
      tags: makeTagsArray(tags),
      // empty text would block the schema default, so check it here
      image: image && image.trim() !== "" ? image.trim() : DEFAULT_IMAGE,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
        // clearing the field puts the default picture back
        image: image && image.trim() !== "" ? image.trim() : DEFAULT_IMAGE,
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};