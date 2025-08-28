
import Contact from "../models/contactus.js";

export async function createContact(req, res) {
    try {
        const { firstName, lastName, email, phoneNumber, message } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !phoneNumber || !message) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Please provide a valid email address" 
            });
        }

        // Create new contact
        const contact = new Contact({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            phoneNumber: phoneNumber.trim(),
            message: message.trim()
        });

        const savedContact = await contact.save();

        res.status(201).json({
            message: "Message sent successfully!",
            contactId: savedContact._id
        });

    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({ 
            message: "Failed to submit contact form. Please try again." 
        });
    }
}