// controllers/commentsController.js
"use strict";

const Comment = require("../models/Comment"),
  AlbumRating = require("../models/AlbumRating"),
  getCommentParams = (req) => {
    return {
      comment: req.body.comment,
      author: req.user,
      AlbumRating: req.headers.referer.substring(
        req.headers.referer.lastIndexOf("/") + 1
      ),
    };
  };

module.exports = {
  index: (req, res, next) => {
    Comment.find() // index 액션에서만 퀴리 실행
      .then((comments) => {
        // 사용자 배열로 index 페이지 렌더링
        res.locals.comments = comments; // 응답상에서 사용자 데이터를 저장하고 다음 미들웨어 함수 호출
        next();
      })
      .catch((error) => {
        // 로그 메시지를 출력하고 홈페이지로 리디렉션
        console.log(`Error fetching comments: ${error.message}`);
        next(error); // 에러를 캐치하고 다음 미들웨어로 전달
      });
  },
  indexView: (req, res) => {
    res.render("comments/index", {
      page: "comments",
      title: "All Comments",
    }); // 분리된 액션으로 뷰 렌더링
  },

  /**
   * 노트: 구독자 컨트롤러에서 index 액션이 getAllSubscribers를 대체한다. main.js에서 액션 관련
   * 라우트 index를 가리키도록 수정하고 subscribers.ejs를 index.ejs로 변경된 점을 기억하자. 이
   * 뷰는 views 폴더 아래 subscribers 폴더에 있어야 한다.
   */

  /**
   * Listing 19.2 (p. 278)
   * userController.js에 액션 생성 추가
   */
  // 폼의 렌더링을 위한 새로운 액션 추가
  new: (req, res) => {
    res.render("comments/new", {
      page: "new-comment",
      title: "New Comment",
    });
  },

  // 사용자를 데이터베이스에 저장하기 위한 create 액션 추가
  create: (req, res, next) => {
    let commentParams = getCommentParams(req),
      AlbumRatingId = req.headers.referer.substring(
        req.headers.referer.lastIndexOf("/") + 1
      );
    // 폼 파라미터로 사용자 생성
    Comment.create(commentParams)
      .then((comment) => {
        AlbumRating.findByIdAndUpdate(AlbumRatingId, {
          $push: { comments: comment._id },
        }).then((AlbumRating) => {
          console.log(AlbumRating);
        });

        res.locals.redirect = `/AlbumRatings/${AlbumRatingId}`;
        res.locals.comment = comment;
        console.log(comment);
        next();
      })
      .catch((error) => {
        console.log(`Error saving comment: ${error.message}`);
        next(error);
      });
  },

  // 분리된 redirectView 액션에서 뷰 렌더링
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  /**
   * 노트: 구독자 컨트롤러에 new와 create 액션을 추가하는 것은 새로운 CRUD 액션을 맞춰
   * getAllSubscribers와 saveSubscriber 액션을 삭제할 수 있다는 의미다. 게다가 홈
   * 컨트롤러에서 할 것은 홈페이지인 index.ejs 제공밖에 없다.
   */

  /**
   * Listing 19.7 (p. 285)
   * userController.js에서 특정 사용자에 대한 show 액션 추가
   */
  show: (req, res, next) => {
    let commentId = req.params.id; // request params로부터 사용자 ID 수집
    Comment.findById(commentId) // ID로 사용자 찾기
      .then((comment) => {
        res.locals.comment = comment; // 응답 객체를 통해 다음 믿들웨어 함수로 사용자 전달
        next();
      })
      .catch((error) => {
        console.log(`Error fetching comment by ID: ${error.message}`);
        next(error); // 에러를 로깅하고 다음 함수로 전달
      });
  },

  // show 뷰의 렌더링
  showView: (req, res) => {
    res.render("comments/show", {
      page: "comment-details",
      title: "Comment Details",
    });
  },

  /**
   * Listing 20.6 (p. 294)
   * edit와 update 액션 추가
   */
  // edit 액션 추가
  edit: (req, res, next) => {
    let commentId = req.params.id;
    Comment.findById(commentId) // ID로 데이터베이스에서 사용자를 찾기 위한 findById 사용
      .then((comment) => {
        res.render("comments/edit", {
          comment: comment,
        }); // 데이터베이스에서 내 특정 사용자를 위한 편집 페이지 렌더링
      })
      .catch((error) => {
        console.log(`Error fetching comment by ID: ${error.message}`);
        next(error);
      });
  },

  // update 액션 추가
  update: (req, res, next) => {
    let commentId = getCommentParams(req),
      AlbumRatingId = req.headers.referer.substring(
        req.headers.referer.lastIndexOf("/") + 1
      ); // 요청으로부터 사용자 파라미터 취득

    Comment.findByIdAndUpdate(commentId, {
      $set: commentParams,
    }) //ID로 사용자를 찾아 단일 명령으로 레코드를 수정하기 위한 findByIdAndUpdate의 사용
      .then((comment) => {
        res.locals.redirect = `/AlbumRatings/${AlbumRatingId}`;
        res.locals.comment = comment;
        next(); // 지역 변수로서 응답하기 위해 사용자를 추가하고 다음 미들웨어 함수 호출
      })
      .catch((error) => {
        console.log(`Error updating comment by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Listing 20.9 (p. 298)
   * delete 액션의 추가
   */
  delete: (req, res, next) => {
    let commentId = req.params.id,
      AlbumRatingId = req.headers.referer.substring(
        req.headers.referer.lastIndexOf("/") + 1
      );
    Comment.findByIdAndRemove(commentId) // findByIdAndRemove 메소드를 이용한 사용자 삭제
      .then(() => {
        AlbumRating.findByIdAndUpdate(AlbumRatingId, {
          $pull: { comments: commentId },
        })
          .then(() => {
            res.locals.redirect = `/AlbumRatings/${AlbumRatingId}`;
            next();
          })
          .catch((error) => {
            console.log(`Error deleting comment by ID: ${error.message}`);
            next();
          });
      });
  },
};