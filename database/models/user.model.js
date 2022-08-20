const { Schema, model } = require("mongoose");
const moment = require("moment");

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      minLength: 3,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [{
      type: Schema.Types.ObjectId,
      ref: "Post"
    }],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }],
    categories: [{
      type: Schema.Types.ObjectId,
      ref: "Category"
    }]
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema
  .virtual("name")
  .get(function () {
    return `${this.first_name} ${this.last_name}`.trim();
  })
  .set(function (v) {
    let first_name = v.substring(0, v.indexOf(" "));
    if (first_name) {
      first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);
    }
    let last_name = v.substring(v.indexOf(" ") + 1);
    if (last_name) {
      last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);
    }
    this.set({
      first_name,
      last_name,
    });
  });

userSchema.virtual("date_of_birth").get(function () {
  const date_of_birth = new Date(this.dob);
  return moment(date_of_birth).format("DD-MM-yyyy");
});

const userModel = new model("User", userSchema);

module.exports = userModel;
