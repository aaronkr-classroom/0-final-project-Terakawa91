// models/Discussion.js
"use strict";

/**
 * Listing 17.6 (p. 249)
 * 새로운 스키마와 모델의 생성
 */
const mongoose = require("mongoose"),
  albumRatingSchema = mongoose.Schema(
    {
      title: {
        // 강좌 스키마에 속성 추가
        type: String,
        required: true,
        unique: true,
      },
      description: {
        type: String,
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
      views: { type: Number, default: 0 },
      category: { type: String },
      tags: [String],
      rating: { type: Number, default: 0 },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("AlbumRating", albumRatingSchema);
