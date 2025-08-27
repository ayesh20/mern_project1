import mongoose from 'mongoose';

const contactUsSchema = new mongoose.Schema({
    firstName: {        // Changed from 'firstname'
        type: String,
        required: true
    },
    lastName: {         // Changed from 'lasttname' (which was also misspelled)
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {      // Changed from 'phone'
        type: String,
        default: "NOT GIVEN"
    },
    message: {
        type: String,
        required: true
    },
}, 
{
    timestamps: true
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

export default ContactUs;