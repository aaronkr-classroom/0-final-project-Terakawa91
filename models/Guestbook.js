// models/guestbook.js
"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  talkSchema = new Schema({
    meta: {
      currentDateTime: {
        type: String,
        required: true,
      },
      title: {
        type: String,
      },
      keywords: {
        type: String,
      },
    },
    given: {
      location: {
        name: {
          type: String,
        },
        korean: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      organization: {
        name: {
          type: String,
        },
        korean: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      event: {
        name: {
          type: String,
        },
        korean: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    },
    links: {
      img: {
        type: String,
      },
    },
    talkImg: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  });

module.exports = mongoose.model("Guestbook", talkSchema);
