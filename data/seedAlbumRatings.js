// seedCourses.js
"use strict";

const { ObjectId } = require("mongodb");
/**
 * Listing 15.9 (p. 224)
 */
const mongoose = require("mongoose"),
  AlbumRating = require("../models/AlbumRating"),
  User = require("../models/User"),
  Comment = require("../models/Comment");


// 데이터베이스 연결 설정
mongoose.connect(
  "mongodb+srv://krissvector58:LdOReXBPN87fODa6@ut-node.0qoahfe.mongodb.net/?retryWrites=true&w=majority&appName=UT-Node/ut-node"
);
const db = mongoose.connection; 
db.once("open", () => {
  console.log("Connected to MONGODB!!");
});

mongoose.connection;

const sampleUserIds = ["667192e40376c89daff583d0"];

var albumRatings = [
  {
    title: "mirror tune",
    description: "this is my favorite song!…",
    author: sampleUserIds[0],
    comments: [
      {
        comment: "TRULY LEGEND",
        author: sampleUserIds[0], 
      }
    ],
    views: 16,
    tags: ["JPOP"], 
    rating: 5,
  },
  {
    title: "mirabo",
    description: "1..2..3.. whoa!",
    author: sampleUserIds[0],
    comments: [
      {
        comment: "that is japanese for mirror ball",
        author: sampleUserIds[0], 
      }
    ], 
    views: 5,
    tags: ["JPOP"], 
    rating: 5,
  },
  {
    title: "satern",
    description: "there is all 5 star lol",
    author: sampleUserIds[0],
    comments: [
      {
        comment: "*crying",
        author: sampleUserIds[0], 
      }
    ], 
    views: 6,
    tags: ["JPOP"], 
    rating: 5,
  },
  {
    title: "power up",
    description: "Make you realize ~~",
    author: sampleUserIds[0],
    comments: [],
    views: 10,
    tags: ["ROCK"], 
    rating: 4,
  },
  {
    title: "highway to hell",
    description: "I'm on the highway to hell",
    author: sampleUserIds[0],
    comments: [
        {
        comment: "NO STOP SIGN!!!!!!!!!!!!!!!",
        author: sampleUserIds[0], 
        }
    ],
    views: 20,
    tags: ["ROCK"], 
    rating: 5,
  },

];
var commands = [];

// 1. Delete all previous data. / 이전 데이터 모두 삭제
// 2. Set a timeout to allow the database to be cleared. / 데이터베이스가 지워지는 것을 기다리기 위해 타임아웃 설정
// 3. Create a promise for each courses object. / 코스 객체마다 프라미스 생성.
// 4. Use Promise.all() to wait for all promises to resolve. / 모든 프라미스가 해결될 때까지 기다리기 위해 Promise.all() 사용.
// 5. Close the connection to the database. / 데이터베이스 연결 닫기.


AlbumRating.deleteMany({})
  .exec()
  .then((result) => {
    console.log(`Deleted ${result.deletedCount} album rating records!`);
  });

setTimeout(async () => {
  for (const r of albumRatings) {
    const author = await User.findOne({ _id: r.author });
    if (author) {
      const newAlbumRating = await AlbumRating.create({
        title: r.title,
        description: r.description,
        author: author._id,
        comments: [], // 댓글은 빈 배열로 초기화 (나중에 추가)
        views: r.views,
        tags: r.tags,
        rating: r.rating,
      });

      // 각 앨범 평가에 댓글 추가
      for (const c of r.comments) {
        const commentAuthor = await User.findOne({ _id: c.author });
        if (commentAuthor) {
          const newComment = await Comment.create({
            comment: c.comment,
            author: commentAuthor._id,
            albumRating: newAlbumRating._id,
            upVotes: [],
            downVotes: [],
          });
          newAlbumRating.comments.push(newComment._id);
        } else {
          console.error(`User not found for comment: ${c.comment}`);
        }
      }
      await newAlbumRating.save(); // 댓글 추가 후 저장

      console.log(`Created album rating with comments: ${newAlbumRating.title}`);
    } else {
      console.error(`User not found for album rating: ${r.title}`);
    }
  }

  // 연결을 닫기 전에 쿼리 실행
  const ratings = await AlbumRating.find()
    .populate("author", "_id")
    .populate("comments"); // comments populate
  console.log(JSON.stringify(ratings, null, 2));

  mongoose.connection.close(); // 연결 닫기
  console.log("Connection closed!");
}, 500);