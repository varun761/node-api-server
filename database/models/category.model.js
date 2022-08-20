const { Schema, Types, model } = require("mongoose")

const categorySchema = new Schema({
    title: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    posts: [{
        type: Types.ObjectId,
        ref: "Post"
    }],
    author: {
        type: Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: {
      createdAt: "created_at",
    },
})

const categoryModel = new model("Category", categorySchema)

module.exports = categoryModel