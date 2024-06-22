// models/Album_rating.js
"use strict";

const mongoose = require("mongoose"),
  album_ratingSchema = mongoose.Schema(
    {
      album_name: {
        // 강좌 스키마에 속성 추가
        type: String,
        required: true,
        unique: true,
      },
      picture_path: {
        type: String,
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      singer: { type: mongoose.Schema.Types.ObjectId, ref: "Singer" },
      release_date: [{ type: mongoose.Schema.Types.ObjectId, ref: "Release_date" }],
      rating: { type: Number, default: 0 },
      category: { type: String },
      tags: [String],
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Album_rating", album_ratingSchema);