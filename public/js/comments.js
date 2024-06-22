// When #btn-reply is clicked, create a new comment reply form in vanilla JS
// =====================================================================

const btnReply = document.querySelector("#btn-reply");
const btnCancel = document.querySelector("#btn-cancel");
const commentBtns = document.querySelector("#comment-btns");
const commentForm = document.querySelector("#comment-form");

btnReply.addEventListener("click", () => {
  // Create a new reply form
  const replyForm = document.createElement("form");
  replyForm.setAttribute("id", "reply-form");
  replyForm.setAttribute("method", "POST");
  replyForm.setAttribute("action", "/comments/create");
  replyForm.setAttribute("class", "mt-3");

  // Create a new reply form group
  const replyFormGroup = document.createElement("div");
  replyFormGroup.setAttribute("class", "form-group");

  // Create a new reply label
  const replyLabel = document.createElement("label");
  replyLabel.setAttribute("for", "inputComment");

  // Create a new reply textarea
  const replyTextArea = document.createElement("textarea");
  replyTextArea.setAttribute("name", "comment");
  replyTextArea.setAttribute("id", "inputComment");
  replyTextArea.setAttribute("class", "form-control");
  replyTextArea.setAttribute("rows", "3");
  replyTextArea.setAttribute("placeholder", "Leave a reply");
  replyTextArea.setAttribute("required", true);

  // Create a new comment-btns div
  const newCommentBtns = document.createElement("div");
  newCommentBtns.setAttribute("id", "comment-btns");
  newCommentBtns.setAttribute("class", "d-flex justify-content-end");

  // Create a new reply submit button
  const replySubmit = document.createElement("input");
  replySubmit.setAttribute("type", "submit");
  replySubmit.setAttribute("class", "btn btn-primary mx-2 mt-2");
  replySubmit.setAttribute("value", "Reply");

  // Create a new reply cancel button
  const replyCancel = document.createElement("button");
  replyCancel.setAttribute("id", "btn-cancel");
  replyCancel.setAttribute("class", "btn btn-secondary mt-2");
  replyCancel.setAttribute("type", "button");
  replyCancel.textContent = "Cancel";

  // Append the reply form group to the reply form
  replyForm.appendChild(replyTextArea);
  replyForm.appendChild(replySubmit);
  replyForm.appendChild(replyCancel);

  // Append the reply form to the comment form
  commentForm.appendChild(replyForm);
  commentBtns.remove();

  replyCancel.addEventListener("click", () => {
    replyForm.remove();
    commentForm.appendChild(commentBtns);
  });
});
