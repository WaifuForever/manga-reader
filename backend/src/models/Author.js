const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    type: [{
        type: String,
        validate: [arrayLimit, '{PATH} exceeds the limit of 10']
    }],

    photos:[{
        type: Object,
        size: Number,         
        filename: String, 
        originalname: String,  

        default: [{
            originalname: "none",           
            size: 0,   
            filename: "none"      
            
        }]
    }],

    name: { 
        type: String,
        required: true,
        unique: true
    },

    birthDate:{
        type: Date
    },

    deathDate:{
        type: Date
    },
   
    works: [{ //a array fill with the mangas ids
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga'
    
    }],

    biography: {
        type: String
    },

    socialMedia: [{
        type: String
    }],

    updatedAt: {
        type: Date,
        default: Date.now
    },

    addedAt: {
        type: Date,
        default: Date.now
    },
});

function arrayLimit(val) {
    return val.length <= 2;
  }

module.exports = mongoose.model('Author', AuthorSchema);