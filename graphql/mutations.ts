const boardFields = `
  _id writer title contents youtubeUrl likeCount dislikeCount images createdAt updatedAt
  boardAddress { zipcode address addressDetail }
  user { _id email name picture }
`;

const travelproductFields = `
  _id name remarks contents price tags images pickedCount soldAt createdAt updatedAt
  travelproductAddress { zipcode address addressDetail lat lng }
  buyer { _id email name picture }
  seller { _id email name picture }
`;

export const CREATE_USER = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) { _id email name picture userPoint { amount } }
  }
`;

export const LOGIN_USER = `
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) { accessToken }
  }
`;

export const LOGOUT_USER = `mutation LogoutUser { logoutUser }`;
export const RESTORE_ACCESS_TOKEN = `mutation RestoreAccessToken { restoreAccessToken { accessToken } }`;
export const RESET_USER_PASSWORD = `
  mutation ResetUserPassword($password: String!) { resetUserPassword(password: $password) }
`;

export const CREATE_BOARD = `
  mutation CreateBoard($input: CreateBoardInput!) {
    createBoard(createBoardInput: $input) { ${boardFields} }
  }
`;

export const UPDATE_BOARD = `
  mutation UpdateBoard($boardId: ID!, $input: UpdateBoardInput!, $password: String) {
    updateBoard(boardId: $boardId, updateBoardInput: $input, password: $password) { ${boardFields} }
  }
`;

export const DELETE_BOARD = `mutation DeleteBoard($boardId: ID!) { deleteBoard(boardId: $boardId) }`;
export const LIKE_BOARD = `mutation LikeBoard($boardId: ID!) { likeBoard(boardId: $boardId) }`;
export const DISLIKE_BOARD = `mutation DislikeBoard($boardId: ID!) { dislikeBoard(boardId: $boardId) }`;

export const CREATE_BOARD_COMMENT = `
  mutation CreateBoardComment($boardId: ID!, $input: CreateBoardCommentInput!) {
    createBoardComment(boardId: $boardId, createBoardCommentInput: $input) {
      _id writer contents rating createdAt user { _id email name picture }
    }
  }
`;

export const UPDATE_BOARD_COMMENT = `
  mutation UpdateBoardComment($boardCommentId: ID!, $input: UpdateBoardCommentInput!, $password: String) {
    updateBoardComment(boardCommentId: $boardCommentId, updateBoardCommentInput: $input, password: $password) {
      _id writer contents rating createdAt user { _id email name picture }
    }
  }
`;

export const DELETE_BOARD_COMMENT = `
  mutation DeleteBoardComment($boardCommentId: ID!, $password: String) {
    deleteBoardComment(boardCommentId: $boardCommentId, password: $password)
  }
`;

export const CREATE_TRAVELPRODUCT = `
  mutation CreateTravelproduct($input: CreateTravelproductInput!) {
    createTravelproduct(createTravelproductInput: $input) { ${travelproductFields} }
  }
`;

export const UPDATE_TRAVELPRODUCT = `
  mutation UpdateTravelproduct($travelproductId: ID!, $input: UpdateTravelproductInput!) {
    updateTravelproduct(travelproductId: $travelproductId, updateTravelproductInput: $input) {
      ${travelproductFields}
    }
  }
`;

export const DELETE_TRAVELPRODUCT = `
  mutation DeleteTravelproduct($travelproductId: ID!) { deleteTravelproduct(travelproductId: $travelproductId) }
`;
export const TOGGLE_TRAVELPRODUCT_PICK = `
  mutation ToggleTravelproductPick($travelproductId: ID!) {
    toggleTravelproductPick(travelproductId: $travelproductId)
  }
`;
export const BUY_TRAVELPRODUCT = `
  mutation BuyTravelproduct($travelproductId: ID!) {
    createPointTransactionOfBuyingAndSelling(useritemId: $travelproductId) { ${travelproductFields} }
  }
`;

export const CREATE_TRAVELPRODUCT_QUESTION = `
  mutation CreateTravelproductQuestion($travelproductId: ID!, $contents: String!) {
    createTravelproductQuestion(
      travelproductId: $travelproductId
      createTravelproductQuestionInput: { contents: $contents }
    ) { _id contents createdAt user { _id email name picture } }
  }
`;
export const UPDATE_TRAVELPRODUCT_QUESTION = `
  mutation UpdateTravelproductQuestion($questionId: ID!, $contents: String!) {
    updateTravelproductQuestion(
      travelproductQuestionId: $questionId
      updateTravelproductQuestionInput: { contents: $contents }
    ) { _id contents createdAt user { _id email name picture } }
  }
`;
export const DELETE_TRAVELPRODUCT_QUESTION = `
  mutation DeleteTravelproductQuestion($questionId: ID!) {
    deleteTravelproductQuestion(travelproductQuestionId: $questionId)
  }
`;

export const CREATE_TRAVELPRODUCT_QUESTION_ANSWER = `
  mutation CreateTravelproductQuestionAnswer($questionId: ID!, $contents: String!) {
    createTravelproductQuestionAnswer(
      travelproductQuestionId: $questionId
      createTravelproductQuestionAnswerInput: { contents: $contents }
    ) { _id contents createdAt user { _id email name picture } }
  }
`;
export const UPDATE_TRAVELPRODUCT_QUESTION_ANSWER = `
  mutation UpdateTravelproductQuestionAnswer($answerId: ID!, $contents: String!) {
    updateTravelproductQuestionAnswer(
      travelproductQuestionAnswerId: $answerId
      updateTravelproductQuestionAnswerInput: { contents: $contents }
    ) { _id contents createdAt user { _id email name picture } }
  }
`;
export const DELETE_TRAVELPRODUCT_QUESTION_ANSWER = `
  mutation DeleteTravelproductQuestionAnswer($answerId: ID!) {
    deleteTravelproductQuestionAnswer(travelproductQuestionAnswerId: $answerId)
  }
`;

export const LOAD_POINT = `
  mutation LoadPoint($paymentId: ID!) {
    createPointTransactionOfLoading(paymentId: $paymentId) {
      _id amount balance status statusDetail createdAt
    }
  }
`;

export const UPLOAD_FILE = `
  mutation UploadFile($file: Upload!) { uploadFile(file: $file) { _id url size } }
`;
